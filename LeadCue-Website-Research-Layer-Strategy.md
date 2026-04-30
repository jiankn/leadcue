# LeadCue Website Research Layer Strategy

版本：v1.0  
日期：2026-04-26  
适用阶段：定位统一 + MVP 收敛 + 商业验证

---

## 1. 产品判断

LeadCue 不应该继续被定义成“又一个 AI prospecting tool”。

更准确的产品定义是：

> LeadCue is the website research layer between discovering an account and starting outreach.

中文表达：

> LeadCue 是发现网站之后、正式外拓之前的研究与判断层。

这意味着 LeadCue 不负责赢下“谁能找到最多网站、最多联系人”的战争，而是负责更关键的一步：

- 这个网站值不值得联系
- 为什么现在联系它
- 应该用什么角度切入
- 应该把什么上下文交给 CRM 或发信工具

---

## 2. 我们不做什么

LeadCue 第一性原理上不该主打这些方向：

- 不是联系人数据库
- 不是邮箱查找器
- 不是 LinkedIn scraper
- 不是自动群发平台
- 不是 Apollo / Hunter / Clay 的正面替代品

LeadCue 应该主打：

- website-first outbound research
- website review before outreach
- reason-to-contact discovery
- outreach-ready context from visible website evidence

---

## 3. 双入口产品形态

LeadCue 应该天然支持两种真实工作流，而不是赌用户只会一个一个手工找网站。

### 3.1 Manual Mode

入口：Chrome 插件

适合场景：

- 用户在 Google、目录站、LinkedIn company page、referral、partner page 上发现一个网站
- 用户已经打开网站，想马上判断值不值得联系
- 用户需要快速复制 first line、保存 lead、进入 dashboard

### 3.2 Batch Mode

入口：Web 后台

适合场景：

- 用户已经有一批域名或公司名单
- 来源可能是 Apollo、Clay、CSV、CRM、Google Sheets、目录导出
- 用户需要批量跑扫描，再逐个 review 和筛选

核心判断：

> Website-first 不等于 one-by-one manual discovery。  
> Website 仍然是“为什么联系这家公司”的证据源。

---

## 4. Batch Import / Review Queue MVP

### 4.1 MVP 目标

让用户可以把一批网站送进 LeadCue，然后在一个 review queue 里完成：

- 网站级筛选
- 联系理由判断
- 保存
- 导出

### 4.2 输入方式

第一版只做最现实的 3 种输入：

- CSV 上传
- 粘贴域名列表
- 导入外部导出的公司名单

第一版要求的最小字段：

- `domain`

可选增强字段：

- `companyName`
- `source`
- `owner`
- `campaign`
- `notes`

### 4.3 处理流程

批量流程建议固定为：

1. 规范化域名
2. 去重
3. 校验是否可访问
4. 扣减 credits 并进入 scan queue
5. 生成 fit、evidence、reason、first line
6. 进入人工 review queue

### 4.4 Review Queue 必备字段

第一版列表至少要显示：

- company name
- domain
- source
- fit score
- reason to contact
- top website cue
- status
- owner
- saved / exported state

### 4.5 Review Queue 必备动作

第一版每条记录建议支持：

- 打开官网
- 查看详情
- 保存到 lead list
- 复制 first line
- 标记不合适
- 导出选中项

### 4.6 详情抽屉 / 详情页

详情层至少包含：

- company summary
- fit reason
- website evidence
- outreach angles
- first line
- source notes
- public contact paths

### 4.7 第一版明确不做

- 不做联系人 enrichment
- 不做 verified email 承诺
- 不做自动发信
- 不做 sequence builder
- 不做多阶段 CRM
- 不做 lead discovery database

---

## 5. 插件与 Web 的职责边界

### 5.1 Chrome 插件负责什么

插件应该负责“单站即时判断”：

- 识别当前网站
- 读取可见页面内容
- 触发单站扫描
- 展示 fit、evidence、first line
- 复制 first line / email
- 快速保存
- 跳转到 Web 后台

插件不应该承担的事情：

- 大批量导入
- 批量 review
- ICP 配置全流程
- 复杂导出
- 套餐和账单主流程

### 5.2 Web 后台负责什么

Web 应该负责“系统化管理和批量工作流”：

- ICP 设置
- batch import
- review queue
- saved leads
- exports
- billing
- analytics
- account / team settings

一句话分工：

> 插件负责“此刻这个网站值不值得联系”。  
> Web 负责“这一批网站里哪些值得推进，以及怎么管理后续动作”。

---

## 6. 首页和外部文案原则

### 6.1 应该反复强调的话

- Turn company websites into qualified outreach opportunities
- Find the reason to contact before you hunt for the email
- Website-first outbound research for agencies
- Outreach-ready context from visible website evidence

### 6.2 应该降权的话

- AI assistant
- cold email first line generator
- website lead extractor
- prospect card generator

这些词可以作为功能说明存在，但不应该继续做主定位。

### 6.3 外部叙事顺序

建议所有外部页面都遵循这个顺序：

1. 你不缺名单
2. 你缺的是联系理由
3. 网站就是最可信的外部证据源
4. LeadCue 把这些证据整理成可执行的外拓上下文

---

## 7. 最小商业验证指标

定位切换后，更该看的不是“总扫描量”，而是 workflow 指标：

- 从扫描到保存的转化率
- 从保存到导出的转化率
- first line 复制率
- batch import 后的 review 完成率
- 每 100 个网站里有多少个被判定为值得联系
- 单个用户完成首次“导入或扫描 -> 保存 -> 导出”的时间

---

## 8. 接下来的产品优先级

基于这个定位，建议按下面顺序推进：

1. 官网和 README 全部切换到新的定位表述
2. 插件打磨成最顺手的单站 research 入口
3. Web 增加 Batch Import / Review Queue MVP
4. 导出链路打通到用户现有外拓工作流
5. 再决定是否补更多 enrichment 或 CRM 能力

---

## 9. 最终结论

LeadCue 不是“发现网站”的工具。

LeadCue 也不应该试图靠“AI 很聪明”来赢。

LeadCue 最有前途的位置，是：

> the research layer between finding a website and starting outreach

只要始终守住这个位置，LeadCue 就不是在和大平台拼“数据库规模”，而是在占住一个更窄、更真实、也更容易建立付费价值的工作流环节。
