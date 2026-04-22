[console]::InputEncoding = [System.Text.Encoding]::UTF8
[console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8


# ===== Gemini + Node 代理启动脚本 =====

# 1. 配置参数
$proxy = "http://127.0.0.1:10808"
$nodePath = "C:\Program Files\nodejs\node.exe"
# 建议将你的 API Key 设置在这里，或者在系统变量中预设
$env:GOOGLE_API_KEY = "你的_GEMINI_API_KEY_HERE" 

# 2. 设置当前会话代理
$env:HTTP_PROXY  = $proxy
$env:HTTPS_PROXY = $proxy
$env:http_proxy  = $proxy
$env:https_proxy = $proxy

Write-Host "--- 代理环境已就绪 ---" -ForegroundColor Green
Write-Host "当前代理: $proxy"

# 3. 检查 Node 是否存在
if (-not (Test-Path $nodePath)) {
    Write-Host "错误: 未找到 node.exe，路径为: $nodePath" -ForegroundColor Red
    exit 1
}

# 4. 验证 Node 环境
Write-Host "Node 路径: $nodePath" -ForegroundColor Cyan
& $nodePath -e "console.log('Node 代理检查: ' + (process.env.HTTP_PROXY ? '已连接' : '未连接'))"

# 5. 切换到项目目录
cd C:\antigravity\leadcue

# 6. 启动 Gemini CLI
# 注意：这里假设你使用的是常用的 gemini-chat-cli 或类似的 npm 包
# 如果你使用的是特定的命令（如 'gemini'），直接替换下方单词即可
Write-Host "正在通过代理启动 Gemini CLI..." -ForegroundColor Yellow

# 执行启动命令
# 如果是通过 npm 全局安装的，直接运行 gemini
# 如果是本地项目，可以使用 npx gemini
gemini