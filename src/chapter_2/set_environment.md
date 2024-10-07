# set_environment

## 函数源码

```c
static void set_environment(TCCState *s)
{
    char * path;

    path = getenv("C_INCLUDE_PATH");
    if(path != NULL) {
        tcc_add_sysinclude_path(s, path);
    }
    path = getenv("CPATH");
    if(path != NULL) {
        tcc_add_include_path(s, path);
    }
    path = getenv("LIBRARY_PATH");
    if(path != NULL) {
        tcc_add_library_path(s, path);
    }
}

```


## C_INCLUDE_PATH，CPATH和LIBRARY_PATH

在 C 和 C++ 编译环境中，环境变量用于指定编译器和链接器搜索头文件和库文件的路径。你提到的三个环境变量 `C_INCLUDE_PATH`、`CPATH` 和 `LIBRARY_PATH`，分别用于影响编译器的头文件和库文件搜索路径。它们的用途如下：

### 1. **`C_INCLUDE_PATH`**：

- **作用**：`C_INCLUDE_PATH` 是专门为 C 语言设置的环境变量，它告诉编译器在指定路径中查找 C 语言的**头文件**（`*.h` 文件）。
- **用法**：当编译器遇到 `#include` 指令时，会首先在源代码指定的路径（如 `#include "header.h"` 的路径）查找，如果找不到，就会根据 `C_INCLUDE_PATH` 中列出的路径进行搜索。
  
#### 示例：
假设你有以下目录结构：
```
/home/user/headers/myheader.h
```

你可以设置 `C_INCLUDE_PATH` 让编译器知道应该查找这个路径：

```bash
export C_INCLUDE_PATH=/home/user/headers
```

然后在代码中：

```c
#include <myheader.h>
```

编译器会在 `/home/user/headers` 中查找 `myheader.h`。

#### 注意：
- `C_INCLUDE_PATH` 仅适用于 C 语言。如果你使用 C++ 编译器，它不会查找 `C_INCLUDE_PATH`，但你可以使用 `CPLUS_INCLUDE_PATH` 来指定 C++ 的头文件搜索路径。

### 2. **`CPATH`**：

- **作用**：`CPATH` 是一个更通用的环境变量，它适用于 C、C++ 以及其他语言的编译器。编译器会在 `CPATH` 中指定的路径中查找头文件（包括 `*.h` 文件和其他头文件）。
- **优先级**：`CPATH` 的优先级低于 `C_INCLUDE_PATH` 和 `CPLUS_INCLUDE_PATH`。也就是说，如果这两个变量定义了，编译器会首先使用它们指定的路径，而 `CPATH` 中的路径在它们之后被搜索。
  
#### 示例：
假设你有以下目录结构：
```
/home/user/headers2/myheader.h
```

你可以设置 `CPATH` 来告诉编译器在哪些路径中查找头文件：

```bash
export CPATH=/home/user/headers2
```

然后在代码中：

```c
#include <myheader.h>
```

编译器会在 `/home/user/headers2` 中查找 `myheader.h`。

#### 注意：
- `CPATH` 适用于所有语言，而不仅仅是 C 或 C++。因此，它的作用范围更广。

### 3. **`LIBRARY_PATH`**：

- **作用**：`LIBRARY_PATH` 用于指定链接器在链接阶段查找库文件（`.a`、`.so`、`.lib` 文件）的路径。编译器在编译阶段查找头文件，而在链接阶段查找库文件时，会参考 `LIBRARY_PATH` 中指定的目录。
  
- **用法**：当你在编译过程中链接动态库或静态库时，如果库文件不在标准库路径下（如 `/usr/lib`），你可以通过设置 `LIBRARY_PATH` 来告诉编译器在指定路径中查找库文件。

#### 示例：
假设你有以下目录结构：
```
/home/user/libs/mylib.a
```

你可以设置 `LIBRARY_PATH` 让链接器在 `/home/user/libs` 中查找库文件：

```bash
export LIBRARY_PATH=/home/user/libs
```

然后编译时：

```bash
gcc -o myprogram myprogram.c -lmylib
```

链接器会在 `/home/user/libs` 中查找 `mylib.a` 并链接到程序中。

#### 注意：
- `LIBRARY_PATH` 仅在编译器的**链接阶段**使用，与头文件的搜索路径无关。
- 对于运行时动态链接的库（`.so` 文件），链接器会使用 `LD_LIBRARY_PATH` 来查找。

### 三者的作用总结：

