# LeadCue Web IA and Review Queue Blueprint

版本：v1.0  
日期：2026-04-26  
适用范围：`/app` 后台重构蓝图  
目标：把 Web 从“单站扫描后台”重构为“批量研究与逐站判断工作台”

---

## 1. 先下结论

Web 端需要重设计，但不是整站推翻重做。

真正需要重做的是：

- 信息架构
- 首页主路径
- Leads 页面职责
- Scan Console 的页面权重

不需要先重做的是：

- 视觉品牌
- ICP 评分逻辑
- Billing 基础能力
- Account 基础能力
- Chrome 插件到 Web 的跳转链路

一句话判断：

> 插件负责“当前这个网站值不值得联系”。  
> Web 负责“这一批网站里哪些值得推进，以及如何保存、复核、导出”。

---

## 2. 当前 Web 的主要问题

### 2.1 首页像介绍页，不像工作台

当前 Dashboard 仍然把 scan console 放在太中心的位置，更像“进入产品后继续看产品能力”，而不是“回到工作现场继续处理队列”。

用户真正关心的是：

- 今天有什么待处理
- 哪些网站值得优先看
- 我上次处理到哪里
- 哪些结果已经可以导出

### 2.2 Leads 页面只覆盖“保存后管理”

现在的 Leads 更像 saved leads library，但 LeadCue 更关键的价值发生在保存前：

- 先判断这个网站值不值得联系
- 再决定是否保存

所以 Web 缺了真正的主战场：

> Review Queue

### 2.3 Web 和插件的分工还不够清楚

当前 Web 里 scan console 的重要性过高，容易和插件产生职责重叠。

更合理的关系应该是：

- 插件：单站即时判断入口
- Web：批量处理、复核、保存、导出

### 2.4 Analytics 指标还偏“系统指标”

如果 Analytics 继续主要讲扫描量和积分量，就不够贴近产品定位。

更该看的，是 workflow 指标：

- 扫描到保存转化率
- 保存到导出转化率
- first line 复制率
- batch review 完成率
- 每批导入里有多少高匹配账户

---

## 3. 新的信息架构

## 3.1 一级导航

建议把 `/app` 主导航调整为：

1. Overview
2. Import
3. Review Queue
4. Saved Accounts
5. ICP & Offer
6. Exports
7. Billing
8. Account

### 3.2 导航改名建议

当前到目标：

- `Dashboard` -> `Overview`
- `Leads` -> 拆成 `Review Queue` + `Saved Accounts`
- `ICP` -> `ICP & Offer`
- `Analytics` -> 保留，但并入 `Overview` 次级视图或后续页
- `Billing` -> 保留
- `Account` -> 保留

### 3.3 核心路径

Web 的主路径应该从：

`进来 -> 看 scan console -> 看 sample/save`

改成：

`进来 -> 看待处理队列 -> 逐站判断 -> 保存 -> 导出`

---

## 4. 新页面职责

## 4.1 Overview

这是工作恢复页，不是介绍页。

必须回答 4 个问题：

- 今天待处理多少网站
- 最近导入的批次进度如何
- 哪些账户最值得优先处理
- 哪些已保存账户已经可以导出

建议内容：

- 队列概览 KPI
- 最近批次状态
- 高优先账户列表
- 最近保存 / 最近导出
- 快捷入口：`导入一批网站`、`继续 Review Queue`

不建议在这里继续把 scan console 作为主角。

## 4.2 Import

这是新主功能页之一。

目标：

- 让用户把一批域名丢进系统
- 系统完成去重、规范化、排队
- 用户马上进入 review queue

建议模块：

- CSV 上传
- 粘贴域名列表
- 导入说明
- credits 消耗预估
- 最近导入批次

## 4.3 Review Queue

这是 Web 的真正主战场。

目标：

- 逐站判断是否值得联系
- 快速看到 reason to contact
- 快速保存、跳过、打开官网、复制 first line

建议列表字段：

- Company
- Domain
- Fit
- Reason to contact
- Top cue
- Source
- Owner
- Status

建议筛选器：

- Fit score
- Service type / ICP fit
- Source
- Status
- Saved / unsaved
- Has first line / no first line

建议行内动作：

- Open site
- Review
- Save account
- Skip
- Copy first line

建议右侧抽屉：

- Summary
- Fit reason
- Website evidence
- Outreach angles
- First line
- Contact paths
- Export fields preview

## 4.4 Saved Accounts

这是“已确认值得推进”的库，不再混入待筛选结果。

目标：

- 管理真正被保留下来的账户
- 承接导出和 handoff

建议能力：

- 搜索
- 筛选
- 批量选择
- 修改 owner / stage
- 导出

## 4.5 ICP & Offer

继续负责定义“什么叫值得联系”。

建议保留：

- service type
- target industries
- target regions
- avoided industries
- company size
- offer description
- tone

建议增强：

- “这套 ICP 会如何影响 queue 排序”的可见解释

## 4.6 Exports

从 Saved Accounts 中导出，而不是从任意列表里临时导出。

建议模块：

- Export preset
- CRM field mapping
- 最近导出记录
- 选中账户摘要

## 4.7 Billing

保留，但信息更贴近 workflow：

- 剩余积分
- 当前计划
- 当前批次还能跑多少站
- 最近 credits 消耗来源

## 4.8 Account

保留，用于：

- identity
- workspace
- password
- session
- sign out

---

## 5. 桌面端线框

