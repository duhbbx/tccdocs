# scope

```c
static struct scope {
    struct scope *prev;
    struct { int loc, locorig, num; } vla;
    struct { Sym *s; int n; } cl;
    int *bsym, *csym;
    Sym *lstk, *llstk;
} *cur_scope, *loop_scope, *root_scope;
```

