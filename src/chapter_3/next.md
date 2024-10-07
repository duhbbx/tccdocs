# next

## 源码

```c
/* return next token with macro substitution */
ST_FUNC void next(void)
{
    int t;
    while (macro_ptr) {
redo:
        t = *macro_ptr;
        if (TOK_HAS_VALUE(t)) {
            tok_get(&tok, &macro_ptr, &tokc);
            if (t == TOK_LINENUM) {
                file->line_num = tokc.i;
                goto redo; // GOTO
            }
            goto convert;   // GOTO
        } else if (t == 0) {
            /* end of macro or unget token string */
            end_macro();
            continue;
        } else if (t == TOK_EOF) {
            /* do nothing */
        } else {
            ++macro_ptr;
            t &= ~SYM_FIELD; /* remove 'nosubst' marker */
            if (t == '\\') {
                if (!(parse_flags & PARSE_FLAG_ACCEPT_STRAYS))
                    tcc_error("stray '\\' in program");
            }
        }
        tok = t;
        return;
    }

    next_nomacro();
    t = tok;
    if (t >= TOK_IDENT && (parse_flags & PARSE_FLAG_PREPROCESS)) {
        /* if reading from file, try to substitute macros */
        Sym *s = define_find(t);
        if (s) {
            Sym *nested_list = NULL;
            macro_subst_tok(&tokstr_buf, &nested_list, s);
            tok_str_add(&tokstr_buf, 0);
            begin_macro(&tokstr_buf, 0);
            goto redo;
        }
        return;
    }

convert:
    /* convert preprocessor tokens into C tokens */
    if (t == TOK_PPNUM) {
        if  (parse_flags & PARSE_FLAG_TOK_NUM)
            parse_number(tokc.str.data);
    } else if (t == TOK_PPSTR) {
        if (parse_flags & PARSE_FLAG_TOK_STR)
            parse_string(tokc.str.data, tokc.str.size - 1);
    }
}
```

## macro_ptr

```c
ST_DATA struct BufferedFile *file;
ST_DATA int tok;
ST_DATA CValue tokc;
ST_DATA const int *macro_ptr;
ST_DATA int parse_flags;
ST_DATA int tok_flags;
ST_DATA CString tokcstr; /* current parsed string, if any */
```


全局变量，`macro_ptr` 是一个 int 类型的指针