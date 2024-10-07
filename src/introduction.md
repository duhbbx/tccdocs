

# 引言


## 作者信息
- **作者**: 乐乐宝宝
- **电子邮件**: duhbbx@gmail.com


不知道引言写啥....



传说计算机有三大浪漫: 操作系统, 编译原理和图形学. 我是对编译原理比较感兴趣,因为工作的原因会涉及到很多编译原理知识的运用.


# 一些有用的调试

## lldb 中的调试控制台

```c
p (char*) get_tok_str(tok, &tokc)    // 输出当前的 token


p file->buf_ptr                     // 打印当前解析的缓冲区


p tokcstr                           // 打印当前的 tokcstr 的字符串，得结合长度和 data 中内容一起看
(CString)  (size = 4, size_allocated = 32, data = "\"a.ciltin_parityll")

p tokc                              // tok 的 value



// 如何输出这个范围的字符串
// uint8_t *buf_ptr;
// uint8_t *buf_end;




```


在 LLDB 中，如果你有两个指针 `buf_ptr` 和 `buf_end`，并且你想打印从 `buf_ptr` 到 `buf_end` 范围内的字符串，可以使用 `memory read` 命令来读取内存内容并显示为字符串格式。

假设 `buf_ptr` 指向数据的开始位置，`buf_end` 指向数据的结束位置，可以使用以下方法来打印该范围的内容。

### 方法 1: 使用 `memory read`

1. **计算字符串的长度**：首先你需要知道范围内的数据长度，即 `buf_end - buf_ptr`。
2. **读取内存内容**：然后使用 `memory read` 来读取从 `buf_ptr` 到 `buf_end` 的内容，并将其以字符串格式显示。

假设 `buf_ptr` 是起始地址，`buf_end` 是终止地址，计算长度为 `buf_end - buf_ptr`，你可以使用以下命令：

```bash
(lldb) memory read --format 's' --size 1 --count (buf_end - buf_ptr) buf_ptr
```

- `--format 's'`：表示以字符串格式显示。
- `--size 1`：按字节读取。
- `--count (buf_end - buf_ptr)`：读取的字节数，即从 `buf_ptr` 到 `buf_end` 的长度。

### 方法 2: 使用 `x` 命令打印指定范围的字节

如果你想以十六进制格式或字符形式打印出该范围的内存内容，可以使用 `x` 命令：

```bash
(lldb) x/((buf_end - buf_ptr))b buf_ptr
```

- `x` 命令表示以字节的形式查看内存内容。
- `b` 选项表示逐字节打印。
- `buf_ptr` 是起始地址，`buf_end` 是结束地址。

### 方法 3: 打印指定长度的字符串

如果你知道 `buf_ptr` 到 `buf_end` 的具体长度，并且希望打印该范围内的字符串，可以先计算长度并直接打印该长度的字符串。

```bash
(lldb) memory read --format 's' --size 1 --count 50 buf_ptr
```

假设 `buf_ptr` 到 `buf_end` 的长度是 `50` 个字节，这个命令会读取并显示该范围内的内容。

### 示例

假设有如下的指针：

```c
uint8_t *buf_ptr = "Hello, this is a string.";
uint8_t *buf_end = buf_ptr + strlen((char*)buf_ptr);
```

你可以使用 LLDB 打印 `buf_ptr` 到 `buf_end` 范围的字符串：

```bash
(lldb) memory read --format 's' --size 1 --count (buf_end - buf_ptr) buf_ptr
```

### 总结

- **`memory read --format 's' --size 1 --count (buf_end - buf_ptr) buf_ptr`**：以字符串形式读取并显示从 `buf_ptr` 到 `buf_end` 范围内的内容。
- **`x/(buf_end - buf_ptr)b buf_ptr`**：以十六进制或字符形式打印该范围的内存内容。

这样你就可以在 `LLDB` 中查看并打印两个指针范围内的字符串内容。



# 接着分析.....