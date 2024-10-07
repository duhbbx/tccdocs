

# 命令

```bash
 1019  ls
 1020  cd tiny-source-code-analysis
 1021  cd book
 1022  ls
 1023  cd ..
 1024  ls
 1025  cp -r book/* ../tiny-source-code-analysis.github.io
 1026  cd ..
 1027  ls
 1028  cd tiny-source-code-analysis.github.io
 1029  git add .\ngit commit -m "Publish mdbook to GitHub Pages"\ngit push origin main
 1030  git branch 
 1031  git status 
 1032  git remote show origin\n
 1033  git pull 
 1034  git push 
 ```


# 构建

要创建一个 `mdbook` 项目并将其发布到 GitHub Pages（即 `github.io`），你可以按照以下步骤进行操作。

### 步骤 1: 安装 `mdbook`

首先，你需要安装 `mdbook`，它是一个 Rust 工具，用于将 Markdown 文件编译成一个静态网站。

#### 通过 Rust 安装 `mdbook`：
```bash
cargo install mdbook
```

确保安装成功后，你可以通过以下命令检查：
```bash
mdbook --version
```

### 步骤 2: 创建一个新项目

使用 `mdbook` 创建一个新项目：

```bash
mdbook init mybook
```

这将生成一个名为 `mybook` 的目录，并在该目录中生成 `book.toml` 配置文件和示例的 `src` 文件夹。

### 步骤 3: 编辑书籍内容

进入项目目录：
```bash
cd mybook
```

在 `src` 文件夹中，你会看到 `SUMMARY.md` 文件，这是书籍的目录结构文件。你可以编辑它来组织章节。

- **`src/SUMMARY.md`** 是主目录文件，用于定义章节的层次结构。
- 其他 `.md` 文件是你书的实际内容，可以根据需要添加或修改。

例如，`SUMMARY.md` 的结构可能是这样的：
```markdown
# Summary

[Introduction](./introduction.md)
- [Chapter 1](./chapter_1.md)
- [Chapter 2](./chapter_2.md)
```

然后你可以编辑 `introduction.md` 和 `chapter_1.md` 等文件，填写你要发布的内容。

### 步骤 4: 编译书籍

在项目目录中运行以下命令编译书籍：
```bash
mdbook build
```

这将生成一个 `_book` 文件夹，里面是编译好的静态网站，包含 HTML 文件等。

### 步骤 5: 创建 GitHub Pages 仓库

1. **创建 GitHub 仓库**：
   - 访问 [GitHub](https://github.com) 并创建一个新的仓库，命名为 `username.github.io`，其中 `username` 是你的 GitHub 用户名。这个仓库将用于 GitHub Pages。

2. **克隆仓库**：
   在本地克隆你刚刚创建的仓库：

   ```bash
   git clone https://github.com/username/username.github.io
   ```

### 步骤 6: 将 `mdbook` 发布到 GitHub Pages

1. **拷贝编译后的书籍内容**：
   - 进入你之前创建的 `mybook` 目录，将 `_book` 文件夹中的内容拷贝到你克隆的 GitHub 仓库目录中：

   ```bash
   cp -r mybook/_book/* username.github.io/
   ```

2. **提交并推送到 GitHub**：
   在 `username.github.io` 仓库目录中，提交更改并推送到 GitHub：

   ```bash
   cd username.github.io
   git add .
   git commit -m "Publish mdbook to GitHub Pages"
   git push origin main
   ```

### 步骤 7: 配置 GitHub Pages

1. **进入 GitHub 仓库设置**：
   - 打开你的 `username.github.io` 仓库，点击 "Settings"。
   - 在左侧菜单中找到 "Pages" 选项。
   - 选择 `main` 分支并确保文件根目录（`/root`）为发布源。

2. **等待部署完成**：
   - GitHub Pages 会自动部署你的站点。大约几分钟后，你可以访问 `https://username.github.io`，查看你刚刚发布的 `mdbook`。

### 步骤 8: 持续更新

每次你更新 `mdbook` 并重新编译后，重复步骤 6 的拷贝、提交和推送步骤，将最新内容发布到 GitHub Pages。

---

### 总结

1. **安装 `mdbook`**：通过 `cargo` 安装。
2. **创建项目**：使用 `mdbook init` 初始化项目，编辑 `src` 目录中的内容。
3. **编译项目**：运行 `mdbook build`。
4. **创建 GitHub Pages 仓库**：使用 GitHub 创建 `username.github.io` 仓库。
5. **发布书籍**：将编译后的 `_book` 文件夹中的内容复制到 GitHub 仓库，提交并推送。
6. **配置 GitHub Pages**：通过仓库设置激活 GitHub Pages。
7. **访问书籍**：访问 `https://username.github.io` 查看发布的内容。

这样，你就可以成功发布 `mdbook` 到 GitHub Pages 并进行持续更新。

