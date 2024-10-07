

# tcc_compile


## 源码


```c
/* compile the file opened in 'file'. Return non zero if errors. */
static int tcc_compile(TCCState *s1, int filetype, const char *str, int fd)
{
	printf("#### tcc_compile  compile the file opened in 'file'. Return non zero if errors. \n");
    /* Here we enter the code section where we use the global variables for
       parsing and code generation (tccpp.c, tccgen.c, <target>-gen.c).
       Other threads need to wait until we're done.

       Alternatively we could use thread local storage for those global
       variables, which may or may not have advantages */

    tcc_enter_state(s1);
    s1->error_set_jmp_enabled = 1;

    if (setjmp(s1->error_jmp_buf) == 0) {
        s1->nb_errors = 0;

        if (fd == -1) {
            int len = strlen(str);
            tcc_open_bf(s1, "<string>", len);
            memcpy(file->buffer, str, len);
        } else {
            tcc_open_bf(s1, str, 0);
            file->fd = fd;
        }

	    printf("#### tcc compile   preprocess_start........\n");
        preprocess_start(s1, filetype);
	    printf("#### tcc compile   tccgen_init........\n");
        tccgen_init(s1);

        if (s1->output_type == TCC_OUTPUT_PREPROCESS) {
		    printf("#### tcc compile   tcc_preprocess........\n");
            tcc_preprocess(s1);
        } else {
		    printf("#### tcc compile   tccelf_begin_file........\n");
            tccelf_begin_file(s1);
            if (filetype & (AFF_TYPE_ASM | AFF_TYPE_ASMPP)) {
                tcc_assemble(s1, !!(filetype & AFF_TYPE_ASMPP));
            } else {

		        printf("#### tcc compile   tccgen_compile........\n");
                tccgen_compile(s1);
            }
            tccelf_end_file(s1);
        }
    }
    tccgen_finish(s1);
    preprocess_end(s1);
    s1->error_set_jmp_enabled = 0;
    tcc_exit_state(s1);
    return s1->nb_errors != 0 ? -1 : 0;
}
```



## 流程

预处理，代码生成，汇编，编译




## tcc_open_bf

## preprocess_start

## tccgen_init

## tcc_preprocess




## tccelf_begin_file


## tcc_assemble


## tccgen_compile




## tccelf_end_file

## tccelf_end_file


## tccgen_finish



## preprocess_end

## tcc_exit_state