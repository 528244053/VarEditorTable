# 变量表格编辑器

基于 Modern.js + React + TypeScript 开发的变量表格编辑器，实现变量增删改查基础能力。

## 一、项目环境依赖

### 技术栈
- **框架**: Modern.js 3.x + React
- **语言**: TypeScript
- **UI组件库**: Arco Design
- **状态管理**: Zustand + Immer
- **样式**: LESS
- **构建工具**: Rsbuild

### 核心依赖版本
```json
{
  "@arco-design/web-react": "^2.66.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "zustand": "^4.5.2",
  "immer": "^10.0.3"
}
```

## 二、安装与运行
### 必要环境
node >= 22.0.0
pnpm 依赖包管理器

### 安装依赖
```bash
pnpm install
```

### 本地开发
```bash
pnpm dev
```
访问: http://localhost:8080/VarEditorTablePage

### 构建生产版本
```bash
pnpm build
```

## 三、项目目录结构

```
src/
├── components/                    # 组件目录
│   └── VarEditorTable/           # 变量表格编辑器核心组件
│       ├── components/           # 子组件
│       │   ├── EditorCell.tsx    # 通用编辑器单元格组件
│       │   ├── SelectEditorCell.tsx  # 下拉选择编辑器组件
│       │   └── TextEditorCell.tsx    # 文本编辑器组件
│       ├── const.ts              # 常量定义（数据类型选项、校验规则等）
│       ├── index.tsx             # 主表格组件
│       ├── store.ts              # Zustand状态管理，存放表格数据和操作函数
│       ├── styles.less           # 组件样式，定义表格格样式、错误提示样式等
│       └── type.ts               # TypeScript类型定义，包括 数据类型定义、字段类型定义
├── routes/                       # 约定式路由
│   ├── VarEditorTablePage/       # 变量编辑器页面
│   │   ├── index.less            # 页面样式
│   │   └── page.tsx              # 页面组件
│   ├── index.css                 # 全局样式
│   ├── layout.tsx                # 布局组件
│   └── page.tsx                  # 首页（重定向到  变量编辑器页面）
├── modern-app-env.d.ts           # Modern.js类型声明
└── modern.runtime.ts             # Modern.js运行时配置
```

## 四、技术选型说明

### 表格组件
- **Arco Design Table**: 提供完整的表格功能，支持行选择、自定义列渲染、分页等特性。

### 状态管理
- **Zustand**: 轻量级状态管理库，配合 Immer 实现不可变状态更新，简化状态操作逻辑，利用 React Context提供单实例组件唯一上下文。

### UI库
- **Arco Design**: 字节跳动开源的企业级UI组件库，提供丰富的组件和良好的设计规范。

### 构建工具
- **Rsbuild**: 基于 Rust 开发的高性能构建工具，由 Modern.js 团队维护，提供快速的开发体验和优化的生产构建。

## 五、核心功能

### 1. 表格展示管理
- 展示变量列表，字段包含：序号、变量名、数据类型、默认值、注释
- 序号列只读，系统自动生成

### 2. 数据操作

#### AC1：表格页面展示
- 渲染空白表格，固定列：序号、变量名、数据类型、默认值、注释
- 序号列只读，系统自动生成
- 页面展示「新增行」「删除行」两个操作按钮

#### AC2：新增变量行
- 在表格末尾新增一行
- 新行的变量名、数据类型、默认值、注释全部默认为空/默认值（BOOL、TRUE）
- 序号自动计算：当前表格最大序号 + 1

#### AC3：删除变量行
- 支持单选或多选删除
- 删除后下方所有行的序号自动重新排序更新
- 未选中任何行时删除按钮禁用

#### AC4：编辑变量名
- 点击变量名单元格进入编辑状态
- **校验规则**：
  - 输入为空：恢复原有名称，弹出错误提示
  - 输入名称已存在（大小写不敏感匹配）：提示错误「Name already exists」，不保存修改
  - 名称非空且全局唯一：保存修改生效

#### AC5：数据类型选择
- 点击数据类型单元格，下拉框弹出，仅两个选项：BOOL、INT
- **联动规则**：切换数据类型时，默认值自动重置为对应类型初始值
  - BOOL → 默认值 TRUE
  - INT → 默认值 0

#### AC6：BOOL类型默认值编辑
- 仅允许输入 true / false / TRUE / FALSE（大小写不敏感）
- 保存后统一展示大写格式：TRUE / FALSE
- 输入其他内容（如yes、123），弹出错误提示

#### AC7：INT类型默认值编辑
- 仅允许整数，取值范围：-2147483648 ~ 2147483647
- 非数字、小数、超出极值均弹出错误提示

#### AC8：注释编辑
- 任意文本均可输入，允许留空
- 无校验限制

### 3. 数据校验规则
- **变量名校验**: 唯一性校验（大小写不敏感），非空校验
- **数据类型校验**: 仅支持 BOOL、INT 两种类型
- **默认值校验**: 
  - BOOL: 仅允许 true/false（大小写不敏感），保存后统一大写展示
  - INT: 32位有符号整数，范围 -2147483648 ~ 2147483647

### 4. 联动规则
- 切换数据类型时，默认值自动重置为对应类型初始值
  - BOOL → 默认值 TRUE
  - INT → 默认值 0

## 六、组件职责说明

| 组件 | 职责 |
|------|------|
| `VarEditorTable` | 主表格组件，管理表格列配置、数据操作、校验逻辑 |
| `EditorCell` | 通用编辑器单元格，处理编辑状态切换、校验展示 |
| `TextEditorCell` | 文本编辑单元格,基于EditorCell组件进行扩展，继承EditorCellCommonProps方法，，处理文本输入和校验 |
| `SelectEditorCell` | 下拉选择单元格,基于EditorCell组件进行扩展，继承EditorCellCommonProps方法，，处理数据类型选择 |
| `store` | 状态管理，提供变量增删改查方法 |

## 七、状态管理设计

```typescript
// store.ts 核心API
const useStore = create(() => ({
  variables: [],           // 变量列表
  addVariable: (var) => {},      // 添加变量
  updateVariable: (id, updates) => {}, // 更新变量
  deleteVariable: (idList) => {},     // 删除变量（支持批量）
}));
```

## 八、开发注意事项

1. **热更新**: 由于 rsbuild 热更新插件存在兼容性问题，已在 `modern.config.ts` 中禁用
2. **React版本**: 项目使用 React 18.x，以兼容 Arco Design 的 Message 组件
3. **代码规范**: 使用 Biome 进行代码格式化和检查