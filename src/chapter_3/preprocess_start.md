

# preprocess_start


## 源码

```c
ST_FUNC void preprocess_start(TCCState *s1, int filetype)
{
    // 判断是否是汇编
    int is_asm = !!(filetype & (AFF_TYPE_ASM|AFF_TYPE_ASMPP));

    tccpp_new(s1);

    // #include 栈指针， include_stack
    s1->include_stack_ptr = s1->include_stack;

    // ifdef 栈指针， ifdef 栈
    s1->ifdef_stack_ptr = s1->ifdef_stack;
    file->ifdef_stack_ptr = s1->ifdef_stack_ptr;
    pp_expr = 0;
    pp_counter = 0;
    pp_debug_tok = pp_debug_symv = 0;
    s1->pack_stack[0] = 0;
    s1->pack_stack_ptr = s1->pack_stack;

    set_idnum('$', !is_asm && s1->dollars_in_identifiers ? IS_ID : 0);
    set_idnum('.', is_asm ? IS_ID : 0);

    if (!(filetype & AFF_TYPE_ASM)) {
        CString cstr;
        cstr_new(&cstr);
        tcc_predefs(s1, &cstr, is_asm);
        if (s1->cmdline_defs.size)
          cstr_cat(&cstr, s1->cmdline_defs.data, s1->cmdline_defs.size);
        if (s1->cmdline_incl.size)
          cstr_cat(&cstr, s1->cmdline_incl.data, s1->cmdline_incl.size);
        //printf("%.*s\n", cstr.size, (char*)cstr.data);
        *s1->include_stack_ptr++ = file;
        tcc_open_bf(s1, "<command line>", cstr.size);
        memcpy(file->buffer, cstr.data, cstr.size);
        cstr_free(&cstr);
    }
    parse_flags = is_asm ? PARSE_FLAG_ASM_FILE : 0;
}

## tccpp_new


## tcc_predefs

预定义的宏：

```c
static void tcc_predefs(TCCState *s1, CString *cs, int is_asm)
{
    cstr_printf(cs, "#define __TINYC__ 9%.2s\n", TCC_VERSION + 4);
    putdefs(cs, target_machine_defs);
    putdefs(cs, target_os_defs);

#ifdef TCC_TARGET_ARM
    if (s1->float_abi == ARM_HARD_FLOAT)
      putdef(cs, "__ARM_PCS_VFP");
#endif
    if (is_asm)
      putdef(cs, "__ASSEMBLER__");
    if (s1->output_type == TCC_OUTPUT_PREPROCESS)
      putdef(cs, "__TCC_PP__");
    if (s1->output_type == TCC_OUTPUT_MEMORY)
      putdef(cs, "__TCC_RUN__");
#ifdef CONFIG_TCC_BACKTRACE
    if (s1->do_backtrace)
      putdef(cs, "__TCC_BACKTRACE__");
#endif
#ifdef CONFIG_TCC_BCHECK
    if (s1->do_bounds_check)
      putdef(cs, "__TCC_BCHECK__");
#endif
    if (s1->char_is_unsigned)
      putdef(cs, "__CHAR_UNSIGNED__");
    if (s1->optimize > 0)
      putdef(cs, "__OPTIMIZE__");
    if (s1->option_pthread)
      putdef(cs, "_REENTRANT");
    if (s1->leading_underscore)
      putdef(cs, "__leading_underscore");
    cstr_printf(cs, "#define __SIZEOF_POINTER__ %d\n", PTR_SIZE);
    cstr_printf(cs, "#define __SIZEOF_LONG__ %d\n", LONG_SIZE);
    if (!is_asm) {
      putdef(cs, "__STDC__");
      cstr_printf(cs, "#define __STDC_VERSION__ %dL\n", s1->cversion);
      cstr_cat(cs,
        /* load more predefs and __builtins */
#if CONFIG_TCC_PREDEFS
        #include "tccdefs_.h" /* include as strings */
#else
        "#include <tccdefs.h>\n" /* load at runtime */
#endif
        , -1);
    }
    cstr_printf(cs, "#define __BASE_FILE__ \"%s\"\n", file->filename);
}
```


## tcc_open_bf


好像是对每个文件都搞一个 buffer

```c
ST_FUNC void tcc_open_bf(TCCState *s1, const char *filename, int initlen)
{
    BufferedFile *bf;
    int buflen = initlen ? initlen : IO_BUF_SIZE;

    bf = tcc_mallocz(sizeof(BufferedFile) + buflen);
    bf->buf_ptr = bf->buffer;
    bf->buf_end = bf->buffer + initlen;
    bf->buf_end[0] = CH_EOB; /* put eob symbol */
    pstrcpy(bf->filename, sizeof(bf->filename), filename);
#ifdef _WIN32
    normalize_slashes(bf->filename);
#endif
    bf->true_filename = bf->filename;
    bf->line_num = 1;
    bf->ifdef_stack_ptr = s1->ifdef_stack_ptr;
    bf->fd = -1;
    bf->prev = file;
    bf->prev_tok_flags = tok_flags;
    file = bf;
    tok_flags = TOK_FLAG_BOL | TOK_FLAG_BOF;
}
```