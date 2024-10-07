

# TokenSym



```c
/* token symbol management */
typedef struct TokenSym {
    struct TokenSym *hash_next; // 为啥还有这个？
    struct Sym *sym_define; /* direct pointer to define */
    struct Sym *sym_label; /* direct pointer to label */
    struct Sym *sym_struct; /* direct pointer to structure */
    struct Sym *sym_identifier; /* direct pointer to identifier */
    int tok; /* token number */
    int len;
    char str[1];
} TokenSym;
```

token symbol 的管理

