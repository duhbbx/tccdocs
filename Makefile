# 定义变量
BOOK_DIR = docs
SRC_DIR = src

# 检查文件修改，并构建书籍
all: check_changes

# 如果 src 中有文件更新或 Makefile 更新，执行构建
check_changes: $(SRC_DIR)/*.md Makefile
	@echo "统计所有 Markdown 文件的字数..."
	@python3 ./count_words_and_characters.py
	@echo "检查文件修改..."
	@mdbook build
	@echo "书籍构建完成！"

	# 提交并推送到远程仓库
	@echo "提交并推送更改到远程仓库..."
	@git add . && git commit -m "Update book content" && git push origin gh-pages

	@echo "操作完成！"

# 清理构建输出
clean:
	@echo "清理书籍构建输出..."
	@rm -rf $(BOOK_DIR)

# 强制重新构建
rebuild: clean all


# 添加字数统计目标
wordcount:
	@echo "统计所有 Markdown 文件的字数..."
	@python3 ./count_words_and_characters.py