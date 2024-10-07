

# ST_FUNC 的用法




## 定义

定义的位置是在 `tcc.h` 中，其实就是 static 关键字

```
#if ONE_SOURCE
#define ST_INLN static inline
#define ST_FUNC static
#define ST_DATA static
#else
#define ST_INLN
#define ST_FUNC
#define ST_DATA extern
#endif

#ifdef TCC_PROFILE /* profile all functions */
# define static
# define inline
#endif
```




## 作用




## 出现的位置