1. **`C_INCLUDE_PATH`**：专门用于 C 语言，指定编译器在编译 C 代码时查找头文件的路径。
2. **`CPATH`**：更通用，适用于 C、C++ 及其他编程语言，指定编译器查找头文件的路径。
3. **`LIBRARY_PATH`**：指定链接器在链接阶段查找库文件的路径。

#### 环境变量的优先级：
- 编译器会首先搜索默认的系统路径（如 `/usr/include`、`/usr/lib`），然后按照如下优先级搜索指定的路径：
  - C 语言头文件：先搜索 `C_INCLUDE_PATH`，再搜索 `CPATH`。
  - C++ 语言头文件：先搜索 `CPLUS_INCLUDE_PATH`，再搜索 `CPATH`。
  - 库文件：搜索 `LIBRARY_PATH`。

### 使用这些环境变量的好处

1. **简化编译命令**：通过预先设置这些环境变量，编译时无需使用 `-I`、`-L` 等编译选项来手动指定头文件和库的路径，简化了编译过程。
   
2. **跨项目使用共享的头文件和库**：可以将常用的头文件和库路径放到这些环境变量中，多个项目都可以使用这些共享的资源，而无需在每个项目的构建文件中重复指定路径。

### 示例：实际使用

假设你有一个项目，其头文件和库文件位于以下自定义路径中：
```
/home/user/project/include/myheader.h
/home/user/project/lib/mylib.a
```

为了编译时自动查找这些文件，你可以在终端中设置环境变量：

```bash
export C_INCLUDE_PATH=/home/user/project/include
export LIBRARY_PATH=/home/user/project/lib
```

然后使用 `gcc` 编译项目时，不需要手动指定头文件和库文件路径：

```bash
gcc -o myprogram main.c -lmylib
```

这将会在指定的路径中找到 `myheader.h` 和 `mylib.a`，并将它们包含到编译和链接过程中。

### 总结

- **`C_INCLUDE_PATH`**：用于 C 语言头文件的查找路径。
- **`CPATH`**：通用的头文件查找路径，适用于 C、C++ 等语言。
- **`LIBRARY_PATH`**：用于库文件（`.a`、`.so` 等）的查找路径，影响链接器的搜索行为。

这些环境变量的使用简化了构建过程，特别是在多个项目共享库和头文件的情况下。


## getenv 函数

```c
char *__cdecl getenv(const char *_VarName);
```

### `getenv` 函数详解

在 C 语言中，`getenv` 是一个用于获取**环境变量**值的函数。环境变量是操作系统维护的一些字符串，它们可以影响正在运行的程序的行为。通过 `getenv` 函数，程序可以访问这些环境变量的值，从而获取一些配置信息或系统信息。

### 函数原型

`getenv` 函数的原型在头文件 `<stdlib.h>` 中定义：

```c
char *getenv(const char *name);
```

### 参数

- **`name`**：这是一个指向字符串的指针，用于指定要获取的环境变量的名称。该字符串是区分大小写的。

### 返回值

- 如果环境变量 `name` 存在，`getenv` 函数返回指向环境变量值的指针，该指针指向一个以空字符 `\0` 结尾的字符串。
- 如果环境变量 `name` 不存在，`getenv` 返回 `NULL`。

### 用法

`getenv` 常用于获取操作系统中设置的环境变量，比如 `PATH`、`HOME`、`USER` 等。程序可以通过这些环境变量来配置自己的行为。

### 示例代码

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 获取环境变量 HOME 的值
    char *home = getenv("HOME");
    if (home != NULL) {
        printf("HOME environment variable: %s\n", home);
    } else {
        printf("HOME environment variable is not set.\n");
    }

    // 获取环境变量 PATH 的值
    char *path = getenv("PATH");
    if (path != NULL) {
        printf("PATH environment variable: %s\n", path);
    } else {
        printf("PATH environment variable is not set.\n");
    }

    return 0;
}
```

#### 示例输出：

```bash
HOME environment variable: /home/user
PATH environment variable: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

### 注意事项

1. **返回的指针指向静态内存**：`getenv` 返回的指针指向的是一个静态内存区域，这意味着你不应该修改这个指针指向的内容，因为它可能会影响程序的其他部分。同时，该内存区域会在下一次调用 `getenv` 时被覆盖。
   
