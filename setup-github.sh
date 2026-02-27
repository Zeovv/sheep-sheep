#!/bin/bash

# GitHub仓库设置脚本
# 使用方法：
# 1. 修改下面的变量
# 2. 在终端运行: bash setup-github.sh

# ========== 请修改以下变量 ==========
GITHUB_USERNAME="Zeovv"
GITHUB_REPO_NAME="sheep-sheep"
GITHUB_TOKEN="你的GitHub个人访问令牌（请勿提交到代码库）"
# ===================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== GitHub仓库设置脚本 ===${NC}"
echo ""

# 检查变量是否已设置
if [ "$GITHUB_USERNAME" = "你的GitHub用户名" ] || [ "$GITHUB_REPO_NAME" = "仓库名称，如ylgy-game" ] || [ "$GITHUB_TOKEN" = "你的GitHub个人访问令牌" ]; then
    echo -e "${RED}错误：请先编辑此脚本，设置正确的变量值${NC}"
    echo "需要设置的变量："
    echo "1. GITHUB_USERNAME: 你的GitHub用户名"
    echo "2. GITHUB_REPO_NAME: 仓库名称"
    echo "3. GITHUB_TOKEN: GitHub个人访问令牌"
    echo ""
    echo "获取令牌步骤："
    echo "1. 访问 https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token' → 'Generate new token (classic)'"
    echo "3. 设置 Note: 'ylgy-game-deploy'，勾选 'repo' 权限"
    echo "4. 生成后复制令牌（只显示一次）"
    exit 1
fi

# 检查git是否已安装
if ! command -v git &> /dev/null; then
    echo -e "${RED}错误：未找到git，请先安装git${NC}"
    exit 1
fi

# 检查当前目录是否是git仓库
if [ ! -d ".git" ]; then
    echo -e "${RED}错误：当前目录不是git仓库${NC}"
    echo "请先运行: git init"
    exit 1
fi

echo -e "${GREEN}步骤1: 配置git用户信息${NC}"
read -p "请输入您的GitHub邮箱地址: " user_email
git config user.name "$GITHUB_USERNAME"
git config user.email "$user_email"

echo -e "${GREEN}步骤2: 添加远程仓库${NC}"
REPO_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}.git"

# 移除现有的远程仓库（如果存在）
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

echo -e "${GREEN}步骤3: 推送代码到GitHub${NC}"
echo "仓库URL: https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}"

# 尝试推送
if git push -u origin master; then
    echo -e "${GREEN}✅ 代码推送成功！${NC}"
    echo ""
    echo -e "${YELLOW}下一步：${NC}"
    echo "1. 访问 https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME} 确认代码已上传"
    echo "2. 注册 Vercel (https://vercel.com)"
    echo "3. 导入GitHub仓库进行部署"
    echo "4. 详细步骤请查看 DEPLOYMENT_GUIDE.md"
else
    echo -e "${RED}❌ 推送失败，请检查：${NC}"
    echo "1. 令牌是否有 repo 权限"
    echo "2. 仓库名称是否正确"
    echo "3. 网络连接是否正常"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 设置完成！${NC}"