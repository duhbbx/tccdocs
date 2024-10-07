# tccgen_compile

## 源码


```c
ST_FUNC int tccgen_compile(TCCState *s1)
{
	printf("#### 进入了 tccgen_compile 这个方法了.........\n");
    funcname = "";
    func_ind = -1;
    anon_sym = SYM_FIRST_ANOM;
    nocode_wanted = DATA_ONLY_WANTED; /* no code outside of functions */
    debug_modes = (s1->do_debug ? 1 : 0) | s1->test_coverage << 1;

    tcc_debug_start(s1);
    tcc_tcov_start (s1);
#ifdef TCC_TARGET_ARM
    arm_init(s1);
#endif
#ifdef INC_DEBUG
    printf("%s: **** new file\n", file->filename);
#endif
    parse_flags = PARSE_FLAG_PREPROCESS | PARSE_FLAG_TOK_NUM | PARSE_FLAG_TOK_STR;

	printf("#### next() 是干啥的.........\n");
    next();
    decl(VT_CONST);
    gen_inline_functions(s1);
    check_vstack();
    /* end of translation unit info */
    tcc_debug_end(s1);
    tcc_tcov_end(s1);
    return 0;
}

```


`tinycc` 是一个小型的 C 编译器，而 `tccgen_compile` 是其编译器核心中用于编译阶段的一个函数。这个函数负责执行编译过程中语法分析、符号表管理、代码生成等任务。下面我逐步解释这个函数的各个部分：

### 1. `printf("#### 进入了 tccgen_compile 这个方法了.........\n");`
- 这行代码是一个调试输出，表示程序进入了 `tccgen_compile` 函数。

### 2. `funcname = "";`
- 将 `funcname` 变量初始化为空字符串，表示当前还没有进入具体的函数定义。

### 3. `func_ind = -1;`
- 将 `func_ind` 设为 `-1`，通常用于表示当前还没有正在处理的函数。在实际的函数处理过程中，这个值可能会被更新。

### 4. `anon_sym = SYM_FIRST_ANOM;`
- `anon_sym` 变量被初始化为 `SYM_FIRST_ANOM`，表示无名符号的初始编号。它通常用于匿名符号的命名管理（例如匿名结构体或匿名变量）。

### 5. `nocode_wanted = DATA_ONLY_WANTED;`
- `nocode_wanted` 被设置为 `DATA_ONLY_WANTED`，表明当前只需要处理数据而不需要生成代码。通常，在编译器处理全局变量或数据声明时，代码生成是被延迟的，直到需要编译函数或执行代码时才会开启。

### 6. `debug_modes = (s1->do_debug ? 1 : 0) | s1->test_coverage << 1;`
- 设置 `debug_modes` 变量：
  - 如果 `s1->do_debug` 为 `true`，则启用调试模式 (`debug_modes` 的第 0 位)。
  - 如果 `s1->test_coverage` 为 `true`，则启用代码覆盖率测试 (`debug_modes` 的第 1 位)。

### 7. `tcc_debug_start(s1);`
- 调用 `tcc_debug_start` 函数，这个函数通常用于初始化调试信息的收集过程，可能会打开调试符号记录，准备生成调试信息。

### 8. `tcc_tcov_start(s1);`
- 调用 `tcc_tcov_start` 函数，可能用于初始化代码覆盖率测试的统计工作。如果代码覆盖率被启用，那么在编译期间需要插入相应的统计代码。

### 9. `#ifdef TCC_TARGET_ARM`
- 这里是条件编译的部分，如果编译目标平台是 ARM 架构，调用 `arm_init(s1);` 进行 ARM 平台特定的初始化工作。

### 10. `#ifdef INC_DEBUG`
- 另一个条件编译部分。如果 `INC_DEBUG` 被定义，会输出当前文件的名字，表示进入了一个新的文件编译阶段。

### 11. `parse_flags = PARSE_FLAG_PREPROCESS | PARSE_FLAG_TOK_NUM | PARSE_FLAG_TOK_STR;`
- 设置解析标志 `parse_flags`：
  - `PARSE_FLAG_PREPROCESS`：启用预处理阶段，例如宏替换。
  - `PARSE_FLAG_TOK_NUM`：解析数字常量。
  - `PARSE_FLAG_TOK_STR`：解析字符串常量。
  
### 12. `next();`
- `next()` 是编译器的词法分析器函数，通常用于读取下一个 token。它将分析源代码并返回一个 token，推进编译器的解析进度。

### 13. `decl(VT_CONST);`
- `decl()` 是用于解析声明的函数，参数 `VT_CONST` 表示这次解析的声明是一个常量。`decl` 负责解析全局变量、函数、类型等各种声明。

