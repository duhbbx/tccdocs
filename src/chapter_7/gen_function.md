
# gen_function

```c
/* parse a function defined by symbol 'sym' and generate its code in
   'cur_text_section', 我尼玛的，你真是牛逼，直接就准备生成代码了？ */
static void gen_function(Sym *sym)
{
    struct scope f = { 0 };
    cur_scope = root_scope = &f; // 当前作用域和跟作用域
    nocode_wanted = 0;

    cur_text_section->sh_flags |= SHF_EXECINSTR;
    ind = cur_text_section->data_offset;
    if (sym->a.aligned) {
	    size_t newoff = section_add(cur_text_section, 0, 1 << (sym->a.aligned - 1));
	    gen_fill_nops(newoff - ind);
    }

    funcname = get_tok_str(sym->v, NULL);
    func_ind = ind;
    func_vt = sym->type.ref->type;
    func_var = sym->type.ref->f.func_type == FUNC_ELLIPSIS;

    /* NOTE: we patch the symbol size later */
    put_extern_sym(sym, cur_text_section, ind, 0);

    if (sym->type.ref->f.func_ctor)
        add_array (tcc_state, ".init_array", sym->c);
    if (sym->type.ref->f.func_dtor)
        add_array (tcc_state, ".fini_array", sym->c);

    /* put debug symbol */
    tcc_debug_funcstart(tcc_state, sym);

    /* push a dummy symbol to enable local sym storage */
    sym_push2(&local_stack, SYM_FIELD, 0, 0);
    local_scope = 1; /* for function parameters */
    gfunc_prolog(sym);
    tcc_debug_prolog_epilog(tcc_state, 0);

    local_scope = 0;
    rsym = 0;
    clear_temp_local_var_list();
    func_vla_arg(sym);
    block(0);
    gsym(rsym);

    nocode_wanted = 0;
    /* reset local stack */
    pop_local_syms(NULL, 0);
    tcc_debug_prolog_epilog(tcc_state, 1);
    gfunc_epilog();

    /* end of function */
    tcc_debug_funcend(tcc_state, ind - func_ind);

    /* patch symbol size */
    elfsym(sym)->st_size = ind - func_ind;

    cur_text_section->data_offset = ind;
    local_scope = 0;
    label_pop(&global_label_stack, NULL, 0);
    sym_pop(&all_cleanups, NULL, 0);

    /* It's better to crash than to generate wrong code */
    cur_text_section = NULL;
    funcname = ""; /* for safety */
    func_vt.t = VT_VOID; /* for safety */
    func_var = 0; /* for safety */
    ind = 0; /* for safety */
    func_ind = -1;
    nocode_wanted = DATA_ONLY_WANTED;
    check_vstack();

    /* do this after funcend debug info */
    next();
}
```

`gen_function` 是 `TinyCC` 中负责生成一个函数代码的核心函数。它的作用是完成函数代码的生成，包括设置作用域、处理函数的入口和出口、生成必要的调试信息、符号管理等。下面我会详细分解这个函数的每个步骤，帮助你理解它的内部逻辑。

### 1. 初始化作用域
```c
struct scope f = { 0 };
cur_scope = root_scope = &f; // 当前作用域和根作用域
nocode_wanted = 0;
```
- 定义并初始化了一个函数级别的作用域 `f`。
- `cur_scope` 和 `root_scope` 被设置为这个作用域，表示当前编译的作用域是函数内部的作用域，同时这个作用域是函数的根作用域。
- `nocode_wanted` 被设置为 0，意味着在此作用域下将会生成代码（而非仅仅处理数据声明）。

### 2. 设置代码段属性
```c
cur_text_section->sh_flags |= SHF_EXECINSTR;
ind = cur_text_section->data_offset;
```
- `cur_text_section` 表示当前的文本段（即保存可执行代码的段），其 `sh_flags` 被设置为 `SHF_EXECINSTR`，表示这个段包含可执行指令。
- `ind` 用来存储当前文本段的 `data_offset`（数据偏移），表示接下来生成代码的位置。

### 3. 函数对齐与 NOP 指令填充
```c
if (sym->a.aligned) {
    size_t newoff = section_add(cur_text_section, 0, 1 << (sym->a.aligned - 1));
    gen_fill_nops(newoff - ind);
}
```
- 如果函数的符号 `sym` 具有对齐要求（即 `sym->a.aligned` 不为 0），则通过 `section_add` 函数调整文本段的位置以满足对齐要求。对齐值由 `sym->a.aligned` 决定。
- `gen_fill_nops` 函数用来在对齐区域中填充 NOP 指令，这样可以保证指令不会被对齐操作影响。

### 4. 设置函数元数据
```c
funcname = get_tok_str(sym->v, NULL);
func_ind = ind;
func_vt = sym->type.ref->type;
func_var = sym->type.ref->f.func_type == FUNC_ELLIPSIS;
```
- `funcname` 保存了函数的名字，通过 `get_tok_str` 从符号 `sym` 中提取。
- `func_ind` 记录了函数在文本段中的起始位置，`ind` 是文本段的偏移量。
- `func_vt` 表示函数的返回类型（变量类型，`vt` 即 `variable type`），`sym->type.ref->type` 获取到的是函数返回类型。
- `func_var` 表示函数是否是一个可变参数函数（`FUNC_ELLIPSIS` 表示这是一个带有可变参数的函数）。

