# lldb如何指定源码中的函数？




在 `LLDB` 中，如果你想指定并调试源码中的函数，可以使用以下几种方法来访问和操作特定函数：

### 1. **使用 `breakpoint` 设置断点**
通过 `breakpoint` 命令，可以在源码中的函数上设置断点。当程序执行到该函数时，`LLDB` 会暂停执行并进入调试模式。

#### 示例：
假设你想在函数 `foo` 上设置断点，你可以使用以下命令：

```bash
(lldb) breakpoint set --name foo
```

或者使用简短的命令：

```bash
(lldb) b foo
```

这将在当前加载的二进制中找到名为 `foo` 的函数并设置断点。当程序运行到 `foo` 函数时，程序将暂停。

### 2. **使用 `image lookup` 查找函数信息**

如果你想查看二进制中已加载的函数信息，可以使用 `image lookup` 命令。例如：

```bash
(lldb) image lookup -n foo
```

这将会列出二进制中与 `foo` 相关的符号信息，通常包括函数的地址、类型信息等。

### 3. **通过文件名和行号设置断点**

如果你知道函数的实现文件和行号，可以通过指定文件名和行号来设置断点。例如，假设函数 `foo` 在 `main.c` 文件的第 20 行：

```bash
(lldb) breakpoint set --file main.c --line 20
```

或者简写形式：

```bash
(lldb) b main.c:20
```

### 4. **设置在类的成员函数上（C++）**

如果你调试的是 C++ 程序，并且需要为类的成员函数设置断点，可以指定类名加成员函数的形式。例如，在 `MyClass::foo` 上设置断点：

```bash
(lldb) b MyClass::foo
```

### 5. **使用 `rbreak` 设置通配符断点**

有时你可能想为特定前缀的函数设置断点，`LLDB` 提供了通配符断点功能。假设你想为所有以 `foo` 开头的函数设置断点：

```bash
(lldb) rbreak foo.*
```

这将为所有以 `foo` 开头的函数（例如 `foo1`、`foo_bar` 等）设置断点。

### 6. **运行函数**

如果你想直接调用某个函数，可以使用 `expression` 或 `call` 命令在调试过程中调用函数。

例如，调用 `foo()` 函数：

```bash
(lldb) expr foo()
```

或者简写形式：

```bash
(lldb) call foo()
```

### 总结：

- **设置断点**：使用 `b function_name` 或 `breakpoint set --name function_name`。
- **通过文件和行号设置断点**：使用 `b filename:line_number`。
- **查找函数符号**：使用 `image lookup -n function_name`。
- **调用函数**：使用 `expr` 或 `call` 命令来运行函数。

这些方法可以帮助你在 `LLDB` 中指定并调试源码中的特定函数。

