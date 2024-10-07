# 没看懂 tinycc 中的  current value 是什么意思？



```c
/* The current value can be: */
#define VT_VALMASK   0x003f  /* mask for value location, register or: */
#define VT_CONST     0x0030  /* constant in vc (must be first non register value) */
#define VT_LLOCAL    0x0031  /* lvalue, offset on stack */
#define VT_LOCAL     0x0032  /* offset on stack */
#define VT_CMP       0x0033  /* the value is stored in processor flags (in vc) */
#define VT_JMP       0x0034  /* value is the consequence of jmp true (even) */
#define VT_JMPI      0x0035  /* value is the consequence of jmp false (odd) */
#define VT_LVAL      0x0100  /* var is an lvalue */
#define VT_SYM       0x0200  /* a symbol value is added */
#define VT_MUSTCAST  0x0C00  /* value must be casted to be correct (used for
                                char/short stored in integer registers) */
#define VT_NONCONST  0x1000  /* VT_CONST, but not an (C standard) integer
                                constant expression */
#define VT_MUSTBOUND 0x4000  /* bound checking must be done before
                                dereferencing value */
#define VT_BOUNDED   0x8000  /* value is bounded. The address of the
                                bounding function call point is in vc */
/* types */
#define VT_BTYPE       0x000f  /* mask for basic type */
#define VT_VOID             0  /* void type */
#define VT_BYTE             1  /* signed byte type */
#define VT_SHORT            2  /* short type */
#define VT_INT              3  /* integer type */
#define VT_LLONG            4  /* 64 bit integer */
#define VT_PTR              5  /* pointer */
#define VT_FUNC             6  /* function type */
#define VT_STRUCT           7  /* struct/union definition */
#define VT_FLOAT            8  /* IEEE float */
#define VT_DOUBLE           9  /* IEEE double */
#define VT_LDOUBLE         10  /* IEEE long double */
#define VT_BOOL            11  /* ISOC99 boolean type */
#define VT_QLONG           13  /* 128-bit integer. Only used for x86-64 ABI */
#define VT_QFLOAT          14  /* 128-bit float. Only used for x86-64 ABI */

#define VT_UNSIGNED    0x0010  /* unsigned type */
#define VT_DEFSIGN     0x0020  /* explicitly signed or unsigned */
#define VT_ARRAY       0x0040  /* array type (also has VT_PTR) */
#define VT_BITFIELD    0x0080  /* bitfield modifier */
#define VT_CONSTANT    0x0100  /* const modifier */
#define VT_VOLATILE    0x0200  /* volatile modifier */
#define VT_VLA         0x0400  /* VLA type (also has VT_PTR and VT_ARRAY) */
#define VT_LONG        0x0800  /* long type (also has VT_INT rsp. VT_LLONG) */

/* storage */
#define VT_EXTERN  0x00001000  /* extern definition */
#define VT_STATIC  0x00002000  /* static variable */
#define VT_TYPEDEF 0x00004000  /* typedef definition */
#define VT_INLINE  0x00008000  /* inline definition */
/* currently unused: 0x000[1248]0000  */

#define VT_STRUCT_SHIFT 20     /* shift for bitfield shift values (32 - 2*6) */
#define VT_STRUCT_MASK (((1U << (6+6)) - 1) << VT_STRUCT_SHIFT | VT_BITFIELD)
#define BIT_POS(t) (((t) >> VT_STRUCT_SHIFT) & 0x3f)
#define BIT_SIZE(t) (((t) >> (VT_STRUCT_SHIFT + 6)) & 0x3f)

#define VT_UNION    (1 << VT_STRUCT_SHIFT | VT_STRUCT)
#define VT_ENUM     (2 << VT_STRUCT_SHIFT) /* integral type is an enum really */
#define VT_ENUM_VAL (3 << VT_STRUCT_SHIFT) /* integral type is an enum constant really */

#define IS_ENUM(t) ((t & VT_STRUCT_MASK) == VT_ENUM)
#define IS_ENUM_VAL(t) ((t & VT_STRUCT_MASK) == VT_ENUM_VAL)
#define IS_UNION(t) ((t & (VT_STRUCT_MASK|VT_BTYPE)) == VT_UNION)

#define VT_ATOMIC   VT_VOLATILE

/* type mask (except storage) */
#define VT_STORAGE (VT_EXTERN | VT_STATIC | VT_TYPEDEF | VT_INLINE)
#define VT_TYPE (~(VT_STORAGE|VT_STRUCT_MASK))

/* symbol was created by tccasm.c first */
#define VT_ASM (VT_VOID | 1 << VT_STRUCT_SHIFT)
#define VT_ASM_FUNC (VT_ASM | 2 << VT_STRUCT_SHIFT)
#define IS_ASM_SYM(sym) (((sym)->type.t & (VT_BTYPE | VT_ASM)) == VT_ASM)

/* general: set/get the pseudo-bitfield value for bit-mask M */
#define BFVAL(M,N) ((unsigned)((M) & ~((M) << 1)) * (N))
#define BFGET(X,M) (((X) & (M)) / BFVAL(M,1))
#define BFSET(X,M,N) ((X) = ((X) & ~(M)) | BFVAL(M,N))
```