2. **线程安全性**：`getenv` 通常不是线程安全的，多个线程同时调用时可能会出现数据竞态问题。标准库中的 `getenv` 函数可能会返回同一个全局缓冲区的地址，如果多个线程同时修改或读取环境变量，可能会导致不可预期的行为。为了在多线程中安全使用，某些系统（如 Linux）提供了 `secure_getenv` 函数，或类似的线程安全解决方案。

3. **大小写敏感**：环境变量的名字在大多数操作系统中是区分大小写的。例如，`PATH` 和 `path` 是不同的环境变量。

4. **空值**：如果指定的环境变量不存在，`getenv` 返回 `NULL`。在使用返回值之前，一定要检查它是否为 `NULL`，以避免程序崩溃。

5. **依赖环境**：`getenv` 依赖于系统的环境变量配置，这些变量可能会因操作系统、启动方式等不同而有所差异。在跨平台开发时，需要注意不同平台上环境变量的命名和内容可能有所不同。

### 常见环境变量

以下是一些常见的环境变量：

- **`PATH`**：指定可执行文件的搜索路径。当你在命令行中运行一个命令时，系统会在 `PATH` 中指定的目录中查找对应的可执行文件。
- **`HOME`**：表示当前用户的主目录路径。
- **`USER`**：当前登录的用户名。
- **`PWD`**：当前工作目录。
- **`SHELL`**：用户使用的默认 shell（如 `/bin/bash`）。
- **`TEMP`**：指定临时文件存储的路径。

### 使用 `getenv` 来检查自定义环境变量

有时，程序可能依赖于自定义的环境变量来配置某些行为。你可以使用 `getenv` 来检查这些变量，并根据变量的值做出相应的操作。

#### 示例：

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 检查 MY_APP_MODE 自定义环境变量
    char *mode = getenv("MY_APP_MODE");
    
    if (mode != NULL && strcmp(mode, "DEBUG") == 0) {
        printf("Program is running in DEBUG mode.\n");
    } else {
        printf("Program is running in NORMAL mode.\n");
    }

    return 0;
}
```

假设我们设置了环境变量 `MY_APP_MODE`：

```bash
export MY_APP_MODE=DEBUG
```

执行该程序时，将输出：

```bash
Program is running in DEBUG mode.
```

如果没有设置 `MY_APP_MODE`，输出将会是：

```bash
Program is running in NORMAL mode.
```

### 使用场景

- **动态配置**：通过环境变量配置程序的运行模式、数据库连接信息、文件路径等。
- **跨平台适配**：不同平台上，环境变量可以用来适配不同的系统路径和依赖项。
- **调试**：环境变量常用于切换程序的调试模式（如 `DEBUG`），以输出调试信息或加载不同的配置。
  
### `getenv` 的底层工作原理

在大多数操作系统中，环境变量是进程属性的一部分。每个进程都有一个环境块（environment block），存储了当前进程的所有环境变量。`getenv` 函数实际上是通过查询这个环境块来获取变量值的。

例如，POSIX 系统中，环境变量存储在全局变量 `environ` 中，它是一个指向字符串数组的指针。每个字符串的形式为 `"KEY=VALUE"`。

```c
extern char **environ;
```

`getenv` 的实现通常是遍历这个 `environ` 数组，查找与指定 `name` 匹配的键，找到后返回对应的值。

### 总结

- **`getenv` 函数**：用于获取系统中的环境变量值。通过传递环境变量的名称作为参数，返回该变量的值。
- **返回值**：成功时返回指向环境变量值的指针，失败时返回 `NULL`。
- **常见用途**：获取系统环境配置信息、配置程序行为、调试等。
- **注意事项**：返回的指针指向静态内存区域，不应修改，且 `getenv` 在多线程中可能不是线程安全的。

`getenv` 是一个非常有用的函数，特别是在需要根据环境动态调整程序行为的场景下，可以帮助开发者编写更加灵活和可配置的程序。


## 添加 tcc state 的路径中

```c
LIBTCCAPI int tcc_add_include_path(TCCState *s, const char *pathname)
{
    tcc_split_path(s, &s->include_paths, &s->nb_include_paths, pathname);
    return 0;
}

LIBTCCAPI int tcc_add_sysinclude_path(TCCState *s, const char *pathname)
{
    tcc_split_path(s, &s->sysinclude_paths, &s->nb_sysinclude_paths, pathname);
    return 0;
}

LIBTCCAPI int tcc_add_library_path(TCCState *s, const char *pathname)
{
    tcc_split_path(s, &s->library_paths, &s->nb_library_paths, pathname);
    return 0;
}

```




