# 2.5 TCCState

libtcc.h 中有这个定义：
```c
typedef struct TCCState TCCState;
```

为什么能这么定义， 使用的时候 struct TCCState s 和  TCCState s 能同时使用吗？如果有这些疑问可以参考这里: [类型前置声明](./类型的前置声明.md)

tcc.h 中定义了 TCCState 这个结构体：

```c
struct TCCState {
    unsigned char verbose; /* if true, display some information during compilation */
    unsigned char nostdinc; /* if true, no standard headers are added */
    unsigned char nostdlib; /* if true, no standard libraries are added */
    unsigned char nocommon; /* if true, do not use common symbols for .bss data */
    unsigned char static_link; /* if true, static linking is performed */
    unsigned char rdynamic; /* if true, all symbols are exported */
    unsigned char symbolic; /* if true, resolve symbols in the current module first */
    unsigned char filetype; /* file type for compilation (NONE,C,ASM) */
    unsigned char optimize; /* only to #define __OPTIMIZE__ */
    unsigned char option_pthread; /* -pthread option */
    unsigned char enable_new_dtags; /* -Wl,--enable-new-dtags */
    unsigned int  cversion; /* supported C ISO version, 199901 (the default), 201112, ... */

    /* C language options */
    unsigned char char_is_unsigned;
    unsigned char leading_underscore;
    unsigned char ms_extensions; /* allow nested named struct w/o identifier behave like unnamed */
    unsigned char dollars_in_identifiers;  /* allows '$' char in identifiers */
    unsigned char ms_bitfields; /* if true, emulate MS algorithm for aligning bitfields */

    /* warning switches */
    unsigned char warn_none;
    unsigned char warn_all;
    unsigned char warn_error;
    unsigned char warn_write_strings;
    unsigned char warn_unsupported;
    unsigned char warn_implicit_function_declaration;
    unsigned char warn_discarded_qualifiers;
    #define WARN_ON  1 /* warning is on (-Woption) */
    unsigned char warn_num; /* temp var for tcc_warning_c() */

    unsigned char option_r; /* option -r */
    unsigned char do_bench; /* option -bench */
    unsigned char just_deps; /* option -M  */
    unsigned char gen_deps; /* option -MD  */
    unsigned char include_sys_deps; /* option -MD  */
    unsigned char gen_phony_deps; /* option -MP */

    /* compile with debug symbol (and use them if error during execution) */
    unsigned char do_debug;
    unsigned char dwarf;
    unsigned char do_backtrace;
#ifdef CONFIG_TCC_BCHECK
    /* compile with built-in memory and bounds checker */
    unsigned char do_bounds_check;
#endif
    unsigned char test_coverage;  /* generate test coverage code */

    /* use GNU C extensions */
    unsigned char gnu_ext;
    /* use TinyCC extensions */
    unsigned char tcc_ext;

    unsigned char dflag; /* -dX value */
    unsigned char Pflag; /* -P switch (LINE_MACRO_OUTPUT_FORMAT) */

#ifdef TCC_TARGET_X86_64
    unsigned char nosse; /* For -mno-sse support. */
#endif
#ifdef TCC_TARGET_ARM
    unsigned char float_abi; /* float ABI of the generated code*/
#endif

    unsigned char has_text_addr;
    addr_t text_addr; /* address of text section */
    unsigned section_align; /* section alignment */
#ifdef TCC_TARGET_I386
    int seg_size; /* 32. Can be 16 with i386 assembler (.code16) */
#endif

    char *tcc_lib_path; /* CONFIG_TCCDIR or -B option */
    char *soname; /* as specified on the command line (-soname) */
    char *rpath; /* as specified on the command line (-Wl,-rpath=) */
    char *elf_entryname; /* "_start" unless set */
    char *init_symbol; /* symbols to call at load-time (not used currently) */
    char *fini_symbol; /* symbols to call at unload-time (not used currently) */
    char *mapfile; /* create a mapfile (not used currently) */

    /* output type, see TCC_OUTPUT_XXX */
    int output_type;
    /* output format, see TCC_OUTPUT_FORMAT_xxx */
    int output_format;
    /* nth test to run with -dt -run */
    int run_test;

    /* array of all loaded dlls (including those referenced by loaded dlls) */
    DLLReference **loaded_dlls;
    int nb_loaded_dlls;

    /* include paths */
    char **include_paths;
    int nb_include_paths;

    char **sysinclude_paths;
    int nb_sysinclude_paths;

    /* library paths */
    char **library_paths;
    int nb_library_paths;

    /* crt?.o object path */
    char **crt_paths;
    int nb_crt_paths;

    /* -D / -U options */
    CString cmdline_defs;
    /* -include options */
    CString cmdline_incl;

    /* error handling */
    void *error_opaque;
    void (*error_func)(void *opaque, const char *msg);
    int error_set_jmp_enabled;
    jmp_buf error_jmp_buf;
    int nb_errors;

    /* output file for preprocessing (-E) */
    FILE *ppfp;

    /* for -MD/-MF: collected dependencies for this compilation */
    char **target_deps;
    int nb_target_deps;

    /* compilation */
    BufferedFile *include_stack[INCLUDE_STACK_SIZE];
    BufferedFile **include_stack_ptr;

    int ifdef_stack[IFDEF_STACK_SIZE];
    int *ifdef_stack_ptr;

    /* included files enclosed with #ifndef MACRO */
    int cached_includes_hash[CACHED_INCLUDES_HASH_SIZE];
    CachedInclude **cached_includes;
    int nb_cached_includes;

    /* #pragma pack stack */
    int pack_stack[PACK_STACK_SIZE];
    int *pack_stack_ptr;
    char **pragma_libs;
    int nb_pragma_libs;

    /* inline functions are stored as token lists and compiled last
       only if referenced */
    struct InlineFunc **inline_fns;
    int nb_inline_fns;

    /* sections */
    Section **sections;
    int nb_sections; /* number of sections, including first dummy section */

    Section **priv_sections;
    int nb_priv_sections; /* number of private sections */

    /* predefined sections */
    Section *text_section, *data_section, *rodata_section, *bss_section;
    Section *common_section;
    Section *cur_text_section; /* current section where function code is generated */
#ifdef CONFIG_TCC_BCHECK
    /* bound check related sections */
    Section *bounds_section; /* contains global data bound description */
    Section *lbounds_section; /* contains local data bound description */
#endif
    /* symbol section */
    union { Section *symtab_section, *symtab; }; /* historical alias */
    /* temporary dynamic symbol sections (for dll loading) */
    Section *dynsymtab_section;
    /* exported dynamic symbol section */
    Section *dynsym;
    /* got & plt handling */
    Section *got, *plt;
    /* debug sections */
    Section *stab_section;
    Section *dwarf_info_section;
    Section *dwarf_abbrev_section;
    Section *dwarf_line_section;
    Section *dwarf_aranges_section;
    Section *dwarf_str_section;
    Section *dwarf_line_str_section;
    int dwlo, dwhi; /* dwarf section range */
    /* test coverage */
    Section *tcov_section;
    /* debug state */
    struct _tccdbg *dState;

    /* Is there a new undefined sym since last new_undef_sym() */
    int new_undef_sym;
    /* extra attributes (eg. GOT/PLT value) for symtab symbols */
    struct sym_attr *sym_attrs;
    int nb_sym_attrs;
    /* ptr to next reloc entry reused */
    ElfW_Rel *qrel;
    #define qrel s1->qrel

#ifdef TCC_TARGET_RISCV64
    struct pcrel_hi { addr_t addr, val; } last_hi;
    #define last_hi s1->last_hi
#endif

#ifdef TCC_TARGET_PE
    /* PE info */
    int pe_subsystem;
    unsigned pe_characteristics;
    unsigned pe_file_align;
    unsigned pe_stack_size;
    addr_t pe_imagebase;
# ifdef TCC_TARGET_X86_64
    Section *uw_pdata;
    int uw_sym;
    unsigned uw_offs;
# endif
#else
    unsigned shf_RELRO; /* section flags for RELRO sections */
#endif

#if defined TCC_TARGET_MACHO
    char *install_name;
    uint32_t compatibility_version;
    uint32_t current_version;
#endif

#ifndef ELF_OBJ_ONLY
    int nb_sym_versions;
    struct sym_version *sym_versions;
    int nb_sym_to_version;
    int *sym_to_version;
    int dt_verneednum;
    Section *versym_section;
    Section *verneed_section;
#endif

#ifdef TCC_IS_NATIVE
    const char *run_main; /* entry for tcc_run() */
    void *run_ptr; /* runtime_memory */
    unsigned run_size; /* size of runtime_memory  */
#ifdef _WIN64
    void *run_function_table; /* unwind data */
#endif
    struct TCCState *next;
    struct rt_context *rc; /* pointer to backtrace info block */
    void *run_lj, *run_jb; /* sj/lj for tcc_setjmp()/tcc_run() */
    TCCBtFunc *bt_func;
    void *bt_data;
#endif

#ifdef CONFIG_TCC_BACKTRACE
    int rt_num_callers;
#endif

    /* benchmark info */
    int total_idents;
    int total_lines;
    unsigned int total_bytes;
    unsigned int total_output[4];

    /* option -dnum (for general development purposes) */
    int g_debug;

    /* used by tcc_load_ldscript */
    int fd, cc;

    /* for warnings/errors for object files */
    const char *current_filename;

    /* used by main and tcc_parse_args only */
    struct filespec **files; /* files seen on command line */
    int nb_files; /* number thereof */
    int nb_libraries; /* number of libs thereof */
    char *outfile; /* output filename */
    char *deps_outfile; /* option -MF */
    int argc;
    char **argv;
    CString linker_arg; /* collect -Wl options */
};
```

