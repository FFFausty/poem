#!/bin/bash

# Supabase 数据库部署脚本
# 用于部署诗词赏析网站的数据库结构

echo "🚀 开始部署 Supabase 数据库..."

# 检查是否已安装 Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI 未安装，请先安装: npm install -g supabase"
    exit 1
fi

# 检查是否已登录
if ! supabase projects list &> /dev/null; then
    echo "❌ 请先登录 Supabase: supabase login"
    exit 1
fi

# 设置项目ID（替换为你的项目ID）
PROJECT_ID="gmpifcojnkhfypdwmoxt"

echo "📋 项目ID: $PROJECT_ID"

# 应用数据库迁移
echo "📦 应用数据库迁移..."
supabase db push --project-ref $PROJECT_ID

# 检查迁移是否成功
if [ $? -eq 0 ]; then
    echo "✅ 数据库迁移成功"
else
    echo "❌ 数据库迁移失败"
    exit 1
fi

# 插入种子数据
echo "🌱 插入种子数据..."
supabase db push --project-ref $PROJECT_ID --data-only

if [ $? -eq 0 ]; then
    echo "✅ 种子数据插入成功"
else
    echo "❌ 种子数据插入失败"
    exit 1
fi

echo "🎉 数据库部署完成！"
echo ""
echo "📊 数据库信息:"
echo "   - 项目ID: $PROJECT_ID"
echo "   - 数据库URL: https://$PROJECT_ID.supabase.co"
echo "   - 表结构: poems, profiles, favorites, likes, comments"
echo ""
echo "🔗 前端配置:"
echo "   请确保前端应用的 .env 文件包含正确的 Supabase URL 和密钥"