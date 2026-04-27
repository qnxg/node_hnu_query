<div align="center">

# HNU Query

湖南大学校内系统查询库（TypeScript 版本）

<p>
  <img alt="language" src="https://img.shields.io/badge/language-TypeScript-3178c6" />
  <img alt="node" src="https://img.shields.io/badge/node-%3E%3D18-339933" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green" />
</p>
</div>

## 简介

本项目将湖南大学的校内系统（如个人门户、教务系统等）的接口进行包装，提供一套获取结构化数据的能力。基于 [Rust 版 hnu_query](https://code.qnxg.cn/qnxg/hnu_query) 移植。

## 支持的功能

- **CAS 统一认证** — 通过学号和密码创建令牌，支持 Cookie 缓存恢复
- **教务系统** — 课程表、无课表课程、空教室、考试安排、课程成绩及详情、成绩排名
- **体测系统** — 体测预约信息、体测成绩（含视力/BMI/肺活量等分项）
- **大物实验平台** — 学期列表、课程列表、实验安排、实验成绩、虚拟实验成绩
- **校园网流量系统** — 本月用量、月/日流量明细、账单、欠费金额、账户锁定状态
- **个人门户** — 校园卡信息、消费/充值历史、未读邮件数
- **学工系统** — 个人信息（含宿舍解析）
- **可信电子凭证** — 成绩排名
- **微信支付** — 宿舍电量查询

## 安装

```bash
pnpm add @qnxg/hnu-query
# 或
npm install @qnxg/hnu-query
```

## 快速开始

> 使用本项目需要在湖南大学校园网内或已登录湖南大学 VPN。

```ts
import {
  createCasToken,
  acquireHdjwToken,
  getGrade,
} from "@qnxg/hnu-query"

const stuId = ""
const password = ""

// 创建 CAS 令牌
const casToken = await createCasToken({ stuId, password })

// 派生教务系统令牌
const hdjwToken = await acquireHdjwToken(casToken)

// 获取 2025-2026 学年秋季学期成绩
const grades = await getGrade({ xn: 2025, xq: 1, token: hdjwToken })
console.log(grades)
```

### Token 缓存恢复

每次系统登录都有频率限制，建议缓存 Token 后复用：

```ts
// 保存
const casToken = await createCasToken({ stuId, password })

// 恢复（需配合原始密码）
const restored = await createCasTokenFromCookie({
  cookie: casToken.cookie,
  stuId,
  password,
})
```

## API 文档

完整接口规范见 [api.yml](./api.yml)，或参考 [Rust 版文档](https://code.qnxg.cn/qnxg/hnu_query)。

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 类型检查
pnpm lint

# 自动修复
pnpm fix
```

## License

本项目基于 `AGPL-3.0` 协议。所有基于本项目的代码必须开源。