这个结构体定义地可真是够复杂的！C 语言中结构体最大能有多大呢？哪个控制这个结构体的大小呢？


现在还不想每个字段每个字段单独的解析这个。


## tcc_new 函数

```c
LIBTCCAPI TCCState *tcc_new(void)
{
    TCCState *s;
    s = tcc_mallocz(sizeof(TCCState));  // 分配结构体的大小，在堆里面的
#ifdef MEM_DEBUG
    tcc_memcheck(1);
#endif

#undef gnu_ext
    // 因为这里需要堆 gnu_ext 赋值，之前可能会有这个 gnu_ext 的宏定义，所以需要取消
    s->gnu_ext = 1; 
    s->tcc_ext = 1;
    s->nocommon = 1;
    s->dollars_in_identifiers = 1; /*on by default like in gcc/clang*/
    s->cversion = 199901; /* default unless -std=c11 is supplied */
    s->warn_implicit_function_declaration = 1;
    s->warn_discarded_qualifiers = 1;
    s->ms_extensions = 1;

#ifdef CHAR_IS_UNSIGNED
    s->char_is_unsigned = 1;
#endif
#ifdef TCC_TARGET_I386
    s->seg_size = 32;
#endif
    /* enable this if you want symbols with leading underscore on windows: */
#if defined TCC_TARGET_MACHO /* || defined TCC_TARGET_PE */
    s->leading_underscore = 1;
#endif
#ifdef TCC_TARGET_ARM
    s->float_abi = ARM_FLOAT_ABI;
#endif
#ifdef CONFIG_NEW_DTAGS
    s->enable_new_dtags = 1;
#endif
    s->ppfp = stdout;
    /* might be used in error() before preprocess_start() */
    s->include_stack_ptr = s->include_stack;

    tcc_set_lib_path(s, CONFIG_TCCDIR);
    return s;
}
```

## tcc_mallocz 函数


## #undef gnu_ext

这个见 [#undef gnu_ext 是什么意思](./#undefgnu_ext是什么意思.md)


tcc.h 中有定义: 
```c
    /* use GNU C extensions */
    unsigned char gnu_ext;
    /* use TinyCC extensions */
    unsigned char tcc_ext;
```


tcc.h 中还有这个定义：

```c
#define gnu_ext             TCC_STATE_VAR(gnu_ext)
```


感觉就是封装一个宏用于去取属性：

```c
#undef TCC_STATE_VAR
#undef TCC_SET_STATE

#ifdef USING_GLOBALS
# define TCC_STATE_VAR(sym) tcc_state->sym
# define TCC_SET_STATE(fn) fn
# undef USING_GLOBALS
# undef _tcc_error
#else
# define TCC_STATE_VAR(sym) s1->sym
# define TCC_SET_STATE(fn) (tcc_enter_state(s1),fn)
# define _tcc_error use_tcc_error_noabort
#endif
```

## USING_GLOBALS

TODO


## seg_size 是啥？



