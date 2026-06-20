# PhyRep

PhyRep 是一个帮助学生编写普物实验报告的全栈工具。
它提供一个可拖拽的报告画布，支持文本、表格、公式、图片和数据处理块，并能把当前报告导出为 LaTeX 源码。

## 功能

- 右侧/左侧画布式编辑实验报告
- 支持块类型
  - 文本
  - 表格
  - 公式
  - 图片
  - 数据处理
- 报告元数据编辑
  - 实验名称
  - 学生姓名
  - 学号
  - 日期
- 数据分析与不确定度计算
  - 单组数据不确定度
  - 逐差法
  - 最小二乘拟合
  - 一般传播律不确定度
  - 对数法不确定度
- 导出 LaTeX 源码并复制到剪贴板
- 内置不确定度计算器（浮窗形式，在右下角打开）

![20260620072623](https://raw.githubusercontent.com/vinson16661905/PicGo/main/cs101/20260620072623.png)

![20260620072846](https://raw.githubusercontent.com/vinson16661905/PicGo/main/cs101/20260620072846.png)

![20260620080611](https://raw.githubusercontent.com/vinson16661905/PicGo/main/cs101/20260620080611.png)

## 项目结构

- `backend/` FastAPI 后端，负责数据处理和 LaTeX 渲染
- `frontend/` Vite + React + TypeScript 前端，负责画布编辑与导出
- `start.sh` 一键启动前后端的 Bash 脚本
- `stop.sh` 停止后台服务的 Bash 脚本

## 技术栈

- 前端: React, TypeScript, Vite, Zustand, TanStack Query, dnd-kit, Axios
- 后端: FastAPI, Pydantic, NumPy, SymPy, Jinja2, Uvicorn

## 快速开始

### 1. 启动后端

```bash
cd backend
pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

默认前端地址通常是 `http://localhost:5173`。

### 3. 使用方式

1. 在左侧模块区添加需要的块。
2. 在画布中拖拽排序、编辑内容。
3. 填写报告元数据。
4. 点击导出按钮生成 `.tex` 源码。

## 一键启动脚本

如果在类 Unix 环境下运行，可以使用根目录脚本：

```bash
bash start.sh
```

注意：

- `start.sh` 会写入 `frontend/.env`
- 脚本里的 `HOST_IP` 目前是硬编码的，部署到别的机器前请先修改
- `stop.sh` 会结束 `uvicorn` 和 `vite` 进程

```bash
bash stop.sh
```

## 后端接口

### `GET /health`

健康检查，返回：

```json
{ "status": "ok" }
```

### `POST /generate-tex`

输入报告结构，返回 LaTeX 源码。

请求体包含：

- `meta`: 报告元数据
- `blocks`: 报告块数组

### `POST /calculate/uncertainty`

用于前端不确定度计算器的辅助接口。

请求体包含：

- `expression`: SymPy 形式表达式
- `variables`: 变量列表，每项包含 `name`、`value`、`uncertainty`

## 数据块说明

### 文本块

支持标题和正文内容。

### 表格块

支持表头、数据行，以及三类分析：

- 单变量不确定度
- 逐差法
- 最小二乘法

### 公式块

直接填写 LaTeX 公式源码。

### 图片块

填写图片地址和显示宽度。

### 数据处理块

支持：

- 通用传播律
- 对数法

## 环境变量

### 后端

- `PHYREP_ALLOWED_ORIGINS` 逗号分隔的 CORS 来源列表，默认 `*`
- `PHYREP_TEMPLATE_NAME` 需要使用的模板文件名，默认 `report_template.tex`

### 前端

- `VITE_API_BASE_URL` 后端地址，默认 `http://localhost:8000`

## 开发说明

前端源码位于 `frontend/src/`，主要入口如下：

- `frontend/src/App.tsx` 应用布局
- `frontend/src/store/useCanvasStore.ts` 画布状态管理
- `frontend/src/components/` 各种编辑面板和块编辑器
- `frontend/src/services/api.ts` 后端请求封装

后端源码位于 `backend/app/`，主要入口如下：

- `backend/app/main.py` FastAPI 路由
- `backend/app/services/processing.py` 数据处理
- `backend/app/services/latex_renderer.py` LaTeX 渲染
- `backend/app/templates/report_template.tex` LaTeX 模板

## 说明

当前项目的目标是帮助学生快速搭建普物实验报告的内容骨架，并自动完成常见数据处理与导出流程。
