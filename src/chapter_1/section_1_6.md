# 1.6 入口代码

代码的入口就是项目根目录下的 tcc.c 文件中。整个 `main` 函数比较短，比较清晰。


```c
int main(int argc0, char **argv0)
{
    /* TCCState 是啥? */
    TCCState *s, *s1;
    int ret, opt, n = 0, t = 0, done;
    unsigned start_time = 0, end_time = 0;
    const char *first_file;
    int argc; char **argv;
    FILE *ppfp = stdout;  printf("ppfp 是啥,为什么取这个名字: ppfp 是指向 stdcout 的文件指针\n");

redo: /* 使用了 label, why */
    argc = argc0, argv = argv0;
    s = s1 = tcc_new();  printf("#### tcc state 的状态使用 tcc_new() >>>>>>>>> \n");
#ifdef CONFIG_TCC_SWITCHES /* predefined options */
    tcc_set_options(s, CONFIG_TCC_SWITCHES);   printf("#### tcc_set_options, 这个 options 是什么呢?\n");
#endif
    opt = tcc_parse_args(s, &argc, &argv, 1);  printf("#### 解析 tcc 的参数 tcc_parse_args \n");
    if (opt < 0)
        return 1;

    if (n == 0) {
        if (opt == OPT_HELP) {
            fputs(help, stdout);
            if (!s->verbose)
                return 0;
            ++opt;
        }
        if (opt == OPT_HELP2) {
            fputs(help2, stdout);
            return 0;
        }
        if (opt == OPT_M32 || opt == OPT_M64)
            return tcc_tool_cross(s, argv, opt);
        if (s->verbose)
            printf("%s", version);
        if (opt == OPT_AR)
            return tcc_tool_ar(s, argc, argv);
#ifdef TCC_TARGET_PE
        if (opt == OPT_IMPDEF)
            return tcc_tool_impdef(s, argc, argv);
#endif
        if (opt == OPT_V)
            return 0;
        if (opt == OPT_PRINT_DIRS) {
            /* initialize search dirs */
            set_environment(s);
            tcc_set_output_type(s, TCC_OUTPUT_MEMORY);
            print_search_dirs(s);
            return 0;
        }
        printf("##### 一共有多少个输入文件呢? %d 个\n", s->nb_files);
        if (s->nb_files == 0) {
            tcc_error_noabort("no input files");
        } else if (s->output_type == TCC_OUTPUT_PREPROCESS) { printf("tcc.c 只是进行预处理..................\n");
            if (s->outfile && 0!=strcmp("-",s->outfile)) {
                ppfp = fopen(s->outfile, "wb");
                if (!ppfp)
                    tcc_error_noabort("could not write '%s'", s->outfile);
            }
        } else if (s->output_type == TCC_OUTPUT_OBJ && !s->option_r) { printf("生成的是目标文件................\n");
            if (s->nb_libraries)
                tcc_error_noabort("cannot specify libraries with -c");
            else if (s->nb_files > 1 && s->outfile) {
                // #define tcc_error_noabort   TCC_SET_STATE(_tcc_error_noabort)
                tcc_error_noabort("cannot specify output file with -c many files");
            }
        }
        if (s->nb_errors)
            return 1;
        if (s->do_bench) { printf("有 bench 标识, 准备记录起始时间了");
            start_time = getclock_ms(); }
    }

    set_environment(s);
    if (s->output_type == 0)
        s->output_type = TCC_OUTPUT_EXE;
    tcc_set_output_type(s, s->output_type);
    s->ppfp = ppfp;

    if ((s->output_type == TCC_OUTPUT_MEMORY
      || s->output_type == TCC_OUTPUT_PREPROCESS)
        && (s->dflag & 16)) { /* -dt option */
        if (t)
            s->dflag |= 32;
        s->run_test = ++t;
        if (n)
            --n;
    }

    /* compile or add each files or library */
    first_file = NULL;
    do {
        struct filespec *f = s->files[n];
        s->filetype = f->type;
        printf("#### 编译单个文件 -> %s\n", f->name);
        if (f->type & AFF_TYPE_LIB) { printf("AFF_TYPE_LIB类型......... 使用枚举来判断\n");
            ret = tcc_add_library_err(s, f->name);
        } else {
            if (1 == s->verbose)
                printf("-> %s\n", f->name);
            if (!first_file)        // 为什么要有 first_file 呢?
                first_file = f->name;
            ret = tcc_add_file(s, f->name);  printf("tcc_add_file 是干啥的...........\n");
        }
        done = ret || ++n >= s->nb_files;  printf("判断是否 done了..................\n");
    } while (!done && (s->output_type != TCC_OUTPUT_OBJ || s->option_r));

    if (s->do_bench) { printf("判断是否是 bench, 如果是的话计算时间");
        end_time = getclock_ms();
    }
        

    if (s->run_test) {
        t = 0;
    } else if (s->output_type == TCC_OUTPUT_PREPROCESS) {
        ;
    } else if (0 == ret) {
        if (s->output_type == TCC_OUTPUT_MEMORY) {
#ifdef TCC_IS_NATIVE
            ret = tcc_run(s, argc, argv);
#endif
        } else {
            if (!s->outfile)
                s->outfile = default_outputfile(s, first_file);
            if (!s->just_deps && tcc_output_file(s, s->outfile))
                ;
            else if (s->gen_deps)
                gen_makedeps(s, s->outfile, s->deps_outfile);
        }
    }

    done = 1;
    if (t)
        done = 0; /* run more tests with -dt -run */
    else if (s->nb_errors)
        ret = 1;
    else if (n < s->nb_files)
        done = 0; /* compile more files with -c */
    else if (s->do_bench)
        tcc_print_stats(s, end_time - start_time);
    tcc_delete(s);
    if (!done) {  printf("#### 没有完成,跳转到 redo 继续.........\n");
        goto redo;}
    if (ppfp && ppfp != stdout)
        fclose(ppfp);
    printf("编译结束了....... 返回的结果是 %d, 是否成功: %s\n", ret, ret ? "失败" : "成功");
    return ret;
}
```


