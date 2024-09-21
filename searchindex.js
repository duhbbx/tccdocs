Object.assign(window.search, {"doc_urls":["introduction.html#引言","introduction.html#作者信息","chapter_1/section_1_1.html#11-tinycc-项目介绍","chapter_1/section_1_1.html#tinycc-项目介绍","chapter_1/section_1_1.html#项目特点","chapter_1/section_1_1.html#核心功能","chapter_1/section_1_1.html#使用场景","chapter_1/section_1_1.html#安装与使用","chapter_1/section_1_1.html#项目历史","chapter_1/section_1_1.html#项目优势和不足","chapter_1/section_1_1.html#结论","chapter_1/section_1_1.html#相关链接","chapter_1/section_1_2.html#12-构建调试环境","chapter_1/section_1_3.html#13-构建调试环境","chapter_1/section_1_4.html#14-入口代码","chapter_1.html#第一章-tccc-主流程分析","chapter_2.html#第二章-编译的整体流程","chapter_3.html#第三章-词法分析","chapter_4.html#第四章-语法分析","chapter_5.html#第五章-语义分析","chapter_6.html#第六章-代码生成"],"index":{"documentStore":{"docInfo":{"0":{"body":0,"breadcrumbs":1,"title":0},"1":{"body":1,"breadcrumbs":1,"title":0},"10":{"body":2,"breadcrumbs":2,"title":0},"11":{"body":7,"breadcrumbs":2,"title":0},"12":{"body":0,"breadcrumbs":3,"title":1},"13":{"body":0,"breadcrumbs":2,"title":1},"14":{"body":0,"breadcrumbs":2,"title":1},"15":{"body":0,"breadcrumbs":2,"title":1},"16":{"body":0,"breadcrumbs":0,"title":0},"17":{"body":0,"breadcrumbs":0,"title":0},"18":{"body":0,"breadcrumbs":0,"title":0},"19":{"body":0,"breadcrumbs":0,"title":0},"2":{"body":0,"breadcrumbs":4,"title":2},"20":{"body":0,"breadcrumbs":0,"title":0},"3":{"body":9,"breadcrumbs":3,"title":1},"4":{"body":24,"breadcrumbs":2,"title":0},"5":{"body":9,"breadcrumbs":2,"title":0},"6":{"body":8,"breadcrumbs":2,"title":0},"7":{"body":23,"breadcrumbs":2,"title":0},"8":{"body":5,"breadcrumbs":2,"title":0},"9":{"body":5,"breadcrumbs":2,"title":0}},"docs":{"0":{"body":"","breadcrumbs":"Introduction » 引言","id":"0","title":"引言"},"1":{"body":"作者 : 乐乐宝宝 电子邮件 : duhbbx@gmail.com 不知道引言写啥.... 传说计算机有三大浪漫: 操作系统, 编译原理和图形学. 我是对编译原理比较感兴趣,因为工作的原因会涉及到很多编译原理知识的运用.","breadcrumbs":"Introduction » 作者信息","id":"1","title":"作者信息"},"10":{"body":"TinyCC 是一个非常适合嵌入式开发、学习编译器工作原理、快速原型设计的轻量级 C 编译器。尽管它的优化能力和高级功能不如主流编译器，但凭借其极快的编译速度和小巧的体积，TinyCC 在某些特定场景下仍然非常有用。","breadcrumbs":"1.1 tinycc项目介绍 » 结论","id":"10","title":"结论"},"11":{"body":"项目主页 : https://bellard.org/tcc/ GitHub 仓库 : https://github.com/TinyCC/tinycc 文档 : https://bellard.org/tcc/tcc-doc.html TinyCC 是一款轻量但功能强大的 C 编译器，适合在资源有限或需要快速编译的场景中使用。","breadcrumbs":"1.1 tinycc项目介绍 » 相关链接","id":"11","title":"相关链接"},"12":{"body":"","breadcrumbs":"1.2 autoconfigure的使用 » 1.2 构建调试环境","id":"12","title":"1.2 构建调试环境"},"13":{"body":"","breadcrumbs":"1.3 构建调试环境 » 1.3 构建调试环境","id":"13","title":"1.3 构建调试环境"},"14":{"body":"","breadcrumbs":"1.4 入口代码 » 1.4 入口代码","id":"14","title":"1.4 入口代码"},"15":{"body":"","breadcrumbs":"第一章 tcc.c 主流程分析 » 第一章 tcc.c 主流程分析","id":"15","title":"第一章 tcc.c 主流程分析"},"16":{"body":"","breadcrumbs":"第二章 编译的整体流程 » 第二章 编译的整体流程","id":"16","title":"第二章 编译的整体流程"},"17":{"body":"","breadcrumbs":"第三章 词法分析 » 第三章 词法分析","id":"17","title":"第三章 词法分析"},"18":{"body":"","breadcrumbs":"第四章 语法分析 » 第四章 语法分析","id":"18","title":"第四章 语法分析"},"19":{"body":"","breadcrumbs":"第五章 语义分析 » 第五章 语义分析","id":"19","title":"第五章 语义分析"},"2":{"body":"","breadcrumbs":"1.1 tinycc项目介绍 » 1.1 TinyCC 项目介绍","id":"2","title":"1.1 TinyCC 项目介绍"},"20":{"body":"","breadcrumbs":"第六章 代码生成 » 第六章 代码生成","id":"20","title":"第六章 代码生成"},"3":{"body":"TinyCC（TCC，全称为 Tiny C Compiler） 是一个小巧且高效的 C 语言编译器，目标是提供非常快速的编译速度，同时占用极少的系统资源。由 Fabrice Bellard 开发，TinyCC 旨在为 C 语言提供一个高度便携且功能完善的编译器。","breadcrumbs":"1.1 tinycc项目介绍 » TinyCC 项目介绍","id":"3","title":"TinyCC 项目介绍"},"4":{"body":"极快的编译速度 ： TinyCC 的最大特点之一是其超快的编译速度，通常比传统的编译器如 GCC 和 Clang 快 9 倍到 10 倍。这使得它非常适合在开发、测试或嵌入式系统中使用。 极小的二进制文件 ： TinyCC 是一个极小的编译器，整个编译器的代码量非常小，并且编译生成的可执行文件非常小巧，适合资源受限的系统或嵌入式设备。 C99 标准兼容性 ： TinyCC 支持大多数 C99 标准的特性，允许开发者使用现代 C 标准进行编程。 即时编译（JIT）功能 ： TinyCC 支持即时编译（Just-In-Time Compilation），可以在运行时动态编译和执行 C 代码。这使得它适用于需要动态生成和执行代码的场景。 内存安全检查 ： TinyCC 提供可选的内存安全检查模式，可以检测一些常见的运行时错误，如数组越界访问和非法指针操作。 多平台支持 ： TinyCC 支持多种操作系统和硬件架构，包括： Linux、Windows 和 macOS x86、x86_64、ARM、ARM64、RISC-V 等架构 静态和动态库支持 ： TinyCC 支持生成静态库（.a）和动态库（.so 或 .dll），可以方便地集成到其他项目中。","breadcrumbs":"1.1 tinycc项目介绍 » 项目特点","id":"4","title":"项目特点"},"5":{"body":"完整的 C 编译器 ： 虽然 TinyCC 的代码量很小，但它是一个功能完善的 C 编译器，支持常见的 C 语言特性，如预处理器、数据类型、控制结构、函数等。 编译优化 ： 尽管 TinyCC 的目标是快速编译，但它也提供了基础的优化功能，以生成高效的代码。 内嵌汇编 ： TinyCC 支持内嵌汇编代码，允许开发者在 C 代码中直接使用汇编指令。 动态链接库支持 ： TinyCC 可以生成和链接动态库，适用于需要模块化设计的程序。 轻量级 ： TinyCC 的二进制文件非常小，编译出来的可执行文件也极其紧凑，非常适合嵌入式开发和低资源环境。","breadcrumbs":"1.1 tinycc项目介绍 » 核心功能","id":"5","title":"核心功能"},"6":{"body":"嵌入式开发 ： TinyCC 的小内存占用和生成小巧的二进制文件，使其特别适合资源受限的嵌入式设备。 教学与学习 ： TinyCC 的设计简单易懂，适合学习 C 编译器的内部工作原理，或者作为教学工具来教授编译原理和 C 语言。 快速开发与原型设计 ： TinyCC 的即时编译功能和快速的编译速度非常适合进行快速的原型设计，开发者可以快速编译和测试 C 代码。 动态代码生成 ： TinyCC 提供了 JIT 编译功能，适用于需要动态生成和执行代码的场景，如脚本引擎或游戏引擎。","breadcrumbs":"1.1 tinycc项目介绍 » 使用场景","id":"6","title":"使用场景"},"7":{"body":"TinyCC 支持在 Linux、Windows 和 macOS 等平台上运行，安装步骤如下： 获取源码 ： 可以从 TinyCC 的官方 GitHub 仓库获取源码： git clone https://github.com/TinyCC/tinycc.git 编译并安装 ： cd tinycc\n./configure\nmake\nsudo make install 使用 TinyCC 编译 C 程序 ： 编译和运行一个简单的 C 程序： tcc -o hello hello.c\n./hello","breadcrumbs":"1.1 tinycc项目介绍 » 安装与使用","id":"7","title":"安装与使用"},"8":{"body":"TinyCC 由 Fabrice Bellard 于 2001 年首次发布，目的是为了提供一个极小且快速的 C 编译器。它以其独特的即时编译功能和内存安全性检查功能著称，并且其开源的代码使得它成为学习编译器设计的绝佳案例。","breadcrumbs":"1.1 tinycc项目介绍 » 项目历史","id":"8","title":"项目历史"},"9":{"body":"优势 ： 极快的编译速度 小巧的二进制文件 支持 C99 标准 JIT 支持 多平台兼容 不足 ： 优化能力不如 GCC 或 Clang 等主流编译器 一些高级 C 语言特性支持有限 不适合大规模项目的生产环境","breadcrumbs":"1.1 tinycc项目介绍 » 项目优势和不足","id":"9","title":"项目优势和不足"}},"length":21,"save":true},"fields":["title","body","breadcrumbs"],"index":{"body":{"root":{"1":{".":{"1":{"df":1,"docs":{"2":{"tf":1.0}}},"2":{"df":1,"docs":{"12":{"tf":1.0}}},"3":{"df":1,"docs":{"13":{"tf":1.0}}},"4":{"df":1,"docs":{"14":{"tf":1.0}}},"df":0,"docs":{}},"0":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}},"2":{"0":{"0":{"1":{"df":1,"docs":{"8":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"9":{"df":1,"docs":{"4":{"tf":1.0}}},"a":{"df":0,"docs":{},"）":{"df":0,"docs":{},"和":{"df":0,"docs":{},"动":{"df":0,"docs":{},"态":{"df":0,"docs":{},"库":{"df":0,"docs":{},"（":{".":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}}}}}}}},"b":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"r":{"d":{"df":2,"docs":{"3":{"tf":1.0},"8":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"c":{"9":{"9":{"df":2,"docs":{"4":{"tf":1.4142135623730951},"9":{"tf":1.0}}},"df":0,"docs":{}},"d":{"df":1,"docs":{"7":{"tf":1.0}}},"df":9,"docs":{"10":{"tf":1.0},"11":{"tf":1.0},"3":{"tf":1.7320508075688772},"4":{"tf":1.4142135623730951},"5":{"tf":2.0},"6":{"tf":1.7320508075688772},"7":{"tf":1.4142135623730951},"8":{"tf":1.0},"9":{"tf":1.0}},"l":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":2,"docs":{"4":{"tf":1.0},"9":{"tf":1.0}}}}},"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":1,"docs":{"7":{"tf":1.0}}}}}},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":2,"docs":{"3":{"tf":1.0},"4":{"tf":1.0}}}}}},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"df":1,"docs":{"7":{"tf":1.0}}}}}}}}}},"d":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":1,"docs":{"4":{"tf":1.0}}}},"o":{"c":{".":{"df":0,"docs":{},"h":{"df":0,"docs":{},"t":{"df":0,"docs":{},"m":{"df":0,"docs":{},"l":{"df":1,"docs":{"11":{"tf":1.0}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"u":{"df":0,"docs":{},"h":{"b":{"b":{"df":0,"docs":{},"x":{"@":{"df":0,"docs":{},"g":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{".":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{},"f":{"a":{"b":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"c":{"df":2,"docs":{"3":{"tf":1.0},"8":{"tf":1.0}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"g":{"c":{"c":{"df":2,"docs":{"4":{"tf":1.0},"9":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":1,"docs":{"7":{"tf":1.0}},"h":{"df":0,"docs":{},"u":{"b":{"df":2,"docs":{"11":{"tf":1.0},"7":{"tf":1.0}}},"df":0,"docs":{}}}}}},"h":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{".":{"c":{"df":1,"docs":{"7":{"tf":1.0}}},"df":0,"docs":{}},"df":1,"docs":{"7":{"tf":1.4142135623730951}}}}}},"t":{"df":0,"docs":{},"t":{"df":0,"docs":{},"p":{"df":0,"docs":{},"s":{":":{"/":{"/":{"b":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"r":{"d":{".":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"/":{"df":0,"docs":{},"t":{"c":{"c":{"/":{"df":0,"docs":{},"t":{"c":{"c":{"df":1,"docs":{"11":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":1,"docs":{"11":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":0,"docs":{},"u":{"b":{".":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"/":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"y":{"c":{"c":{"/":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"y":{"c":{"c":{".":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":1,"docs":{"7":{"tf":1.0}}}}}},"df":1,"docs":{"11":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"7":{"tf":1.0}}}},"df":0,"docs":{}}}}},"j":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":3,"docs":{"4":{"tf":1.0},"6":{"tf":1.0},"9":{"tf":1.0}}}}},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"u":{"df":0,"docs":{},"x":{"df":0,"docs":{},"、":{"df":0,"docs":{},"w":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"d":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":2,"docs":{"4":{"tf":1.0},"7":{"tf":1.0}}}}},"df":0,"docs":{}}}}}}}}}},"m":{"a":{"c":{"df":0,"docs":{},"o":{"df":2,"docs":{"4":{"tf":1.0},"7":{"tf":1.0}}}},"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":1,"docs":{"7":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}},"o":{"df":1,"docs":{"7":{"tf":1.0}}},"s":{"df":0,"docs":{},"u":{"d":{"df":0,"docs":{},"o":{"df":1,"docs":{"7":{"tf":1.0}}}},"df":0,"docs":{}}},"t":{"c":{"c":{".":{"c":{"df":1,"docs":{"15":{"tf":1.0}}},"df":0,"docs":{}},"df":1,"docs":{"7":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":1,"docs":{"4":{"tf":1.0}}}},"n":{"df":0,"docs":{},"i":{"df":1,"docs":{"3":{"tf":1.0}}},"y":{"c":{"c":{"df":9,"docs":{"10":{"tf":1.0},"11":{"tf":1.0},"2":{"tf":1.0},"3":{"tf":1.4142135623730951},"4":{"tf":2.6457513110645907},"5":{"tf":2.23606797749979},"6":{"tf":2.0},"7":{"tf":2.0},"8":{"tf":1.0}},"（":{"df":0,"docs":{},"t":{"c":{"c":{"df":1,"docs":{"3":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"v":{"df":1,"docs":{"4":{"tf":1.0}}},"x":{"8":{"6":{"df":0,"docs":{},"、":{"df":0,"docs":{},"x":{"8":{"6":{"_":{"6":{"4":{"df":0,"docs":{},"、":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"m":{"df":0,"docs":{},"、":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"m":{"6":{"4":{"df":0,"docs":{},"、":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"c":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"breadcrumbs":{"root":{"1":{".":{"1":{"df":10,"docs":{"10":{"tf":1.0},"11":{"tf":1.0},"2":{"tf":1.7320508075688772},"3":{"tf":1.0},"4":{"tf":1.0},"5":{"tf":1.0},"6":{"tf":1.0},"7":{"tf":1.0},"8":{"tf":1.0},"9":{"tf":1.0}}},"2":{"df":1,"docs":{"12":{"tf":1.7320508075688772}}},"3":{"df":1,"docs":{"13":{"tf":1.7320508075688772}}},"4":{"df":1,"docs":{"14":{"tf":1.7320508075688772}}},"df":0,"docs":{}},"0":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}},"2":{"0":{"0":{"1":{"df":1,"docs":{"8":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"9":{"df":1,"docs":{"4":{"tf":1.0}}},"a":{"df":0,"docs":{},"u":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"df":1,"docs":{"12":{"tf":1.0}}}}}}}}}},"df":0,"docs":{}}}},"）":{"df":0,"docs":{},"和":{"df":0,"docs":{},"动":{"df":0,"docs":{},"态":{"df":0,"docs":{},"库":{"df":0,"docs":{},"（":{".":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}}}}}}}},"b":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"r":{"d":{"df":2,"docs":{"3":{"tf":1.0},"8":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"c":{"9":{"9":{"df":2,"docs":{"4":{"tf":1.4142135623730951},"9":{"tf":1.0}}},"df":0,"docs":{}},"d":{"df":1,"docs":{"7":{"tf":1.0}}},"df":9,"docs":{"10":{"tf":1.0},"11":{"tf":1.0},"3":{"tf":1.7320508075688772},"4":{"tf":1.4142135623730951},"5":{"tf":2.0},"6":{"tf":1.7320508075688772},"7":{"tf":1.4142135623730951},"8":{"tf":1.0},"9":{"tf":1.0}},"l":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":2,"docs":{"4":{"tf":1.0},"9":{"tf":1.0}}}}},"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":1,"docs":{"7":{"tf":1.0}}}}}},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":2,"docs":{"3":{"tf":1.0},"4":{"tf":1.0}}}}}},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"df":1,"docs":{"7":{"tf":1.0}}}}}}}}}},"d":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":1,"docs":{"4":{"tf":1.0}}}},"o":{"c":{".":{"df":0,"docs":{},"h":{"df":0,"docs":{},"t":{"df":0,"docs":{},"m":{"df":0,"docs":{},"l":{"df":1,"docs":{"11":{"tf":1.0}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"u":{"df":0,"docs":{},"h":{"b":{"b":{"df":0,"docs":{},"x":{"@":{"df":0,"docs":{},"g":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{".":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{},"f":{"a":{"b":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"c":{"df":2,"docs":{"3":{"tf":1.0},"8":{"tf":1.0}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"g":{"c":{"c":{"df":2,"docs":{"4":{"tf":1.0},"9":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":1,"docs":{"7":{"tf":1.0}},"h":{"df":0,"docs":{},"u":{"b":{"df":2,"docs":{"11":{"tf":1.0},"7":{"tf":1.0}}},"df":0,"docs":{}}}}}},"h":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{".":{"c":{"df":1,"docs":{"7":{"tf":1.0}}},"df":0,"docs":{}},"df":1,"docs":{"7":{"tf":1.4142135623730951}}}}}},"t":{"df":0,"docs":{},"t":{"df":0,"docs":{},"p":{"df":0,"docs":{},"s":{":":{"/":{"/":{"b":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"r":{"d":{".":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"/":{"df":0,"docs":{},"t":{"c":{"c":{"/":{"df":0,"docs":{},"t":{"c":{"c":{"df":1,"docs":{"11":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":1,"docs":{"11":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"df":0,"docs":{},"u":{"b":{".":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"/":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"y":{"c":{"c":{"/":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"y":{"c":{"c":{".":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":1,"docs":{"7":{"tf":1.0}}}}}},"df":1,"docs":{"11":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"7":{"tf":1.0}}}},"df":0,"docs":{}}},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"d":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":2,"docs":{"0":{"tf":1.0},"1":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}},"j":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":3,"docs":{"4":{"tf":1.0},"6":{"tf":1.0},"9":{"tf":1.0}}}}},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"u":{"df":0,"docs":{},"x":{"df":0,"docs":{},"、":{"df":0,"docs":{},"w":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"d":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":2,"docs":{"4":{"tf":1.0},"7":{"tf":1.0}}}}},"df":0,"docs":{}}}}}}}}}},"m":{"a":{"c":{"df":0,"docs":{},"o":{"df":2,"docs":{"4":{"tf":1.0},"7":{"tf":1.0}}}},"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":1,"docs":{"7":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}},"o":{"df":1,"docs":{"7":{"tf":1.0}}},"s":{"df":0,"docs":{},"u":{"d":{"df":0,"docs":{},"o":{"df":1,"docs":{"7":{"tf":1.0}}}},"df":0,"docs":{}}},"t":{"c":{"c":{".":{"c":{"df":1,"docs":{"15":{"tf":1.7320508075688772}}},"df":0,"docs":{}},"df":1,"docs":{"7":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":1,"docs":{"4":{"tf":1.0}}}},"n":{"df":0,"docs":{},"i":{"df":1,"docs":{"3":{"tf":1.0}}},"y":{"c":{"c":{"df":10,"docs":{"10":{"tf":1.4142135623730951},"11":{"tf":1.4142135623730951},"2":{"tf":1.7320508075688772},"3":{"tf":2.0},"4":{"tf":2.8284271247461903},"5":{"tf":2.449489742783178},"6":{"tf":2.23606797749979},"7":{"tf":2.23606797749979},"8":{"tf":1.4142135623730951},"9":{"tf":1.0}},"（":{"df":0,"docs":{},"t":{"c":{"c":{"df":1,"docs":{"3":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"v":{"df":1,"docs":{"4":{"tf":1.0}}},"x":{"8":{"6":{"df":0,"docs":{},"、":{"df":0,"docs":{},"x":{"8":{"6":{"_":{"6":{"4":{"df":0,"docs":{},"、":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"m":{"df":0,"docs":{},"、":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"m":{"6":{"4":{"df":0,"docs":{},"、":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"c":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"title":{"root":{"1":{".":{"1":{"df":1,"docs":{"2":{"tf":1.0}}},"2":{"df":1,"docs":{"12":{"tf":1.0}}},"3":{"df":1,"docs":{"13":{"tf":1.0}}},"4":{"df":1,"docs":{"14":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{},"t":{"c":{"c":{".":{"c":{"df":1,"docs":{"15":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"y":{"c":{"c":{"df":2,"docs":{"2":{"tf":1.0},"3":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}},"lang":"English","pipeline":["trimmer","stopWordFilter","stemmer"],"ref":"id","version":"0.9.5"},"results_options":{"limit_results":30,"teaser_word_count":30},"search_options":{"bool":"OR","expand":true,"fields":{"body":{"boost":1},"breadcrumbs":{"boost":1},"title":{"boost":2}}}});