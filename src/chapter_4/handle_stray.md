# handle_stray


```c

/* skip the stray and handle the \\n case. Output an error if
   incorrect char after the stray */
static int handle_stray(uint8_t **p)
{
    int c;
    file->buf_ptr = *p - 1;
    c = handle_stray_noerror(!(parse_flags & PARSE_FLAG_ACCEPT_STRAYS));
    *p = file->buf_ptr;
    return c;
}

/* input with '\[\r]\n' handling. */
static int handle_stray_noerror(int err)
{
    int ch;
    while ((ch = next_c()) == '\\') {
        ch = next_c();
        if (ch == '\n') {
    newl:
            file->line_num++;
        } else {
            if (ch == '\r') {
                ch = next_c();
                if (ch == '\n')
                    goto newl;
                *--file->buf_ptr = '\r';
            }
            if (err)
                tcc_error("stray '\\' in program");
            /* may take advantage of 'BufferedFile.unget[4}' */
            return *--file->buf_ptr = '\\';
        }
    }
    return ch;
}
```

在 tinycc 中 `handle_stray` 没看懂是要干啥？帮我详细讲解下？

`handle_stray` 和 `handle_stray_noerror` 函数在 TinyCC 中用于处理输入流中出现的**转义字符（`\`）**，尤其是那些可能在程序中意外出现的、未按预期使用的反斜杠符号。它们主要是为了处理输入中的 `\` 和某些特殊字符组合（如 `\n`、`\r`），并在遇到错误时输出提示。

我们来逐步解析这两个函数的具体作用。

### 1. `handle_stray` 函数

```c
static int handle_stray(uint8_t **p)
{
    int c;
    file->buf_ptr = *p - 1;
    c = handle_stray_noerror(!(parse_flags & PARSE_FLAG_ACCEPT_STRAYS));
    *p = file->buf_ptr;
    return c;
}
```

#### 分析：

- **参数 `p`**：`p` 是一个指向指针的指针，指向文件缓冲区中的当前位置。通过修改 `*p`，可以更改当前解析的位置。
- **`file->buf_ptr = *p - 1;`**：`buf_ptr` 是文件缓冲区的当前指针，指向将要解析的字符。这一行代码将缓冲区指针往回移动一个字符，表明要处理前一个字符。
- **`handle_stray_noerror` 调用**：调用了 `handle_stray_noerror` 函数，这个函数是核心，用于实际处理字符。`!(parse_flags & PARSE_FLAG_ACCEPT_STRAYS)` 判断是否允许“游离”的反斜杠（即在不期望出现反斜杠的地方）。
- **返回值**：`handle_stray_noerror` 返回一个字符，最终作为 `handle_stray` 的返回值。

总的来说，`handle_stray` 的作用是检测和处理输入流中的游离反斜杠字符，必要时产生错误。它调用 `handle_stray_noerror` 进行具体的处理，然后更新输入指针。

### 2. `handle_stray_noerror` 函数

```c
static int handle_stray_noerror(int err)
{
    int ch;
    while ((ch = next_c()) == '\\') {
        ch = next_c();
        if (ch == '\n') {
    newl:
            file->line_num++;
        } else {
            if (ch == '\r') {
                ch = next_c();
                if (ch == '\n')
                    goto newl;
                *--file->buf_ptr = '\r';
            }
            if (err)
                tcc_error("stray '\\' in program");
            return *--file->buf_ptr = '\\';
        }
    }
    return ch;
}
```

#### 分析：

- **`while ((ch = next_c()) == '\\')`**：这个 `while` 循环的作用是查找连续的反斜杠字符。每次从输入中读取下一个字符（通过 `next_c()`），并检查它是否是反斜杠（`\`）。
  
- **处理换行符 `\n`**：
  - 如果读取到反斜杠后紧接着是换行符 `\n`，程序会通过 `newl:` 标签跳转并增加 `line_num`，表示这一行结束，继续解析下一行。
  
- **处理回车符 `\r`**：
  - 如果读取到回车符 `\r`，程序会检查下一个字符是否为换行符 `\n`，若是则也视为换行，否则会将 `\r` 放回缓冲区，表明输入流中出现了一个孤立的回车符。
  
- **错误处理**：
  - 如果 `err` 参数为 `1`，表明不允许游离的反斜杠（`\`）。在这种情况下，如果遇到非法的反斜杠，程序会调用 `tcc_error` 输出错误信息 `"stray '\\' in program"`，说明程序中存在游离的反斜杠。
  
- **返回原始字符**：
  - 如果 `err` 为 0，则表示程序可以接受游离的反斜杠。在这种情况下，它会返回反斜杠 `\\` 并继续处理。

### 总结：
- **`handle_stray`** 和 **`handle_stray_noerror`** 这两个函数主要是为了处理反斜杠（`\`）及其后续的字符。它们会处理换行符和回车符，并在遇到不允许的字符组合时产生错误提示。
- **换行符处理**：如果遇到反斜杠紧接着换行符，表示逻辑行的延续，这也是 C 语言允许的行为。
- **错误提示**：如果遇到非法的反斜杠组合，程序会根据 `err` 参数决定是否输出错误提示。

这些函数确保程序的输入可以正确处理字符流中的反斜杠及其组合，特别是在 C 语言中常见的行延续符（反斜杠加换行符）的处理。同时，它们还可以捕捉并报告不正确的反斜杠使用。