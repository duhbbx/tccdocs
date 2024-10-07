# 2.2 static的用法


在 C 语言中，`static` 是一个关键字，它有多种不同的用法，具体取决于它在函数、变量或文件中的位置。`static` 主要用于控制变量和函数的**作用域**和**生命周期**。我们将详细讨论 `static` 在局部变量、全局变量和函数中的用法，并给出注意事项。

## 1. `static` 局部变量

### 1.1 用法

当 `static` 修饰局部变量时，该变量的生命周期扩展为整个程序运行期间，即它是**静态存储的**，但它的作用域仍然是定义它的函数内。

普通的局部变量在每次函数调用时都会重新创建和销毁，而 `static` 局部变量只在第一次调用时初始化，后续调用会保留其值。

### 1.2 示例

```c
#include <stdio.h>

void counter() {
    static int count = 0;  // 静态局部变量，初始化一次
    count++;
    printf("count = %d\n", count);
}

int main() {
    counter();  // 输出: count = 1
    counter();  // 输出: count = 2
    counter();  // 输出: count = 3
    return 0;
}
```

### 1.3 注意事项

- **静态局部变量只初始化一次**：即使多次调用函数，也不会再次初始化静态局部变量。
- **生命周期是整个程序运行期间**，但其作用域仅限于定义它的函数内部。

## 2. `static` 全局变量

### 2.1 用法

`static` 可以用来修饰全局变量，将全局变量的**作用域限制在定义它的文件内部**。通常，全局变量可以在整个程序中被其他文件访问，但使用 `static` 限制后，它只能在声明它的文件中访问，避免命名冲突。

### 2.2 示例

```c
// file1.c
static int count = 10;  // 静态全局变量，只在 file1.c 内可见

void increment() {
    count++;
}

int get_count() {
    return count;
}

// file2.c
#include <stdio.h>

extern int get_count();
extern void increment();

int main() {
    increment();  // file1.c 中的静态全局变量 count 被增加
    printf("count = %d\n", get_count());  // 输出: count = 11
    return 0;
}
```

### 2.3 注意事项

- **作用域仅限于定义它的文件**：即使其他文件使用 `extern` 关键字，也无法访问 `static` 修饰的全局变量。
- **命名冲突避免**：使用 `static` 可以确保全局变量在不同文件中使用相同的名字时不会冲突。

## 3. `static` 函数

### 3.1 用法

`static` 函数的作用域也仅限于定义它的文件内。它与 `static` 全局变量类似，修饰函数后，该函数只能在定义它的文件内调用。

### 3.2 示例

```c
// file1.c
static void helper() {
    printf("This is a static function.\n");
}

void call_helper() {
    helper();  // 可以在 file1.c 中调用
}

// file2.c
#include <stdio.h>

extern void call_helper();

int main() {
    call_helper();  // file1.c 中的函数被调用
    // helper();  // 错误！无法在 file2.c 中调用 static 函数
    return 0;
}
```

### 3.3 注意事项

- **作用域仅限于文件内**：`static` 函数不能被其他文件直接调用，即使使用 `extern` 也无效。
- **函数命名冲突避免**：如果在多个文件中定义了相同名字的 `static` 函数，它们彼此之间不会冲突，因为它们的作用域都仅限于各自的文件。

## 4. `static` 在类/结构体中的使用（C++ 对比）

在 C 语言中，`static` 不能直接修饰结构体成员。但在 C++ 中，`static` 可以用于类的静态成员变量和静态成员函数。静态成员属于类而不属于类的实例，它们在所有实例之间共享。

### 4.1 示例（C++）

```cpp
#include <iostream>

class MyClass {
public:
    static int count;  // 静态成员变量
    MyClass() {
        count++;
    }
};

int MyClass::count = 0;  // 静态成员变量的初始化

int main() {
    MyClass obj1;
    MyClass obj2;
    std::cout << "Count: " << MyClass::count << std::endl;  // 输出: Count: 2
    return 0;
}
```

## 5. `static` 与多线程

在多线程程序中，使用 `static` 局部变量时需要格外小心，因为静态局部变量是跨函数调用共享的。如果多个线程同时访问该变量而没有同步机制，可能会导致竞争条件（race condition）。

### 5.1 示例

```c
#include <pthread.h>
#include <stdio.h>

void* thread_func(void* arg) {
    static int shared_data = 0;  // 静态局部变量，多个线程共享
    shared_data++;
    printf("Thread %ld: shared_data = %d\n", (long)arg, shared_data);
    return NULL;
}

int main() {
    pthread_t threads[5];

    for (long i = 0; i < 5; i++) {
        pthread_create(&threads[i], NULL, thread_func, (void*)i);
    }

    for (int i = 0; i < 5; i++) {
        pthread_join(threads[i], NULL);
    }

    return 0;
}
```

### 5.2 竞争条件问题

- **问题**：多个线程共享同一个 `static` 变量 `shared_data`，可能导致线程之间的竞争条件。多个线程同时访问或修改该变量时，可能会导致意外结果。
- **解决办法**：通过使用互斥锁（mutex）等同步机制保护共享的 `static` 变量。

## 6. 其他注意事项

1. **静态变量初始化**：
   - `static` 变量在程序开始时被初始化一次，未显式初始化的静态变量会被自动初始化为**零**。
   - 静态变量的初始化只发生一次，且是在程序启动时，而不是每次进入作用域时。

2. **局部和全局的区别**：
   - 局部静态变量的作用域是函数内部，而全局静态变量的作用域是文件内部。
   - 局部静态变量的生命周期与程序相同，而普通局部变量的生命周期只限于函数调用期间。

3. **避免名称冲突**：
   - 静态全局变量和静态函数可以有效避免不同文件中同名的全局变量或函数引发的冲突。

4. **性能优化**：
   - 静态变量的使用可能在某些场景中提供性能上的优化，因为它们在整个程序运行期间仅初始化一次。

## 总结

- **局部变量**：`static` 局部变量在函数内部作用域中可见，但生命周期贯穿整个程序运行。
- **全局变量**：`static` 全局变量只能在声明它的文件中可见，作用域限制在文件内，避免全局命名冲突。
- **函数**：`static` 函数只能在声明它的文件中可见，不能被其他文件调用。
- **多线程问题**：在多线程程序中使用 `static` 变量需要特别注意同步问题。

通过正确使用 `static`，可以控制变量的可见性、生命周期，以及有效避免全局变量和函数命名冲突，同时确保静态局部变量的值在多次函数调用之间保持一致。