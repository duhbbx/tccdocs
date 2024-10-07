

# decl



## 源码


```c
/* 'l' is VT_LOCAL or VT_CONST to define default storage type
   or VT_CMP if parsing old style parameter list
   or VT_JMP if parsing c99 for decl: for (int i = 0, ...) */
static int decl(int l)
{
    int v, has_init, r, oldint;
    CType type, btype;
    Sym *sym;
    AttributeDef ad, adbase;

    while (1) {

        oldint = 0;
        if (!parse_btype(&btype, &adbase, l == VT_LOCAL)) {
            if (l == VT_JMP)
                return 0;
            /* skip redundant ';' if not in old parameter decl scope */
            if (tok == ';' && l != VT_CMP) {
                next();
                continue;
            }
            if (tok == TOK_STATIC_ASSERT) {
                do_Static_assert();
                continue;
            }
            if (l != VT_CONST)
                break;
            if (tok == TOK_ASM1 || tok == TOK_ASM2 || tok == TOK_ASM3) {
                /* global asm block */
                asm_global_instr();
                continue;
            }
            if (tok >= TOK_UIDENT) {
               /* special test for old K&R protos without explicit int
                  type. Only accepted when defining global data */
                btype.t = VT_INT;
                oldint = 1;
            } else {
                if (tok != TOK_EOF)
                    expect("declaration");
                break;
            }
        }

        if (tok == ';') {
	    if ((btype.t & VT_BTYPE) == VT_STRUCT) {
		v = btype.ref->v;
		if (!(v & SYM_FIELD) && (v & ~SYM_STRUCT) >= SYM_FIRST_ANOM)
        	    tcc_warning("unnamed struct/union that defines no instances");
                next();
                continue;
	    }
            if (IS_ENUM(btype.t)) {
                next();
                continue;
            }
        }

        while (1) { /* iterate thru each declaration */
            type = btype;
	    ad = adbase;
            type_decl(&type, &ad, &v, TYPE_DIRECT);
#if 0
            {
                char buf[500];
                type_to_str(buf, sizeof(buf), &type, get_tok_str(v, NULL));
                printf("type = '%s'\n", buf);
            }
#endif
            if ((type.t & VT_BTYPE) == VT_FUNC) {
                if ((type.t & VT_STATIC) && (l != VT_CONST))
                    tcc_error("function without file scope cannot be static");
                /* if old style function prototype, we accept a
                   declaration list */
                sym = type.ref;
                if (sym->f.func_type == FUNC_OLD && l == VT_CONST) {
                    func_vt = type;
                    decl(VT_CMP);
                }
#if defined TCC_TARGET_MACHO || defined TARGETOS_ANDROID
                if (sym->f.func_alwinl
                    && ((type.t & (VT_EXTERN | VT_INLINE))
                        == (VT_EXTERN | VT_INLINE))) {
                    /* always_inline functions must be handled as if they
                       don't generate multiple global defs, even if extern
                       inline, i.e. GNU inline semantics for those.  Rewrite
                       them into static inline.  */
                    type.t &= ~VT_EXTERN;
                    type.t |= VT_STATIC;
                }
#endif
                /* always compile 'extern inline' */
                if (type.t & VT_EXTERN)
                    type.t &= ~VT_INLINE;

            } else if (oldint) {
                tcc_warning("type defaults to int");
            }

            if (gnu_ext && (tok == TOK_ASM1 || tok == TOK_ASM2 || tok == TOK_ASM3)) {
                ad.asm_label = asm_label_instr();
                /* parse one last attribute list, after asm label */
                parse_attribute(&ad);
            #if 0
                /* gcc does not allow __asm__("label") with function definition,
                   but why not ... */
                if (tok == '{')
                    expect(";");
            #endif
            }

#ifdef TCC_TARGET_PE
            if (ad.a.dllimport || ad.a.dllexport) {
                if (type.t & VT_STATIC)
                    tcc_error("cannot have dll linkage with static");
                if (type.t & VT_TYPEDEF) {
                    tcc_warning("'%s' attribute ignored for typedef",
                        ad.a.dllimport ? (ad.a.dllimport = 0, "dllimport") :
                        (ad.a.dllexport = 0, "dllexport"));
                } else if (ad.a.dllimport) {
                    if ((type.t & VT_BTYPE) == VT_FUNC)
                        ad.a.dllimport = 0;
                    else
                        type.t |= VT_EXTERN;
                }
            }
#endif
            if (tok == '{') {
                if (l != VT_CONST)
                    tcc_error("cannot use local functions");
                if ((type.t & VT_BTYPE) != VT_FUNC)
                    expect("function definition");

                /* reject abstract declarators in function definition
                   make old style params without decl have int type */
                sym = type.ref;
                while ((sym = sym->next) != NULL) {
                    if (!(sym->v & ~SYM_FIELD))
                        expect("identifier");
                    if (sym->type.t == VT_VOID)
                        sym->type = int_type;
                }

                /* apply post-declaraton attributes */
                merge_funcattr(&type.ref->f, &ad.f);

                /* put function symbol */
                type.t &= ~VT_EXTERN;
                sym = external_sym(v, &type, 0, &ad);

                /* static inline functions are just recorded as a kind
                   of macro. Their code will be emitted at the end of
                   the compilation unit only if they are used */
                if (sym->type.t & VT_INLINE) {
                    struct InlineFunc *fn;
                    fn = tcc_malloc(sizeof *fn + strlen(file->filename));
                    strcpy(fn->filename, file->filename);
                    fn->sym = sym;
                    dynarray_add(&tcc_state->inline_fns,
				 &tcc_state->nb_inline_fns, fn);
                    skip_or_save_block(&fn->func_str);
                } else {
                    /* compute text section */
                    cur_text_section = ad.section;
                    if (!cur_text_section)
                        cur_text_section = text_section;
                    gen_function(sym);
                }
                break;
            } else {
		if (l == VT_CMP) {
		    /* find parameter in function parameter list */
		    for (sym = func_vt.ref->next; sym; sym = sym->next)
			if ((sym->v & ~SYM_FIELD) == v)
			    goto found;
		    tcc_error("declaration for parameter '%s' but no such parameter",
			      get_tok_str(v, NULL));
                found:
		    if (type.t & VT_STORAGE) /* 'register' is okay */
		        tcc_error("storage class specified for '%s'",
				  get_tok_str(v, NULL));
		    if (sym->type.t != VT_VOID)
		        tcc_error("redefinition of parameter '%s'",
				  get_tok_str(v, NULL));
		    convert_parameter_type(&type);
		    sym->type = type;
		} else if (type.t & VT_TYPEDEF) {
                    /* save typedefed type  */
                    /* XXX: test storage specifiers ? */
                    sym = sym_find(v);
                    if (sym && sym->sym_scope == local_scope) {
                        if (!is_compatible_types(&sym->type, &type)
                            || !(sym->type.t & VT_TYPEDEF))
                            tcc_error("incompatible redefinition of '%s'",
                                get_tok_str(v, NULL));
                        sym->type = type;
                    } else {
                        sym = sym_push(v, &type, 0, 0);
                    }
                    sym->a = ad.a;
                    if ((type.t & VT_BTYPE) == VT_FUNC)
                      merge_funcattr(&sym->type.ref->f, &ad.f);
                    if (debug_modes)
                        tcc_debug_typedef (tcc_state, sym);
		} else if ((type.t & VT_BTYPE) == VT_VOID
			   && !(type.t & VT_EXTERN)) {
		    tcc_error("declaration of void object");
                } else {
                    r = 0;
                    if ((type.t & VT_BTYPE) == VT_FUNC) {
                        /* external function definition */
                        /* specific case for func_call attribute */
                        merge_funcattr(&type.ref->f, &ad.f);
                    } else if (!(type.t & VT_ARRAY)) {
                        /* not lvalue if array */
                        r |= VT_LVAL;
                    }
                    has_init = (tok == '=');
                    if (has_init && (type.t & VT_VLA))
                        tcc_error("variable length array cannot be initialized");

                    if (((type.t & VT_EXTERN) && (!has_init || l != VT_CONST))
		        || (type.t & VT_BTYPE) == VT_FUNC
                        /* as with GCC, uninitialized global arrays with no size
                           are considered extern: */
                        || ((type.t & VT_ARRAY) && !has_init
                            && l == VT_CONST && type.ref->c < 0)
                        ) {
                        /* external variable or function */
                        type.t |= VT_EXTERN;
                        sym = external_sym(v, &type, r, &ad);
                    } else {
                        if (l == VT_CONST || (type.t & VT_STATIC))
                            r |= VT_CONST;
                        else
                            r |= VT_LOCAL;
                        if (has_init)
                            next();
                        else if (l == VT_CONST)
                            /* uninitialized global variables may be overridden */
                            type.t |= VT_EXTERN;
                        decl_initializer_alloc(&type, &ad, r, has_init, v, l == VT_CONST);
                    }

                    if (ad.alias_target && l == VT_CONST) {
                        /* Aliases need to be emitted when their target symbol
                           is emitted, even if perhaps unreferenced.
                           We only support the case where the base is already
                           defined, otherwise we would need deferring to emit
                           the aliases until the end of the compile unit.  */
                        Sym *alias_target = sym_find(ad.alias_target);
                        ElfSym *esym = elfsym(alias_target);
                        if (!esym)
                            tcc_error("unsupported forward __alias__ attribute");
                        put_extern_sym2(sym_find(v), esym->st_shndx,
                                        esym->st_value, esym->st_size, 1);
                    }
                }
                if (tok != ',') {
                    if (l == VT_JMP)
                        return 1;
                    skip(';');
                    break;
                }
                next();
            }
        }
    }
    return 0;
}
```