@echo off
echo ========================================
echo   诗韵雅集AI助手启动脚本
echo ========================================
echo.

echo [1/3] 检查Node.js环境...
node --version
if errorlevel 1 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)

echo [2/3] 启动前端应用...
cd /d %~dp0
start cmd /k "npm run dev"
echo ✅ 前端应用启动中（端口3000）...

echo [3/3] 启动n8n工作流服务...
echo   请在新窗口中运行以下命令：
echo   docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
echo.
echo   或者使用npm安装n8n后运行：
echo   n8n start
echo.

echo ========================================
echo   启动完成！
echo ========================================
echo 前端应用：http://localhost:3000
echo n8n管理界面：http://localhost:5678
echo AI助手Webhook：http://localhost:5678/webhook/ai-assistant
echo.
pause