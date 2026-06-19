#!/bin/bash

echo "Stopping services..."

# 杀掉 uvicorn 进程
pkill -f "uvicorn app.main:app"

# 杀掉 vite 进程 (注意：这可能会杀掉服务器上其他 vite 进程，如果只有这一个项目则没问题)
pkill -f "vite"

echo "Services stopped."