## 这段 `main` 函数详细分析

这个 `main` 函数属于 `TinyCC`（TCC），一个小型 C 编译器的项目。该函数处理编译器的启动、命令行参数解析、文件编译和输出操作。让我们逐步分析每个部分的作用。

### 函数签名

```c
int main(int argc0, char **argv0)
```

- **`argc0`** 和 **`argv0`**：传递给程序的命令行参数。
- **`argc0`**：参数个数。
- **`argv0`**：包含所有命令行参数的字符串数组。

### 1. 变量声明

```c
TCCState *s, *s1;
int ret, opt, n = 0, t = 0, done;
unsigned start_time = 0, end_time = 0;
const char *first_file;
int argc;
char **argv;
FILE *ppfp = stdout;
```

- **`TCCState *s, *s1`**：`TCCState` 是 TCC 中用来表示编译器状态的结构体指针，`s` 和 `s1` 用于存储编译器的状态信息。
- **`ret`、`opt`、`n`、`t`、`done`**：这些变量控制编译过程中的状态，如返回值、选项、处理文件的索引等。
- **`start_time` 和 `end_time`**：记录编译的起止时间，用于性能基准测试。
- **`first_file`**：存储第一个编译文件的名字。
- **`argc` 和 `argv`**：本地变量，用来保存命令行参数。
- **`ppfp`**：文件指针，初始指向 `stdout`，用于预处理输出。

### 2. `redo` 标签和初始化

```c
redo:
argc = argc0, argv = argv0;
s = s1 = tcc_new();
```

- **`redo`**：这是一个标签，用于控制流程跳转。`goto redo;` 用于在某些条件下重复执行。
- **`tcc_new()`**：初始化编译器状态，创建一个新的 `TCCState` 对象。
  
### 3. 命令行参数解析和预定义选项

```c
#ifdef CONFIG_TCC_SWITCHES
tcc_set_options(s, CONFIG_TCC_SWITCHES);
#endif
opt = tcc_parse_args(s, &argc, &argv, 1);
if (opt < 0)
    return 1;
```

