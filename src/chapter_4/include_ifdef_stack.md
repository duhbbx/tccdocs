# include ifdef stack






## tinycc 中的这几个是干啥用的？




```c
s1->include_stack_ptr = s1->include_stack;
s1->ifdef_stack_ptr = s1->ifdef_stack;
file->ifdef_stack_ptr = s1->ifdef_stack_ptr;
```

在 `TinyCC`（`TCC`）编译器中，`include_stack` 和 `ifdef_stack` 是用于管理**头文件包含**和**条件编译状态**的栈结构。这些栈的主要作用是在编译预处理阶段跟踪 `#include` 文件的嵌套层次和 `#ifdef`（条件编译）语句的嵌套状态。

### 1. `include_stack` 和 `include_stack_ptr`

- **`include_stack`** 是一个栈结构，用于管理 `#include` 头文件的嵌套。C 语言的 `#include` 预处理指令允许嵌套多个头文件，编译器需要跟踪当前文件是通过哪些 `#include` 包含进来的。
- **`include_stack_ptr`** 是一个指针，它指向当前的栈顶位置，表示当前正在处理的文件。

#### 工作原理：
当编译器遇到 `#include` 指令时，它会打开并处理头文件。在每次进入一个新的头文件时，编译器会将当前的文件状态（例如文件指针、文件名、行号等）推入 `include_stack` 中，并更新 `include_stack_ptr` 来指向下一个文件。这样可以确保在头文件处理完毕后，编译器能够回到正确的文件继续编译。

例如：

```c
#include <stdio.h>
#include "myfile.h"
```

在编译 `myfile.h` 时，当前文件（比如 `main.c`）的状态会被保存到 `include_stack`，然后编译器切换到 `myfile.h`。一旦 `myfile.h` 处理完毕，编译器会从 `include_stack` 中弹出先前保存的状态，继续处理 `main.c`。

### 2. `ifdef_stack` 和 `ifdef_stack_ptr`

- **`ifdef_stack`** 是另一个栈结构，用于管理条件编译的嵌套状态。在 C 语言的预处理阶段，`#ifdef`、`#ifndef`、`#else` 和 `#endif` 指令允许根据预处理符号来有条件地包含代码。编译器需要跟踪这些条件编译的嵌套状态，以确保正确跳过或编译代码段。
- **`ifdef_stack_ptr`** 是指向条件编译栈的指针，表示当前的条件编译状态。

#### 工作原理：
在编译时，遇到 `#ifdef` 或 `#ifndef` 时，编译器会将当前的条件状态（是否满足编译条件）推入 `ifdef_stack`，并更新 `ifdef_stack_ptr` 来指向新的状态。当遇到 `#else` 或 `#endif` 时，编译器从栈中弹出之前的条件状态，确保正确处理嵌套的条件编译。

例如：

```c
#ifdef DEBUG
    // 仅在定义 DEBUG 时编译
#endif
```

当编译器遇到 `#ifdef DEBUG` 时，它会将当前的条件编译状态保存到 `ifdef_stack` 中，并更新 `ifdef_stack_ptr`，以便在遇到 `#endif` 时恢复之前的状态。

### 3. 代码分析

```c
s1->include_stack_ptr = s1->include_stack;
s1->ifdef_stack_ptr = s1->ifdef_stack;
file->ifdef_stack_ptr = s1->ifdef_stack_ptr;
```

这几行代码初始化了 `TinyCC` 的预处理器状态，主要用于设置 `include` 和 `ifdef` 栈的起始位置：

- `s1->include_stack_ptr = s1->include_stack;`：将 `s1`（通常是表示编译状态的结构体）的 `include_stack_ptr` 指针指向 `include_stack` 的起始位置。表示在编译开始时，文件的包含栈处于栈底，也就是没有嵌套的 `#include` 文件。
  
- `s1->ifdef_stack_ptr = s1->ifdef_stack;`：将 `ifdef_stack_ptr` 初始化为 `ifdef_stack` 的起始位置，表示条件编译的栈也处于栈底，当前还没有任何 `#ifdef` 的嵌套。

- `file->ifdef_stack_ptr = s1->ifdef_stack_ptr;`：将 `file` 的 `ifdef_stack_ptr` 设置为当前全局的 `ifdef_stack_ptr`，这表示当前文件在进入之前的条件编译状态将与当前的全局条件编译状态同步。这样做的目的是在编译新文件时能继承并跟踪全局的条件编译状态。

### 总结

- **`include_stack`**：用于管理 `#include` 头文件的嵌套情况，帮助编译器跟踪当前在哪个头文件中，以便在处理完头文件后正确返回。
- **`ifdef_stack`**：用于管理条件编译（如 `#ifdef`、`#ifndef`）的嵌套状态，确保正确编译或跳过代码块。
- **`*_stack_ptr`**：是指向栈顶的指针，表示当前的处理状态，通过这些指针可以动态跟踪文件的包含和条件编译的嵌套情况。

这些栈结构的初始化和使用，确保了编译器可以正确处理多层的头文件包含和条件编译，是 `TinyCC` 预处理阶段的重要组成部分。


