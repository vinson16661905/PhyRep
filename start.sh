#!/bin/bash

# 配置服务器 IP (如果需要从外部访问，请修改此处为服务器的真实 IP)
# 默认为用户提供的 IP，如果环境变化请修改这里
HOST_IP="10.129.240.197"

# 设置前端连接后端的 API 地址
# 为了确保 Vite 能正确读取，我们将变量写入 frontend/.env 文件
echo "Generating frontend/.env..."
echo "VITE_API_BASE_URL=http://${HOST_IP}:8000" > frontend/.env

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 1. 启动后端 (Start Backend)
echo "Starting Backend..."
cd backend

# 尝试激活虚拟环境 (如果存在)
# 优先使用 backend 目录下的 .venv，其次是项目根目录的 .venv
PYTHON_CMD="python3"
if [ -d ".venv" ]; then
    PYTHON_CMD=".venv/bin/python"
elif [ -d "../.venv" ]; then
    PYTHON_CMD="../.venv/bin/python"
fi

echo "Using Python: $PYTHON_CMD"

# 检查 uvicorn 是否安装
$PYTHON_CMD -c "import uvicorn" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Error: 'uvicorn' module not found in $PYTHON_CMD."
    echo "Please ensure you have installed dependencies on the server:"
    echo "  cd backend && $PYTHON_CMD -m pip install -e ."
    exit 1
fi

# 后台运行 uvicorn
# 使用 python -m uvicorn 启动，比直接调用 uvicorn 命令更稳健
nohup $PYTHON_CMD -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
echo "Backend started (Log: backend.log)"

# 2. 启动前端 (Start Frontend)
echo "Starting Frontend..."
cd ../frontend

# 后台运行 npm run dev
# -- --host 确保 vite 监听外部 IP
nohup npm run dev -- --host > ../frontend.log 2>&1 &
echo "Frontend started (Log: frontend.log)"

echo "=================================================="
echo "Services are running in the background."
echo "You can close the terminal now."
echo "=================================================="
