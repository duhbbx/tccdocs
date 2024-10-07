# 2.7 tcc_parse_args: 命令行参数的解析


## 调用

在 main 函数中是这么调用的：

```c
opt = tcc_parse_args(s, &argc, &argv, 1);
```

## 函数定义

`tcc_parse_args` 这个函数也非常之长。


```c
PUB_FUNC int tcc_parse_args(TCCState *s, int *pargc, char ***pargv, int optind)
{
    TCCState *s1 = s; // 传进来的状态
    const TCCOption *popt;  // TCCOption
    const char *optarg, *r;
    const char *run = NULL;
    int x;
    int tool = 0, arg_start = 0, noaction = optind;
    char **argv = *pargv;
    int argc = *pargc;

    cstr_reset(&s->linker_arg); // 重置链接参数

    while (optind < argc) { // optind 是选项的索引
        r = argv[optind];   // 获取第 optind 变量，这个是入参，从第几个开始解析
        if (r[0] == '@' && r[1] != '\0') {
            if (args_parser_listfile(s, r + 1, optind, &argc, &argv))
                return -1;
            continue;
        }
        optind++;
        if (tool) {
            if (r[0] == '-' && r[1] == 'v' && r[2] == 0)
                ++s->verbose;
            continue;
        }
reparse:
        if (r[0] != '-' || r[1] == '\0') {
            args_parser_add_file(s, r, s->filetype);
            if (run) {
dorun:
                if (tcc_set_options(s, run))
                    return -1;
                arg_start = optind - 1;
                break;
            }
            continue;
        }

        /* allow "tcc files... -run -- args ..." */
        if (r[1] == '-' && r[2] == '\0' && run)
            goto dorun;

        /* find option in table */
        for(popt = tcc_options; ; ++popt) {
            const char *p1 = popt->name;
            const char *r1 = r + 1;
            if (p1 == NULL)
                return tcc_error_noabort("invalid option -- '%s'", r);
            if (!strstart(p1, &r1))
                continue;
            optarg = r1;
            if (popt->flags & TCC_OPTION_HAS_ARG) {
                if (*r1 == '\0' && !(popt->flags & TCC_OPTION_NOSEP)) {
                    if (optind >= argc)
                arg_err:
                        return tcc_error_noabort("argument to '%s' is missing", r);
                    optarg = argv[optind++];
                }
            } else if (*r1 != '\0')
                continue;
            break;
        }

        switch(popt->index) {
        case TCC_OPTION_HELP:
            x = OPT_HELP;
            goto extra_action;
        case TCC_OPTION_HELP2:
            x = OPT_HELP2;
            goto extra_action;
        case TCC_OPTION_I:
            tcc_add_include_path(s, optarg);
            break;
        case TCC_OPTION_D:
            tcc_define_symbol(s, optarg, NULL);
            break;
        case TCC_OPTION_U:
            tcc_undefine_symbol(s, optarg);
            break;
        case TCC_OPTION_L:
            tcc_add_library_path(s, optarg);
            break;
        case TCC_OPTION_B:
            /* set tcc utilities path (mainly for tcc development) */
            tcc_set_lib_path(s, optarg);
            ++noaction;
            break;
        case TCC_OPTION_l:
            args_parser_add_file(s, optarg, AFF_TYPE_LIB | (s->filetype & ~AFF_TYPE_MASK));
            s->nb_libraries++;
            break;
        case TCC_OPTION_pthread:
            s->option_pthread = 1;
            break;
        case TCC_OPTION_bench:
            s->do_bench = 1;
            break;
#ifdef CONFIG_TCC_BACKTRACE
        case TCC_OPTION_bt:
            s->rt_num_callers = atoi(optarg); /* zero = default (6) */
            goto enable_backtrace;
        enable_backtrace:
            s->do_backtrace = 1;
            s->do_debug = s->do_debug ? s->do_debug : 1;
	    s->dwarf = DWARF_VERSION;
            break;
#ifdef CONFIG_TCC_BCHECK
        case TCC_OPTION_b:
            s->do_bounds_check = 1;
            goto enable_backtrace;
#endif
#endif
        case TCC_OPTION_g:
            s->do_debug = 2;
            s->dwarf = DWARF_VERSION;
            if (strstart("dwarf", &optarg)) {
                s->dwarf = (*optarg) ? (0 - atoi(optarg)) : DEFAULT_DWARF_VERSION;
            } else if (isnum(*optarg)) {
                x = *optarg - '0';
                /* -g0 = no info, -g1 = lines/functions only, -g2 = full info */
                s->do_debug = x > 2 ? 2 : x == 0 && s->do_backtrace ? 1 : x;
#ifdef TCC_TARGET_PE
            } else if (0 == strcmp(".pdb", optarg)) {
                s->dwarf = 5, s->do_debug |= 16;
#endif
            }
            break;
        case TCC_OPTION_c:
            x = TCC_OUTPUT_OBJ;
        set_output_type:
            if (s->output_type)
                tcc_warning("-%s: overriding compiler action already specified", popt->name);
            s->output_type = x;
            break;
        case TCC_OPTION_d:
            if (*optarg == 'D')
                s->dflag = 3;
            else if (*optarg == 'M')
                s->dflag = 7;
            else if (*optarg == 't')
                s->dflag = 16;
            else if (isnum(*optarg))
                s->g_debug |= atoi(optarg);
            else
                goto unsupported_option;
            break;
        case TCC_OPTION_static:
            s->static_link = 1;
            break;
        case TCC_OPTION_std:
            if (strcmp(optarg, "=c11") == 0)
                s->cversion = 201112;
            break;
        case TCC_OPTION_shared:
            x = TCC_OUTPUT_DLL;
            goto set_output_type;
        case TCC_OPTION_soname:
            s->soname = tcc_strdup(optarg);
            break;
        case TCC_OPTION_o:
            if (s->outfile) {
                tcc_warning("multiple -o option");
                tcc_free(s->outfile);
            }
            s->outfile = tcc_strdup(optarg);
            break;
        case TCC_OPTION_r:
            /* generate a .o merging several output files */
            s->option_r = 1;
            x = TCC_OUTPUT_OBJ;
            goto set_output_type;
        case TCC_OPTION_isystem:
            tcc_add_sysinclude_path(s, optarg);
            break;
        case TCC_OPTION_include:
            cstr_printf(&s->cmdline_incl, "#include \"%s\"\n", optarg);
            break;
        case TCC_OPTION_nostdinc:
            s->nostdinc = 1;
            break;
        case TCC_OPTION_nostdlib:
            s->nostdlib = 1;
            break;
        case TCC_OPTION_run:
#ifndef TCC_IS_NATIVE
            return tcc_error_noabort("-run is not available in a cross compiler");
#else
            run = optarg;
            x = TCC_OUTPUT_MEMORY;
            goto set_output_type;
#endif
        case TCC_OPTION_v:
            do ++s->verbose; while (*optarg++ == 'v');
            ++noaction;
            break;
        case TCC_OPTION_f:
            if (set_flag(s, options_f, optarg) < 0)
                goto unsupported_option;
            break;
#ifdef TCC_TARGET_ARM
        case TCC_OPTION_mfloat_abi:
            /* tcc doesn't support soft float yet */
            if (!strcmp(optarg, "softfp")) {
                s->float_abi = ARM_SOFTFP_FLOAT;
            } else if (!strcmp(optarg, "hard"))
                s->float_abi = ARM_HARD_FLOAT;
            else
                return tcc_error_noabort("unsupported float abi '%s'", optarg);
            break;
#endif
        case TCC_OPTION_m:
            if (set_flag(s, options_m, optarg) < 0) {
                if (x = atoi(optarg), x != 32 && x != 64)
                    goto unsupported_option;
                if (PTR_SIZE != x/8)
                    return x;
                ++noaction;
            }
            break;
        case TCC_OPTION_W:
            s->warn_none = 0;
            if (optarg[0] && set_flag(s, options_W, optarg) < 0)
                goto unsupported_option;
            break;
        case TCC_OPTION_w:
            s->warn_none = 1;
            break;
        case TCC_OPTION_rdynamic:
            s->rdynamic = 1;
            break;
        case TCC_OPTION_Wl:
            if (s->linker_arg.size)
                ((char*)s->linker_arg.data)[s->linker_arg.size - 1] = ',';
            cstr_cat(&s->linker_arg, optarg, 0);
            x = tcc_set_linker(s, s->linker_arg.data);
            if (x)
                cstr_reset(&s->linker_arg);
            if (x < 0)
                return -1;
            break;
        case TCC_OPTION_Wp:
            r = optarg;
            goto reparse;
        case TCC_OPTION_E:
            x = TCC_OUTPUT_PREPROCESS;
            goto set_output_type;
        case TCC_OPTION_P:
            s->Pflag = atoi(optarg) + 1;
            break;
        case TCC_OPTION_M:
            s->include_sys_deps = 1;
            // fall through
        case TCC_OPTION_MM:
            s->just_deps = 1;
            if(!s->deps_outfile)
                s->deps_outfile = tcc_strdup("-");
            // fall through
        case TCC_OPTION_MMD:
            s->gen_deps = 1;
            break;
        case TCC_OPTION_MD:
            s->gen_deps = 1;
            s->include_sys_deps = 1;
            break;
        case TCC_OPTION_MF:
            s->deps_outfile = tcc_strdup(optarg);
            break;
        case TCC_OPTION_MP:
            s->gen_phony_deps = 1;
            break;
        case TCC_OPTION_dumpmachine:
            printf("%s\n", dumpmachine_str);
            exit(0);
        case TCC_OPTION_dumpversion:
            printf ("%s\n", TCC_VERSION);
            exit(0);
        case TCC_OPTION_x:
            x = 0;
            if (*optarg == 'c')
                x = AFF_TYPE_C;
            else if (*optarg == 'a')
                x = AFF_TYPE_ASMPP;
            else if (*optarg == 'b')
                x = AFF_TYPE_BIN;
            else if (*optarg == 'n')
                x = AFF_TYPE_NONE;
            else
                tcc_warning("unsupported language '%s'", optarg);
            s->filetype = x | (s->filetype & ~AFF_TYPE_MASK);
            break;
        case TCC_OPTION_O:
            s->optimize = atoi(optarg);
            break;
        case TCC_OPTION_print_search_dirs:
            x = OPT_PRINT_DIRS;
            goto extra_action;
        case TCC_OPTION_impdef:
            x = OPT_IMPDEF;
            goto extra_action;
#if defined TCC_TARGET_MACHO
        case TCC_OPTION_dynamiclib:
            x = TCC_OUTPUT_DLL;
            goto set_output_type;
        case TCC_OPTION_flat_namespace:
	     break;
        case TCC_OPTION_two_levelnamespace:
	     break;
        case TCC_OPTION_undefined:
	     break;
        case TCC_OPTION_install_name:
	    s->install_name = tcc_strdup(optarg);
            break;
        case TCC_OPTION_compatibility_version:
	    s->compatibility_version = parse_version(s, optarg);
            break;
        case TCC_OPTION_current_version:
	    s->current_version = parse_version(s, optarg);;
            break;
#endif
        case TCC_OPTION_ar:
            x = OPT_AR;
        extra_action:
            arg_start = optind - 1;
            if (arg_start != noaction)
                return tcc_error_noabort("cannot parse %s here", r);
            tool = x;
            break;
        default:
unsupported_option:
            tcc_warning_c(warn_unsupported)("unsupported option '%s'", r);
            break;
        }
    }
    if (s->linker_arg.size) {
        r = s->linker_arg.data;
        goto arg_err;
    }
    *pargc = argc - arg_start;
    *pargv = argv + arg_start;
    if (tool)
        return tool;
    if (optind != noaction)
        return 0;
    if (s->verbose == 2)
        return OPT_PRINT_DIRS;
    if (s->verbose)
        return OPT_V;
    return OPT_HELP;
}
```




