# 1.5 构建调试环境

在 .vscode 下建两个 json 配置文件


## launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(lldb) Launch",
            "type": "lldb",
            "request": "launch",
            "program": "${workspaceFolder}/tcc", // 替换为你的可执行文件路径
            "args": ["a.c", "-o", "a.out"],
            "cwd": "${workspaceFolder}",
            "preLaunchTask": "build with tcc",  // 用于编译任务
        }
    ]
}
```

## tasks.json

```json
{
    "tasks": [
        {
            "type": "cppbuild",
            "label": "build with tcc",
            "command": "/usr/bin/make",
            "args": [],
            "options": {
                "cwd": "${workspaceFolder}"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "调试器生成的任务。"
        }
    ],
    "version": "2.0.0"
}

```



## 调整 config.mak 的配置

```
CFLAGS=-Wall -O0 -g -Wdeclaration-after-statement -fno-strict-aliasing -fheinous-gnu-extensions -Wno-pointer-sign -Wno-sign-compare -Wno-unused-result -Wno-string-plus-int -Wno-deprecated-declarations
```




## 构建 tinycc

```bash
./configure
make
make test
make install
```