- **`tcc_set_options`**：设置编译器的预定义选项，`CONFIG_TCC_SWITCHES` 是编译器预定义的配置。
- **`tcc_parse_args`**：解析命令行参数，将结果存储在 `opt` 中，如果解析失败，返回 `1` 退出程序。

### 4. 处理特定的命令行选项

```c
if (n == 0) {
    if (opt == OPT_HELP) {
        fputs(help, stdout);
        return 0;
    }
    if (opt == OPT_M32 || opt == OPT_M64)
        return tcc_tool_cross(s, argv, opt);
    ...
}
```

- 处理用户请求的特殊命令行选项，如 `OPT_HELP`、`OPT_M32` 等：
  - **`OPT_HELP`**：输出帮助信息。
  - **`OPT_M32` / `OPT_M64`**：设置目标架构（32位或64位），通过 `tcc_tool_cross` 函数处理交叉编译的需求。
  - 其他选项如 `OPT_AR` 用于不同的编译器工具。

### 5. 处理文件

```c
if (s->nb_files == 0) {
    tcc_error_noabort("no input files");
}
else if (s->output_type == TCC_OUTPUT_PREPROCESS) {
    if (s->outfile && strcmp("-", s->outfile) != 0) {
        ppfp = fopen(s->outfile, "wb");
        if (!ppfp)
            tcc_error_noabort("could not write '%s'", s->outfile);
    }
}
```

- 如果没有输入文件，返回错误。
- 对于预处理输出 (`TCC_OUTPUT_PREPROCESS`)，将输出重定向到指定的文件。

### 6. 编译文件

```c
do {
    struct filespec *f = s->files[n];
    s->filetype = f->type;
    if (f->type & AFF_TYPE_LIB) {
        ret = tcc_add_library_err(s, f->name);
    } else {
        if (!first_file)
            first_file = f->name;
        ret = tcc_add_file(s, f->name);
    }
    done = ret || ++n >= s->nb_files;
} while (!done && (s->output_type != TCC_OUTPUT_OBJ || s->option_r));
```

- 使用 `do-while` 循环逐个处理文件：
  - **`AFF_TYPE_LIB`**：检查文件类型是否为库文件，如果是，则通过 `tcc_add_library_err` 添加库文件。
  - **`tcc_add_file`**：编译文件。
  - 使用 `done` 标志确定是否处理完所有文件。

### 7. 处理编译输出

```c
if (s->output_type == TCC_OUTPUT_MEMORY) {
    ret = tcc_run(s, argc, argv);
} else {
    if (!s->outfile)
        s->outfile = default_outputfile(s, first_file);
    if (!s->just_deps && tcc_output_file(s, s->outfile)) {
        ;
    } else if (s->gen_deps)
        gen_makedeps(s, s->outfile, s->deps_outfile);
}
```

- 根据输出类型处理：
  - **`TCC_OUTPUT_MEMORY`**：立即运行内存中的程序。
  - **其他输出类型**：如果有输出文件，生成目标文件或依赖文件。

### 8. 基准测试和错误处理

```c
if (s->do_bench) {
    end_time = getclock_ms();
}
if (s->nb_errors)
    ret = 1;
```

- 如果启用了基准测试 (`do_bench`)，记录结束时间并计算编译时间。
- 如果编译过程中有错误，设置返回值 `ret = 1`。

### 9. 重复处理或结束

```c
tcc_delete(s);
if (!done) {
    goto redo;
}
```

- **`tcc_delete(s)`**：清理编译器状态。
- 如果没有完成所有任务，通过 `goto redo` 重新开始。

## 总结

这个 `main` 函数实现了 TCC 编译器的核心逻辑：
1. 初始化编译器状态。
2. 解析命令行参数并处理特定选项。
3. 根据命令行输入处理文件（编译、链接、生成输出）。
4. 基于不同的输出类型执行不同的操作，如生成目标文件或直接运行内存中的代码。
5. 处理错误和基准测试。
6. 支持通过 `goto` 标签重复处理多个编译任务。

该函数通过标签和条件控制不同的流程，从而支持灵活的编译和文件处理。