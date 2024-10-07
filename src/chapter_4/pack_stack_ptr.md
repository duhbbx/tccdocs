

# pack_stack_ptr



tinycc 中的这个 pack stack ptr 又是啥？

```c
s1->pack_stack[0] = 0;
s1->pack_stack_ptr = s1->pack_stack;
```

在 `TinyCC` 中，`pack_stack` 和 `pack_stack_ptr` 是用于管理**结构体成员对齐**的栈结构。这个栈的作用是跟踪 `#pragma pack` 或 `__attribute__((packed))` 指定的内存对齐设置。

在 C 语言中，结构体成员的默认对齐方式是由编译器决定的，通常根据 CPU 的架构对齐要求来调整每个成员的对齐边界。通过 `#pragma pack` 或 `__attribute__((packed))`，开发者可以修改结构体的对齐方式，以减少内存浪费或者满足特定的硬件要求。`TinyCC` 使用 `pack_stack` 来管理这种对齐设置的嵌套情况。

### 1. `pack_stack` 和 `pack_stack_ptr`

- **`pack_stack`** 是一个栈，用来存储当前的结构体对齐设置。当编译器遇到 `#pragma pack` 或 `__attribute__((packed))` 等指令时，它会将当前的对齐设置推入栈中，并根据新指令更新对齐值。
  
- **`pack_stack_ptr`** 是指向 `pack_stack` 栈顶的指针，用于表示当前的对齐设置。

### 工作原理

在 C 语言中，`#pragma pack` 指令可以通过指定的字节数来控制结构体成员的对齐方式。例如：

```c
#pragma pack(1)
struct PackedStruct {
    char a;
    int b;
};
```

这段代码通过 `#pragma pack(1)` 指令告诉编译器，`PackedStruct` 的成员应该按照 1 字节对齐，即取消默认的对齐方式，从而将 `int b` 按 1 字节对齐，而不是通常的 4 字节对齐。

编译器在处理对齐设置时，通常需要考虑嵌套结构。例如：

```c
#pragma pack(2)
struct A {
    char a;
    int b;
};

#pragma pack(push, 4)
struct B {
    char c;
    int d;
};
#pragma pack(pop)
```

在这种情况下，`#pragma pack(push, 4)` 会将当前的对齐设置（2 字节）推入栈中，并应用新的 4 字节对齐设置，直到 `#pragma pack(pop)` 恢复原来的设置。`TinyCC` 使用 `pack_stack` 来管理这种对齐设置的嵌套状态。

### 2. `s1->pack_stack[0] = 0;`

这行代码将 `pack_stack` 的栈底（`pack_stack[0]`）设置为 `0`。在 C 语言中，`0` 通常表示**默认的对齐方式**，即编译器使用其默认的对齐规则，而不进行特殊处理。

- `pack_stack[0] = 0` 表示栈底的对齐设置是默认的，编译器会使用平台的默认对齐规则（通常是 4 字节或 8 字节对齐，取决于目标平台）。

### 3. `s1->pack_stack_ptr = s1->pack_stack;`

这行代码将 `pack_stack_ptr` 指向 `pack_stack` 的栈底位置，表示当前的对齐设置是栈中的第一个元素（即默认对齐方式）。随着 `#pragma pack` 或 `__attribute__((packed))` 等指令的嵌套，`pack_stack_ptr` 将会指向栈中其他元素，以跟踪对齐设置的变化。

### 4. 例子说明

当你使用 `#pragma pack` 指令时，编译器需要保存之前的对齐设置，以便在离开特定作用域时恢复之前的对齐方式。`pack_stack` 负责存储这些对齐值，`pack_stack_ptr` 则负责指向当前的对齐设置。假设有以下代码：

```c
#pragma pack(1)
struct A {
    char a;
    int b;
};
#pragma pack(4)
struct B {
    char c;
    int d;
};
```

在这种情况下：

- 编译器遇到 `#pragma pack(1)` 时，会将当前的对齐值（假设为默认的 4 字节对齐）推入 `pack_stack`，并更新 `pack_stack_ptr` 指向新对齐值 `1`。
- 当遇到 `#pragma pack(4)` 时，再次更新对齐值，`pack_stack_ptr` 指向新的对齐值 `4`。

### 5. 总结

- **`pack_stack`** 是一个栈，用来存储结构体成员对齐的设置，允许 `#pragma pack` 或 `__attribute__((packed))` 的对齐指令嵌套。
- **`pack_stack_ptr`** 是指向 `pack_stack` 栈顶的指针，用于表示当前的对齐设置。
- **`s1->pack_stack[0] = 0;`** 表示默认的对齐方式是平台的默认对齐规则，通常是 4 字节或 8 字节对齐。
- **`s1->pack_stack_ptr = s1->pack_stack;`** 初始化 `pack_stack_ptr`，使其指向栈底，表示编译开始时的默认对齐设置。

通过这种方式，`TinyCC` 能够管理复杂的对齐设置，确保在不同的作用域中正确处理 `#pragma pack` 的嵌套。