## PUB_FUNC 宏

```c
# ifdef LIBTCC_AS_DLL
#  define LIBTCCAPI __declspec(dllexport)
#  define PUB_FUNC LIBTCCAPI
# endif



#ifndef PUB_FUNC /* functions used by tcc.c but not in libtcc.h */
# define PUB_FUNC
#endif
```

在 TinyCC（TCC）的代码中，`PUB_FUNC` 宏用于控制函数的导出方式，尤其是在构建**动态链接库**（DLL）时的导出策略。让我们逐步分析这段代码，解释 `PUB_FUNC` 宏以及它的作用。

### 1. `LIBTCC_AS_DLL` 的作用

```c
# ifdef LIBTCC_AS_DLL
```

这段代码首先检查是否定义了 `LIBTCC_AS_DLL`。这个宏通常在构建 TinyCC 作为**动态链接库**（DLL）时定义。如果 `LIBTCC_AS_DLL` 被定义，意味着当前正在构建 TinyCC 的动态库版本，此时某些函数和符号需要显式导出，以供外部程序或库使用。

### 2. `LIBTCCAPI` 和 `PUB_FUNC` 宏

```c
#  define LIBTCCAPI __declspec(dllexport)
#  define PUB_FUNC LIBTCCAPI
# endif
```

- **`__declspec(dllexport)`**：这是一个用于 Windows 平台的特定声明，表示将某个符号（通常是函数或变量）导出，以便其他模块（比如其他 EXE 或 DLL 文件）可以使用它。
  - 当编译一个 DLL 文件时，只有使用了 `__declspec(dllexport)` 声明的符号会被导出供外部使用。
  
