# 羊了个羊游戏部署指南

本文档提供将游戏部署到GitHub、Vercel和配置域名的完整步骤。

## 目录
1. [GitHub仓库创建与代码推送](#1-github仓库创建与代码推送)
2. [Vercel前端部署](#2-vercel前端部署)
3. [腾讯云域名购买与配置](#3-腾讯云域名购买与配置)
4. [自定义域名绑定到Vercel](#4-自定义域名绑定到vercel)
5. [后续维护与更新](#5-后续维护与更新)

---

## 1. GitHub仓库创建与代码推送

### 1.1 创建GitHub账号（如果还没有）
访问 [GitHub官网](https://github.com) 注册账号

### 1.2 创建新仓库
1. 登录GitHub，点击右上角"+" → "New repository"
2. 填写仓库信息：
   - **Repository name**: `ylgy-game` (或您喜欢的名称)
   - **Description**: "类《羊了个羊》堆叠式三消H5游戏"
   - **Public** (公开) 或 **Private** (私有)
   - **不要**勾选"Initialize this repository with a README"
3. 点击"Create repository"

### 1.3 获取GitHub访问令牌
1. 点击GitHub右上角头像 → "Settings"
2. 左侧菜单选择"Developer settings" → "Personal access tokens" → "Tokens (classic)"
3. 点击"Generate new token" → "Generate new token (classic)"
4. 填写信息：
   - **Note**: `ylgy-game-deploy`
   - **Expiration**: 建议90天或更长时间
   - **Select scopes**: 勾选 `repo` (全部权限)
5. 点击"Generate token"，**复制生成的令牌**（只显示一次）

### 1.4 配置本地git并推送代码

打开命令行工具（Windows PowerShell或CMD），执行以下命令：

```bash
# 进入项目目录
cd /d/Sustech/agent/ylgy

# 配置git用户信息（使用您的GitHub信息）
git config --global user.name "您的GitHub用户名"
git config --global user.email "您的GitHub邮箱"

# 添加远程仓库（替换YOUR_USERNAME和YOUR_REPO）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送代码到GitHub
git push -u origin master
```

系统会提示输入用户名和密码：
- **用户名**: 您的GitHub用户名
- **密码**: 使用刚才生成的访问令牌（不是GitHub登录密码）

### 1.5 验证推送成功
访问 `https://github.com/YOUR_USERNAME/YOUR_REPO` 查看代码是否已上传。

---

## 2. Vercel前端部署

### 2.1 注册Vercel账号
1. 访问 [Vercel官网](https://vercel.com)
2. 点击"Sign Up"，使用GitHub账号登录（推荐）

### 2.2 部署项目
1. 登录Vercel后，点击"Add New..." → "Project"
2. 选择您刚刚创建的GitHub仓库
3. 配置项目：
   - **Project Name**: `ylgy-game` (自动生成)
   - **Framework Preset**: Vite会自动检测
   - **Root Directory**: 保持默认
   - **Build Command**: `npm run build` (Vite默认)
   - **Output Directory**: `dist` (Vite默认)
4. 点击"Deploy"

### 2.3 等待部署完成
Vercel会自动：
- 从GitHub拉取代码
- 安装依赖 (`npm install`)
- 构建项目 (`npm run build`)
- 部署到全球CDN

部署完成后，您会获得一个免费域名：`https://ylgy-game.vercel.app`

### 2.4 测试部署
访问提供的Vercel域名，确认游戏正常运行。

---

## 3. 腾讯云域名购买与配置

### 3.1 注册腾讯云账号
1. 访问 [腾讯云官网](https://cloud.tencent.com)
2. 注册账号并完成实名认证

### 3.2 购买域名
1. 进入"域名注册"页面
2. 搜索您想要的域名，例如：
   - `yanglegeyang.com`
   - `ylgy-game.com`
   - `sheep-game.cn`
3. 选择合适的域名并购买
4. 完成支付流程

### 3.3 域名实名认证（国内域名需要）
1. 在腾讯云控制台提交域名实名认证资料
2. 等待审核通过（通常1-3个工作日）

---

## 4. 自定义域名绑定到Vercel

### 4.1 在Vercel添加自定义域名
1. 登录Vercel，进入项目仪表板
2. 点击"Settings" → "Domains"
3. 在输入框中输入您购买的域名（如 `ylgy-game.com`）
4. 点击"Add"

### 4.2 配置DNS解析
Vercel会显示需要配置的DNS记录，例如：
```
类型   名称       值
A      @         76.76.21.21
CNAME  www       cname.vercel-dns.com
```

在腾讯云配置DNS：
1. 进入腾讯云控制台 → "云解析DNS"
2. 选择您的域名
3. 点击"添加记录"，按照Vercel提供的信息添加：
   - **记录类型**: A
   - **主机记录**: @
   - **记录值**: 76.76.21.21 (Vercel提供的IP)
   - **TTL**: 600
4. 同样方式添加CNAME记录（如果有www子域名）

### 4.3 等待DNS生效
DNS变更通常需要几分钟到几小时生效。可以使用以下命令检查：
```bash
nslookup your-domain.com
```

### 4.4 启用HTTPS
Vercel会自动为自定义域名配置SSL证书（Let's Encrypt），通常需要几分钟生效。

---

## 5. 后续维护与更新

### 5.1 代码更新流程
```bash
# 本地修改代码后
git add .
git commit -m "更新描述"
git push origin master

# Vercel会自动检测GitHub仓库变化并重新部署
```

### 5.2 查看部署状态
- **Vercel仪表板**: 查看构建日志、部署状态
- **GitHub Actions**: Vercel会自动创建部署钩子

### 5.3 监控与统计
- **Vercel Analytics**: 查看网站访问统计
- **Google Analytics**: 可集成到项目中跟踪用户行为

### 5.4 常见问题

#### Q: 构建失败怎么办？
A: 检查Vercel构建日志，常见问题：
- 依赖安装失败：检查`package.json`是否有效
- 内存不足：Vercel免费计划有内存限制
- 构建超时：优化构建配置

#### Q: 域名无法访问？
A: 检查步骤：
1. DNS解析是否生效（使用nslookup）
2. Vercel域名配置是否正确
3. 域名是否已实名认证（国内域名）

#### Q: 如何备份数据？
A: 游戏是纯前端的，唯一需要备份的是代码，已在GitHub保存。

---

## 项目技术栈说明

### 前端
- **框架**: React 18 + Vite
- **样式**: Tailwind CSS 3.4.1
- **部署**: Vercel (全球CDN)

### 构建配置
项目已配置好Vercel所需的构建设置：
- `package.json` 包含正确的scripts
- `vite.config.js` 已优化构建配置
- 已排除不必要的文件（通过.gitignore）

### 性能优化
- 代码分割：Vite自动优化
- 图片优化：使用SVG/Emoji，无需额外优化
- 缓存策略：Vercel自动配置

---

## 联系方式与支持

如果在部署过程中遇到问题：

1. **Vercel官方文档**: https://vercel.com/docs
2. **腾讯云帮助中心**: https://cloud.tencent.com/document/product
3. **GitHub Issues**: 在仓库中创建Issue

**注意**: 本指南基于当前技术栈编写，如果服务商界面更新，请参考最新官方文档。

---

## 附录：快速命令参考

```bash
# Git操作
git status                          # 查看状态
git add .                           # 添加所有文件
git commit -m "描述"                # 提交更改
git push origin master              # 推送到GitHub

# 本地开发
npm run dev                         # 启动开发服务器
npm run build                       # 构建生产版本
npm run preview                     # 预览构建结果

# 网络诊断
nslookup your-domain.com           # 检查DNS解析
ping your-domain.com               # 检查网络连通性
curl -I https://your-domain.com    # 检查HTTP头信息
```

---

祝您部署顺利！ 🎮🚀