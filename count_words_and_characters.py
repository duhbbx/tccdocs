import os
import re

def count_words_and_characters_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        text = file.read()

        # 统计英文单词数量
        english_words = re.findall(r'\b[a-zA-Z]+\b', text)
        english_word_count = len(english_words)

        # 统计中文汉字数量
        chinese_chars = re.findall(r'[\u4e00-\u9fff]', text)
        chinese_char_count = len(chinese_chars)

        return english_word_count, chinese_char_count

def count_in_directory(directory):
    total_english_words = 0
    total_chinese_chars = 0

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                english_words, chinese_chars = count_words_and_characters_in_file(filepath)
                print(f"{file}: {english_words} 英文单词, {chinese_chars} 汉字字符")
                total_english_words += english_words
                total_chinese_chars += chinese_chars

    return total_english_words, total_chinese_chars

if __name__ == "__main__":
    directory = 'src'  # 指定 mdBook 的源目录
    total_english_words, total_chinese_chars = count_in_directory(directory)
    print(f"\n总英文单词数: {total_english_words}")
    print(f"总汉字字符数: {total_chinese_chars}")