在 `TinyCC` 中，`current value` 是用于表示编译过程中一个表达式或变量的**存储位置**或者**计算结果**的具体状态。在表达式计算和代码生成过程中，编译器需要跟踪每个值的当前状态，以便知道它是保存在寄存器、栈、常量池，还是需要进行某种处理，比如跳转（`jmp`）或者符号引用（`symbol reference`）等。这个机制通过一系列的宏定义和位标志来实现，这些宏定义了值在编译器内部的各种状态。

`current value` 的概念可以理解为在编译过程中一个值的**具体位置或类型**，编译器会根据这个信息来生成合适的代码。

### 宏的解释

这些宏定义用于标记 `TinyCC` 编译器中的值类型和状态。它们被组合使用，编码了当前值在不同阶段的状态和位置。让我们逐一解释这些标志。

#### 1. `VT_VALMASK`
```c
#define VT_VALMASK  0x003f
```
- 这是一个掩码，用于提取值的位置或类型信息。通过 `VT_VALMASK`，可以获得值在处理器中的具体位置或类型，比如是否是常量、局部变量等。

#### 2. `VT_CONST`
```c
#define VT_CONST  0x0030
```
- 表示一个**常量**值。常量存储在变量 `vc` 中，表示不需要从内存或寄存器读取的值，直接使用它的常量即可。

#### 3. `VT_LLOCAL`
```c
#define VT_LLOCAL  0x0031
```
- 表示一个**左值**（`lvalue`），并且它的值是位于栈上的**局部变量**。左值意味着可以对这个值进行赋值操作。

#### 4. `VT_LOCAL`
```c
#define VT_LOCAL  0x0032
```
- 表示一个局部变量的**偏移量**，它位于栈上。这个宏和 `VT_LLOCAL` 相似，但表示的是一个**右值**（`rvalue`），即一个可以被读取但不能直接赋值的值。

#### 5. `VT_CMP`
```c
#define VT_CMP  0x0033
```
- 表示比较操作的结果存储在**处理器的标志位**（flags）中。例如，在 x86 架构上，比较操作的结果会被存储在 `EFLAGS` 寄存器中，这个标志告诉后续代码生成如何利用这些标志位执行条件跳转。

#### 6. `VT_JMP` 和 `VT_JMPI`
```c
#define VT_JMP  0x0034
#define VT_JMPI  0x0035
```
- `VT_JMP` 表示一个值依赖于条件跳转的结果（比如 `if` 语句的 `true` 分支）。
- `VT_JMPI` 表示跳转结果是 `false`（`false` 分支的跳转）。

这两个宏主要用于跟踪条件跳转指令的结果。

#### 7. `VT_LVAL`
```c
#define VT_LVAL  0x0100
```
- 表示当前的值是一个**左值**（`lvalue`），即可以被赋值的变量或表达式。编译器在遇到赋值操作时会检查这个标志，以确认是否允许对当前值进行修改。

#### 8. `VT_SYM`
```c
#define VT_SYM  0x0200
```
- 表示当前的值是**符号引用**。符号可以是全局变量、函数名、或者其他在编译期间需要解析的标识符。

#### 9. `VT_MUSTCAST`
```c
#define VT_MUSTCAST  0x0C00
```
- 表示当前的值**必须进行类型转换**。这通常发生在小范围类型（如 `char` 或 `short`）存储在更大范围的寄存器中（如 `int` 类型时）。为了确保表达式的类型一致性，在生成代码前，编译器必须对这些值进行强制类型转换。

#### 10. `VT_NONCONST`
```c
#define VT_NONCONST  0x1000
```
- 表示当前的常量并不是一个 C 标准定义的**整数常量表达式**，例如它可能是一个浮点常量或其他非常量类型。这个标志有助于编译器在某些语法规则中区分不同类型的常量。

#### 11. `VT_MUSTBOUND`
```c
#define VT_MUSTBOUND  0x4000
```
- 表示在解引用值之前，必须进行**边界检查**。这通常用于编译器生成代码时的内存安全检查，确保指针解引用时不会越界。

#### 12. `VT_BOUNDED`
```c
#define VT_BOUNDED  0x8000
```
- 表示当前值已经过了边界检查。编译器可以在生成代码时跳过进一步的边界检查，因为这个值已经被安全验证过。

### 总体理解

`TinyCC` 编译器通过这些宏来表示**当前值的状态**，这些状态主要与以下几点有关：

1. **值的位置**：是存储在寄存器、栈、内存、还是常量池中。
2. **值的类型**：是常量、局部变量、左值、右值等。
3. **值的语义**：比如是否需要类型转换、边界检查、符号解析等。

这些宏结合在一起，用来管理和跟踪在表达式解析、类型检查和代码生成过程中每个值的状态。通过这些标志位，编译器能够决定如何处理值，比如生成相应的指令，做什么样的类型转换，或者执行什么样的跳转逻辑。

### 使用场景

假设编译器在处理某个表达式时，它可以通过 `current value` 来记录这个表达式的计算结果的状态。如果这个表达式是一个常量（如 `5`），那么 `VT_CONST` 就会被设置。如果这个常量需要类型转换（如 `int` 转换为 `float`），则会设置 `VT_MUSTCAST`。

再例如，若某个值是一个局部变量，存储在栈上，编译器会设置 `VT_LOCAL` 或 `VT_LLOCAL`，表示该值的存储位置，以便后续生成代码时知道从哪里读取这个值。

通过这些标志，`TinyCC` 编译器能有效地管理和优化编译过程。