- **`LIBTCCAPI`**：`LIBTCCAPI` 被定义为 `__declspec(dllexport)`，意味着任何使用 `LIBTCCAPI` 的函数声明将被导出到 DLL 中。

- **`PUB_FUNC`**：接着，`PUB_FUNC` 被定义为 `LIBTCCAPI`，也就是 `__declspec(dllexport)`。所以，在 `LIBTCC_AS_DLL` 被定义时，`PUB_FUNC` 实际上是一个符号导出声明，它将指定的函数导出到 DLL。

### 3. `#ifndef PUB_FUNC` 宏块

```c
#ifndef PUB_FUNC /* functions used by tcc.c but not in libtcc.h */
# define PUB_FUNC
#endif
```

这部分代码用于处理一种情况：如果 `LIBTCC_AS_DLL` 没有被定义，那么 `PUB_FUNC` 之前并没有被定义为 `LIBTCCAPI`。因此，它会为 `PUB_FUNC` 提供一个默认定义，使其为空。

换句话说：
- **如果没有定义 `LIBTCC_AS_DLL`**，`PUB_FUNC` 将被定义为空（即它不做任何事情）。
- **如果定义了 `LIBTCC_AS_DLL`**，`PUB_FUNC` 将被定义为 `__declspec(dllexport)`，用于导出函数。

