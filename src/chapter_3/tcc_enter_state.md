

# tcc_enter_state


## tcc_enter_state


```c
PUB_FUNC void tcc_enter_state(TCCState *s1)
{
    if (s1->error_set_jmp_enabled)
        return;
    WAIT_SEM(&tcc_compile_sem);
    tcc_state = s1;
}

PUB_FUNC void tcc_exit_state(TCCState *s1)
{
    if (s1->error_set_jmp_enabled)
        return;
    tcc_state = NULL;
    POST_SEM(&tcc_compile_sem);
}
```


## tcc_exit_state

## WAIT_SEM

好像是加锁


```c
/********************************************************/
#if CONFIG_TCC_SEMLOCK
#if defined _WIN32
typedef struct { int init; CRITICAL_SECTION cr; } TCCSem;
#elif defined __APPLE__
#include <dispatch/dispatch.h>
typedef struct { int init; dispatch_semaphore_t sem; } TCCSem;
#else
#include <semaphore.h>
typedef struct { int init; sem_t sem; } TCCSem;
#endif
ST_FUNC void wait_sem(TCCSem *p);
ST_FUNC void post_sem(TCCSem *p);
#define TCC_SEM(s) TCCSem s
#define WAIT_SEM wait_sem
#define POST_SEM post_sem
#else
#define TCC_SEM(s)
#define WAIT_SEM(p)
#define POST_SEM(p)
#endif
```



## tcc_compile_sem

```c
/********************************************************/
/* global variables */

/* XXX: get rid of this ASAP (or maybe not) */
ST_DATA struct TCCState *tcc_state;
TCC_SEM(static tcc_compile_sem);
/* an array of pointers to memory to be free'd after errors */
ST_DATA void** stk_data;
ST_DATA int nb_stk_data;
```


## TCC_SEM


## TCCSem