### 14. `gen_inline_functions(s1);`
- 调用 `gen_inline_functions(s1);`，该函数用于生成内联函数的代码。在 C 编译中，内联函数在编译时可以被直接展开为内联代码，而不是生成函数调用。

### 15. `check_vstack();`
- `check_vstack()` 可能是用于检查编译过程中虚拟栈的状态，确保在编译过程中没有违反栈的使用规则。这在处理表达式计算和代码生成时很重要。

### 16. `tcc_debug_end(s1);`
- 调用 `tcc_debug_end(s1)` 结束调试信息的收集，可能会关闭调试符号文件或做最后的调试信息写入。

### 17. `tcc_tcov_end(s1);`
- 调用 `tcc_tcov_end(s1)` 结束代码覆盖率测试的收集工作。

### 18. `return 0;`
- 函数返回 0，表示编译成功。这个返回值通常用来指示是否发生了错误，0 代表一切正常。

### 总结
这个函数是 `TinyCC` 的编译核心部分，负责从全局开始编译一个翻译单元（通常是一个 C 源文件），它的职责包括初始化编译状态、调用词法分析器和语法分析器、解析声明、生成内联函数、并最终生成调试和覆盖率信息。

## 为啥没有明确看到语法分析的过程


你是对的，从这个 `tccgen_compile` 函数的代码中，我们确实看不到完整的语法分析过程。这个函数看起来像是 `TinyCC` 编译过程的一个高层入口点，负责初始化、配置一些状态，以及调用必要的模块来进行词法分析、声明解析和代码生成等任务。

如果要详细讨论语法分析，我们需要理解在 `TinyCC` 的架构中，语法分析（或称解析过程）通常由多个函数模块共同完成，而不一定是集中在一个函数中。

虽然 `tccgen_compile` 中没有直接展示完整的语法分析流程，但它通过调用其他函数间接完成了语法分析。以下是可能涉及的几个步骤：

### 1. `next()` 函数
`next()` 函数负责词法分析，即读取源代码并将其拆解为一系列的 tokens（词法单元）。词法分析是语法分析的前置步骤，它将代码中的标识符、关键字、符号等转化为可以供语法分析器使用的基本单元。

在 `TinyCC` 中，`next()` 是负责词法分析的核心函数，而在典型的编译器实现中，词法分析器通常会不断调用 `next()` 来逐步获取 tokens，直到完成整个文件的扫描。

### 2. `decl(VT_CONST)` 函数
`decl()` 是负责解析声明的函数，在 C 编译器中，声明解析是语法分析的一部分。这个函数会根据传入的参数（例如 `VT_CONST`）来解析不同类型的声明，包括变量声明、函数声明、类型声明等。

声明解析是语法分析中的重要部分，因为它涉及到处理代码的结构化元素，例如变量的类型、函数的参数和返回值等。在 `TinyCC` 中，`decl()` 可能会递归调用其他解析函数来处理更复杂的语法结构。

### 3. 隐式的语法分析
语法分析的目的是将词法分析产生的 token 序列转化为抽象语法树（AST）。在 `TinyCC` 中，语法分析可能是隐式完成的，特别是通过多个递归调用的函数来解析不同的代码结构。例如，当 `decl()` 处理声明时，它可能会递归调用其他函数来解析函数体、表达式等。

语法分析和代码生成可能是紧密结合的，在解析代码的同时直接生成代码（即边解析边生成），这种方式在 `TinyCC` 这种轻量级编译器中比较常见。因此，我们在这个函数中看不到一个显式的单独语法分析阶段。

### 4. 其他可能的语法分析函数
`TinyCC` 可能还有其他模块化的函数专门负责解析不同的语法结构，例如：
- 解析表达式的函数
- 解析语句的函数（如 `if`, `while`, `for` 等控制流语句）
- 解析函数定义和调用

这些函数通常不会直接出现在 `tccgen_compile` 函数中，但它们会在 `decl()` 或其他类似的解析函数内部被递归调用。

### 结论
`TinyCC` 的语法分析流程在 `tccgen_compile` 函数中是通过多个步骤间接完成的，尤其是通过调用 `next()` 进行词法分析，然后调用 `decl()` 进行声明解析。语法分析本身没有集中在某个单独的函数中，而是分散在多个函数之间，并且和代码生成过程紧密结合。

如果你想深入了解 `TinyCC` 的语法分析，可以进一步查看 `decl()` 和其他处理表达式、语句的函数，它们很可能负责了具体的语法解析任务。