## 5.1 Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Overview                                    [Import websites] [Resume Queue] │
│ You have 38 websites waiting for review.                            │
├──────────────────────────────────────────────────────────────────────┤
│ KPI: Pending 38 | Saved today 9 | Ready to export 4 | Credits 212   │
├───────────────────────────────┬──────────────────────────────────────┤
│ Recent imports                │ High-priority accounts               │
│ Batch Apr 26 · 120 sites      │ Northstar Analytics · Fit 86         │
│ 48 scanned / 21 reviewed      │ CTA buried below fold                │
│ [Open batch]                  │ [Review] [Open site]                 │
│                               │                                      │
│ Batch Apr 25 · 80 sites       │ Beacon Dental · Fit 82               │
│ 80 scanned / 80 reviewed      │ No visible proof                     │
├───────────────────────────────┴──────────────────────────────────────┤
│ Recently saved accounts                                           > │
└──────────────────────────────────────────────────────────────────────┘
```

## 5.2 Import

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Import websites                                                     │
│ Bring in CSVs, pasted domains, or exported lists for batch review.  │
├───────────────────────────────┬──────────────────────────────────────┤
│ Upload CSV                    │ Paste domains                        │
│ [ Drop file / Choose file ]   │ [ northstar.com                      │
│ Expected: domain, company     │   beacon.dental                      │
│ source, owner (optional)      │   lumenlogistics.com ]              │
│                               │ [Create batch]                       │
├───────────────────────────────┴──────────────────────────────────────┤
│ Estimated credits: 120 basic scans                                  │
│ [Start import]                                                       │
├──────────────────────────────────────────────────────────────────────┤
│ Recent batches                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## 5.3 Review Queue

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Review Queue                                        [Bulk save] [Export selected] │
├──────────────────────────────────────────────────────────────────────────────┤
│ Search | Fit 70+ | Source: Apollo | Unsaved | Has first line | Owner        │
├───────────────────────────────────────┬──────────────────────────────────────┤
│ Company / Fit / Top cue / Status      │ Selected account                     │
│ Northstar Analytics  86               │ Summary                              │
│ CTA below fold                        │ Fit reason                           │
│ [Open] [Review] [Save] [Skip]         │ Website evidence                     │
│                                       │ Outreach angles                      │
│ Beacon Dental       82                │ First line                           │
│ No visible proof                      │ Contact paths                        │
│ [Open] [Review] [Save] [Skip]         │ [Save account] [Copy first line]     │
│                                       │ [Open site]                          │
│ Lumen Logistics     74                │                                      │
└───────────────────────────────────────┴──────────────────────────────────────┘
```

## 5.4 Saved Accounts

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Saved Accounts                                   [Export] [Assign owner] │
├──────────────────────────────────────────────────────────────────────┤
│ Search | Stage | Owner | Source | Fit                               │
├───────────────────────────────────────┬──────────────────────────────┤
│ Saved account list                    │ Account detail / export view │
│ Northstar Analytics                   │ Summary                      │
│ Beacon Dental                         │ Evidence                     │
│ Lumen Logistics                       │ First line                   │
│ ...                                   │ Export mapping preview       │
└───────────────────────────────────────┴──────────────────────────────┘
```

---

## 6. 移动端策略

Web 主要是桌面产品，但移动端仍需可用。

建议移动端策略：

- Overview 允许查看，不强调复杂操作
- Import 仅保留轻量粘贴列表
- Review Queue 改成“卡片流 + 底部抽屉”
- Saved Accounts 可浏览、搜索、导出摘要
- ICP / Billing / Account 保持基础可编辑

移动端不应该尝试保留桌面三栏结构。

---

## 7. 最小交互原则

### 7.1 每页只保留一个主动作

- Overview：`Resume Queue`
- Import：`Start import`
- Review Queue：`Save account`
- Saved Accounts：`Export selected`

### 7.2 不在同一页同时强调“扫描”和“管理”

这是当前结构容易混乱的根因之一。

扫描是进入结果的方式，管理是工作流本体。  
Web 应以管理为主，插件应以扫描为主。

### 7.3 首屏先给“现在该做什么”

不要先展示很多解释型 copy。  
首屏应优先给：

- 当前待办
- 推荐动作
- 当前状态

---

## 8. 对当前代码结构的迁移建议

## 8.1 第一阶段

先不改后端模型，只改 Web IA。

顺序建议：

1. 把 `Dashboard` 改名和重排成 `Overview`
2. 把 `Leads` 重构成 `Review Queue`
3. 新增 `Saved Accounts` 视图
4. 把 `Scan Console` 从首页主区降级为辅助入口

## 8.2 第二阶段

补 `Import` 页面和 batch source 数据结构：

- import batch id
- source
- queue status
- reviewed count

## 8.3 第三阶段

再补 workflow analytics：

- reviewed / saved / exported funnel
- batch completion
- first line usage

---

## 9. P0 设计决策

这一轮最重要的 3 个决策是：

1. Web 的主导航从 `Dashboard / Leads` 逻辑改成 `Overview / Import / Review Queue / Saved Accounts`
2. Review Queue 成为 Web 的主战场
3. Scan Console 从首页主角降级为辅助入口

---

## 10. 最终结论

LeadCue 的 Web 不该继续长成“单站扫描后台”。

它应该长成一个：

> batch research + review queue + saved account handoff workspace

如果插件负责“即时判断”，那么 Web 就必须负责“批量处理与流程推进”。  
只有这样，产品定位、信息架构和真实使用路径才会真正对齐。
