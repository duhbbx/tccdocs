# 2.3 ppfp 变量的作用

## ppfp 出现的位置

为啥叫 `ppfp` 呢？

`fp` 指的应该是 `FILE POINTER`，是一个文件指针。

变量 `ppfp` 在 tcc.c 代码中出现的先后顺序如下。

```c
FILE *ppfp = stdout;  
printf("ppfp 是啥,为什么取这个名字: ppfp 是指向 stdcout 的文件指针\n");

// 当输出文件的类型是预处理的时候
} else if (s->output_type == TCC_OUTPUT_PREPROCESS) {
    printf("tcc.c 只是进行预处理..................\n");
    if (s->outfile && 0!=strcmp("-",s->outfile)) {
        ppfp = fopen(s->outfile, "wb");
        if (!ppfp)
            tcc_error_noabort("could not write '%s'", s->outfile);
    }
} else if (s->output_type == TCC_OUTPUT_OBJ && !s->option_r) { printf("生成的是目标文件................\n");


// 将 ppfp 赋值给 state 的 ppfp
s->ppfp = ppfp;

// 最后文件快结束的时候关闭文件指针
if (ppfp && ppfp != stdout)
    fclose(ppfp);
```

## TCCState 结构体中的 ppfp

```c
/* output file for preprocessing (-E) */
FILE *ppfp;
```

所以 `ppfp` 就是一个指向预处理文件的文件指针，`pp` 指的就是 `pre processing`。


在 `LIBTCCAPI TCCState *tcc_new(void)` 这个函数中给 `s->ppfp = stdout;` 赋值了 stdout。

```c
#endif
    s->ppfp = stdout;
    /* might be used in error() before preprocess_start() */
    s->include_stack_ptr = s->include_stack;

    tcc_set_lib_path(s, CONFIG_TCCDIR);
    return s;
}
```