### 5. 处理符号表与构造/析构函数
```c
put_extern_sym(sym, cur_text_section, ind, 0);

if (sym->type.ref->f.func_ctor)
    add_array(tcc_state, ".init_array", sym->c);
if (sym->type.ref->f.func_dtor)
    add_array(tcc_state, ".fini_array", sym->c);
```
- `put_extern_sym` 将函数的符号 `sym` 放入全局符号表中，并与当前文本段绑定（以便之后的链接）。
- 如果函数被标记为构造函数（`func_ctor`），则将其加入 `.init_array`，这意味着它会在程序启动时被调用。
- 如果函数被标记为析构函数（`func_dtor`），则将其加入 `.fini_array`，这意味着它会在程序结束时被调用。

### 6. 生成调试符号与函数序言
```c
tcc_debug_funcstart(tcc_state, sym);

sym_push2(&local_stack, SYM_FIELD, 0, 0);
local_scope = 1; /* for function parameters */
gfunc_prolog(sym);
tcc_debug_prolog_epilog(tcc_state, 0);
```
- `tcc_debug_funcstart` 生成函数的调试符号（用于调试器）。
- `sym_push2` 向 `local_stack` 中推入一个空的符号，这样可以使后续的局部符号（变量等）能够有合适的作用域。
- `local_scope = 1` 设置为局部作用域，用于函数参数的处理。
- `gfunc_prolog` 生成函数的序言部分，这通常包括设置栈帧等代码，准备进入函数的正式执行。
- `tcc_debug_prolog_epilog` 用来生成调试信息，标记函数序言和尾声部分的开始和结束。

### 7. 生成函数体
```c
local_scope = 0;
rsym = 0;
clear_temp_local_var_list();
func_vla_arg(sym);
block(0);
gsym(rsym);
```
- `local_scope = 0` 重置局部作用域，表示函数体的局部变量的作用域从现在开始。
- `clear_temp_local_var_list` 清空临时局部变量列表。
- `func_vla_arg` 处理函数中的可变长度数组参数。
- `block(0)` 调用函数解析并生成函数体的代码。`block` 负责处理函数内部的代码块。
- `gsym(rsym)` 用于处理跳转符号（`rsym` 是保存跳转目标的符号）。

### 8. 函数尾声处理与符号清理
```c
nocode_wanted = 0;
pop_local_syms(NULL, 0);
tcc_debug_prolog_epilog(tcc_state, 1);
gfunc_epilog();
```
- `pop_local_syms` 清除局部符号（局部变量、临时变量等）。
- `tcc_debug_prolog_epilog(tcc_state, 1)` 生成调试信息，标记函数尾声部分。
- `gfunc_epilog` 生成函数尾声代码，通常包括恢复栈帧、返回值的处理等。

### 9. 函数结束与符号大小补丁
```c
tcc_debug_funcend(tcc_state, ind - func_ind);
elfsym(sym)->st_size = ind - func_ind;
```
- `tcc_debug_funcend` 生成函数结束的调试信息。
- `elfsym(sym)->st_size = ind - func_ind` 设置 ELF 符号表中该函数的大小，`ind - func_ind` 表示该函数生成的代码字节数。

### 10. 清理操作与安全措施
```c
cur_text_section->data_offset = ind;
local_scope = 0;
label_pop(&global_label_stack, NULL, 0);
sym_pop(&all_cleanups, NULL, 0);

cur_text_section = NULL;
funcname = ""; /* for safety */
func_vt.t = VT_VOID; /* for safety */
func_var = 0; /* for safety */
ind = 0; /* for safety */
func_ind = -1;
nocode_wanted = DATA_ONLY_WANTED;
check_vstack();
```
- `cur_text_section->data_offset = ind` 更新文本段的偏移位置。
- `label_pop` 和 `sym_pop` 负责清理全局标签和符号栈中的内容。
- 接下来的几行代码重置了函数相关的全局变量，为了避免生成错误的代码或者发生不安全的操作：
  - `cur_text_section` 被置空；
  - `funcname` 被设置为空字符串；
  - `func_vt.t` 被设置为 `VT_VOID`；
  - `func_var` 被置为 0；
  - `ind` 被重置；
  - `func_ind` 也被重置为 -1；
  - `nocode_wanted` 被设置为 `DATA_ONLY_WANTED`，表示当前不再需要生成代码。
- `check_vstack` 最后检查虚拟栈的状态，确保生成的代码没有栈溢出或未平衡的栈操作。

### 11. 解析下一个 token
```c
next();
```
- 这行代码表示从源代码中获取下一个 token，继续编译流程。

### 总结

`gen_function` 函数是 `TinyCC` 中负责生成一个函数代码的核心逻辑。它执行的主要任务包括：
1. 初始化函数的作用域、符号表、代码段等必要的数据结构。
2. 处理函数的对齐、符号信息，并生成调试信息。
3. 生成函数的序言、函数体和尾声代码。
4. 清理局部符号、更新符号表，并确保代码生成的安全性。

它将函数编译的多个步骤紧密结合在一起，通过对符号、作用域和代码段的操作来实现函数代码的生成。