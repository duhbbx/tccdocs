# 1.4 config.mak如何使用？



这段代码使用了 `make` 的条件判断和字符串查找功能，来决定是否包含外部的 `config.mak` 文件。让我们一步步分析每个部分的作用：

```makefile
ifeq ($(findstring $(MAKECMDGOALS),clean distclean),)
    include $(TOP)/config.mak
endif
```

## 代码详细分析

### 1. `$(MAKECMDGOALS)`

- `$(MAKECMDGOALS)` 是一个 `make` 的特殊变量，包含了用户在命令行上指定的目标。例如，如果用户执行了 `make clean`，则 `$(MAKECMDGOALS)` 的值为 `clean`。
  
- 这个变量可以包含多个目标，例如执行 `make clean all`，那么 `$(MAKECMDGOALS)` 的值为 `clean all`。

### 2. `$(findstring $(MAKECMDGOALS),clean distclean)`

- `$(findstring)` 是 `make` 内置的字符串查找函数。它的格式为：
  ```makefile
  $(findstring <string1>, <string2>)
  ```
  它在 `<string2>` 中查找 `<string1>`，如果找到了就返回 `<string1>`，否则返回空字符串。

- 在这一行中，它的含义是：在 `$(MAKECMDGOALS)` 中查找是否有 `clean` 或 `distclean`。`clean distclean` 是第二个参数，它是用空格分隔的两个目标。

- 也就是说，`$(findstring $(MAKECMDGOALS),clean distclean)` 会检查当前的目标列表中是否包含 `clean` 或 `distclean` 这两个目标。如果包含，则返回找到的目标；如果不包含，则返回空字符串。

### 3. `ifeq ($(findstring $(MAKECMDGOALS),clean distclean),)`

- `ifeq` 是 `make` 的条件语句，用来判断两个值是否相等。
  
- 在这一行中，判断的是 `$(findstring $(MAKECMDGOALS),clean distclean)` 的返回值是否为空字符串。换句话说，如果 `$(MAKECMDGOALS)` 不包含 `clean` 或 `distclean`，这个条件将为 `true`。

### 4. `include $(TOP)/config.mak`

- `include` 用于包含其他文件的内容。在这里，如果条件为真（即目标不是 `clean` 或 `distclean`），则会包含 `$(TOP)/config.mak` 文件。

- `$(TOP)` 变量通常是在 `Makefile` 中定义的根目录路径变量，用于定位 `config.mak` 文件。假设 `$(TOP)` 的值是项目的根目录，那么这行代码就会包含项目根目录下的 `config.mak` 文件。

### 5. `endif`

- `endif` 用来结束 `ifeq` 条件块。

## 总结

这段代码的主要作用是：

- **在用户没有执行 `clean` 或 `distclean` 目标时**，包含 `config.mak` 文件。
  
- 反之，**如果用户执行了 `make clean` 或 `make distclean`，则不会包含 `config.mak`** 文件。

## 目的

- `clean` 和 `distclean` 目标通常用于删除构建过程中生成的文件。这时，可能不需要 `config.mak` 文件中的配置项（例如编译器选项、库路径等），因为这些目标只需要删除文件，而不需要实际编译代码。
  
- 通过这种方式，可以避免在执行 `clean` 或 `distclean` 时加载不必要的配置文件，简化构建过程，并提高执行效率。