### 总结

- **`PUB_FUNC` 宏的作用**：`PUB_FUNC` 控制函数的导出。在构建动态库时，它确保指定的函数可以被导出并供外部使用。在构建静态库或普通可执行文件时，`PUB_FUNC` 为空，起不到任何作用。

- **使用场景**：
  - 当 TCC 被编译成 DLL 时，`PUB_FUNC` 宏会被展开为 `__declspec(dllexport)`，使得标记为 `PUB_FUNC` 的函数能够导出。
  - 当 TCC 被编译为静态库或普通可执行文件时，`PUB_FUNC` 不会导出任何函数，只是一个空的占位符。

### 示例

假设我们有一个函数：

```c
PUB_FUNC void my_function() {
    // 函数实现
}
```

- 如果在构建 TCC 时定义了 `LIBTCC_AS_DLL`，这段代码会被展开为：

  ```c
  __declspec(dllexport) void my_function() {
      // 函数实现
  }
  ```

  这样，`my_function` 函数就会被导出到 DLL 中，外部程序可以调用它。

- 如果没有定义 `LIBTCC_AS_DLL`，则 `PUB_FUNC` 会被定义为空，最终代码变为：

  ```c
  void my_function() {
      // 函数实现
  }
  ```

  在这种情况下，`my_function` 只是一个普通的函数，不会被导出到 DLL 中。

### 好处和使用场景

- **跨平台支持**：通过使用宏（如 `LIBTCCAPI` 和 `PUB_FUNC`），可以在构建动态库时控制符号导出，同时也可以支持跨平台（虽然 `__declspec(dllexport)` 是 Windows 特定的，但类似机制在其他平台上也有，比如 `__attribute__((visibility("default")))` 在 Linux 中）。
  
- **灵活性**：通过这种宏定义，你可以在同一套代码中灵活地控制符号导出，适应不同的编译配置，而无需在代码中进行繁杂的修改。

总结来说，`PUB_FUNC` 是一种预处理宏，用来灵活控制在不同编译环境（DLL 或非 DLL）中函数是否需要导出给外部使用。



## LIBTCCAPI

```
#ifndef LIBTCCAPI
# define LIBTCCAPI
#endif


# ifdef LIBTCC_AS_DLL
#  define LIBTCCAPI __declspec(dllexport)
#  define PUB_FUNC LIBTCCAPI
# endif
```


在 C 语言中，使用 `#ifndef`（如果没有定义）和 `#define` 的模式是一种非常常见的防御性编程方法，用来确保宏或标识符有一个默认定义。这种模式主要是为了避免编译器报错并保证代码在各种环境下的兼容性和健壮性。

对于你提到的代码：

