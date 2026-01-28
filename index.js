#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 显示帮助信息
function showHelp() {
  console.log(`
📊 Markdown 字数统计工具

用法:
  node index.js <文件路径>
  ./index.js <文件路径>

示例:
  node index.js ./article.md

输出:
  - 总字符数
  - 中文字数
  - 英文单词数
`);
}

// 统计函数
function countStats(text) {
  // 总字符数（去除空白）
  const totalChars = text.replace(/\s/g, '').length;
  
  // 中文字符数（匹配 Unicode 中文字符）
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // 英文单词数（匹配英文字母组成的单词）
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  
  return {
    totalChars,
    chineseChars,
    englishWords
  };
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  
  // 检查参数
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  const filePath = args[0];
  
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 错误：文件不存在 - ${filePath}`);
    process.exit(1);
  }
  
  // 检查是否为 .md 文件
  if (!filePath.endsWith('.md')) {
    console.warn(`⚠️  警告：文件不是 .md 格式`);
  }
  
  // 读取文件
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`❌ 错误：无法读取文件 - ${error.message}`);
    process.exit(1);
  }
  
  // 统计
  const stats = countStats(content);
  
  // 获取文件信息
  const stats_fs = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  
  // 输出结果
  console.log(`\n📄 文件：${fileName}`);
  console.log(`📏 文件大小：${(stats_fs.size / 1024).toFixed(2)} KB`);
  console.log(`\n📊 统计结果：`);
  console.log(`  ├─ 总字符数：    ${stats.totalChars.toLocaleString()} 个`);
  console.log(`  ├─ 中文字数：    ${stats.chineseChars.toLocaleString()} 个`);
  console.log(`  └─ 英文单词数：  ${stats.englishWords.toLocaleString()} 个`);
  console.log();
}

main();