```c
#ifndef LIBTCCAPI
# define LIBTCCAPI
#endif
```

这个做法背后的原因可以归结为以下几点：

### 1. **确保宏总有一个定义**

`#ifndef` 的意思是“如果没有定义 `LIBTCCAPI`”，则定义它为默认值。在这种情况下，`LIBTCCAPI` 被定义为空（`#define LIBTCCAPI`）。这样做的目的是确保代码在某些编译环境下，即使没有明确定义 `LIBTCCAPI`，也能正常编译。

例如，`LIBTCCAPI` 可能用于在不同的编译配置中标识函数的导出或可见性，但在某些情况下（例如静态编译或不需要导出的环境中），可能没有设置这个宏。这时，如果没有给它一个默认值（空值），编译器可能会报错，因为没有定义的宏会导致未预期的行为。

### 2. **增强代码的可移植性**

通过这种防御性编程模式，开发者可以确保代码能够在**不同的编译器**和**不同的编译选项**下正常工作。举个例子：

- 在**Windows 动态链接库**（DLL）编译时，`LIBTCCAPI` 可能需要定义为 `__declspec(dllexport)` 来导出函数。
- 在**静态链接**或**普通编译**时，`LIBTCCAPI` 不需要定义任何东西，因为没有函数需要导出。在这种情况下，`#define LIBTCCAPI`（即定义为空）就确保了代码的兼容性。

这样，代码就可以在动态链接、静态链接、不同平台之间保持兼容。

### 3. **避免重复定义或冲突**

通过这种模式，开发者可以确保在代码的其他地方（或者通过编译器命令行参数）已经定义了 `LIBTCCAPI` 的情况下，不会重新定义它，避免重复定义的错误。

例如，可能在编译时已经通过编译器选项或在其他头文件中定义了 `LIBTCCAPI`，如果再重新定义会导致冲突。`#ifndef LIBTCCAPI` 确保只有在 `LIBTCCAPI` 未定义时才会给它一个默认定义，防止重复定义和冲突。

### 4. **代码的灵活性和可维护性**

使用这种结构可以使代码更易于维护。你可以在不同的编译环境下自定义 `LIBTCCAPI`，而无需修改源代码的每一个地方。例如，如果你要在某个编译环境中导出函数，你只需要在编译器或项目的配置中定义 `LIBTCCAPI`，而不需要修改头文件：

```c
// Windows DLL 编译时，可能通过编译器参数定义 LIBTCCAPI 为 __declspec(dllexport)
gcc -DLIBTCCAPI=__declspec(dllexport)
```

在这种情况下，`LIBTCCAPI` 就不会被 `#define LIBTCCAPI` 空替代，因为它已经在编译时被定义了。

### 例子

考虑以下代码片段：

```c
#ifndef LIBTCCAPI
# define LIBTCCAPI
#endif

LIBTCCAPI void my_function();
```

在不同的编译配置下：
- **Windows 动态链接库**（DLL）编译时，`LIBTCCAPI` 可能被定义为 `__declspec(dllexport)`，从而导出 `my_function`。
- **静态库编译**或**普通可执行文件**时，`LIBTCCAPI` 不需要任何定义。在这种情况下，`#define LIBTCCAPI` 将会使它为空，这样代码仍然能正常工作。

### 5. **总结**

- **目的**：`#ifndef LIBTCCAPI #define LIBTCCAPI` 是为了防止 `LIBTCCAPI` 未定义导致的编译错误，并确保代码在不同平台和编译环境下的兼容性和可移植性。
- **灵活性**：它允许 `LIBTCCAPI` 在特定环境中（例如 DLL 编译时）被自定义，而在其他环境中提供一个默认的空定义，确保代码不会因为未定义的宏而出错。
- **可移植性和健壮性**：这种防御性编程使得代码能够在不同的编译器和平台下更稳健地运行。

通过这种方式，开发者可以写出更通用、更健壮的代码，在不同的编译环境中都能正常工作。


## cstr_reset


```c
/* reset string to empty */
ST_FUNC void cstr_reset(CString *cstr)
{
    cstr->size = 0;
}
```

## tcc_parse_args 的返回码

```c
/* tcc_parse_args return codes: */
#define OPT_HELP 1
#define OPT_HELP2 2
#define OPT_V 3
#define OPT_PRINT_DIRS 4
#define OPT_AR 5
#define OPT_IMPDEF 6
#define OPT_M32 32
#define OPT_M64 64
```

