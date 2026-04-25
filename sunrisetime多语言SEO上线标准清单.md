# SunriseTime 多语言 SEO 上线标准清单

> 目标：把每个新语言版本当成新的 SEO 资产，而不是英文页面的翻译副本。  
> 适用范围：首页、城市页、祈祷时间页、索引页、指南页、方法论页、信任页、sitemap、hreflang、Search Console 提交。  
> 当前结论：多语言的唯一核心目标是新增可索引、可排名、可点击的自然流量。

---

## 1. 核心原则

1. 多语言不是品牌动作，而是 SEO 扩张动作。
2. 每个语言版本必须拥有独立 URL、独立可见内容、独立元数据、独立内链。
3. Google 看到的必须是目标语言的主要内容，而不是只翻导航、按钮、页脚。
4. 一个新语言版本只有在可抓取、可索引、可归类、可点击时，才算上线成功。
5. 如果某语言做不到完整页面质量，不上线比半成品上线更好。
6. 新语言页面不得直接从英文逐句翻译标题、Description、H1、正文、FAQ，而必须先研究该语言真实用户的搜索表达，再按该语言关键词重写页面。

---

## 2. URL 标准

### 2.1 路由策略

- 英文保留主站根路径：
  - `/`
  - `/sunrise/{city}/`
  - `/prayer-times/{city}/`
  - `/cities/`
- 其他语言统一放在语言前缀下：
  - `/es/`
  - `/ar/`
  - `/fr/`
  - `/tr/`
  - `/id/`
  - `/pt/`
  - `/ms/`

### 2.2 Phase 1 推荐路由形式

- 为了控制复杂度，第一阶段只增加语言前缀，不翻译核心路由段。
- 推荐：
  - `/es/sunrise/madrid/`
  - `/ar/prayer-times/dubai/`
  - `/fr/cities/`
- 暂不推荐第一阶段就做：
  - `/es/amanecer/madrid/`
  - `/fr/lever-du-soleil/paris/`
- 原因：先保证路由稳定、映射简单、hreflang 一致，再考虑 URL 词面本地化。

### 2.3 城市 slug 规则

- 城市 slug 在所有语言中保持全局稳定。
- 第一阶段不翻译城市 slug。
- 城市显示名称可以本地化，但 URL 标识符保持一致。
- 示例：
  - URL：`/es/sunrise/new-york/`
  - 页面显示：`Nueva York`

### 2.4 禁止项

- 禁止只靠 query 参数切语言，如 `?lang=es`
- 禁止只靠 cookie 或浏览器语言切内容
- 禁止多个语言共用同一个可索引 URL

---

## 3. 页面模板上线范围

### 3.1 试点语言最低上线包

一个语言要进入可索引试点，至少要有：

- 语言首页
- 语言城市索引页
- 语言城市日出日落页模板
- 语言隐私政策页
- 语言服务条款页
- 语言关于页
- 语言联系方式页
- 语言 sitemap
- 语言 hreflang 集群

### 3.2 正式语言完整上线包

一个语言要被视为“正式上线”，必须补齐：

- 语言首页
- 语言城市索引页
- 语言区域页
- 语言日出日落城市页
- 语言祈祷时间城市页
- 语言 guides 页
- 语言 methodology 页
- 语言 about / privacy / terms / contact
- 语言 HTML sitemap
- 语言 XML sitemap
- 语言 hreflang

### 3.3 Prayer 强相关语言额外要求

以下语言上线时，`/prayer-times/` 不得缺失：

- 阿拉伯语 `ar`
- 土耳其语 `tr`
- 印尼语 `id`
- 马来语 `ms`
- 法语 `fr`

原因：这些语言与 prayer query、北非/中东/东南亚使用场景高度相关。

---

## 4. 页面级 SEO 标准

每个可索引语言页面都必须满足以下条件。

### 4.1 Title

- 必须使用目标语言撰写
- 必须包含主关键词
- 必须包含城市名或页面主题
- 建议保留品牌词 `SunriseTime`

示例：

- 英文：`Sunrise & Sunset Times in New York Today - SunriseTime`
- 西语：`Hora del amanecer y atardecer en Nueva York hoy - SunriseTime`

### 4.2 Meta Description

- 必须使用目标语言
- 必须概括页面核心答案
- 必须包含主关键词与城市名
- 不得沿用英文 description

### 4.3 H1

- 每页唯一
- 必须使用目标语言
- 必须与 Title 同一搜索意图

### 4.4 正文前 100 字

- 必须出现主关键词或其自然变体
- 必须先给答案，再补解释
- 禁止只翻按钮，正文仍是英文

### 4.5 首屏答案区

- 城市页必须在首屏直接出现：
  - Sunrise
  - Sunset
  - Daylight length
  - Local date/time
- Prayer 页必须在首屏直接出现：
  - Next prayer
  - Full prayer schedule
  - Calculation method

### 4.6 混合语言控制

- 页面主体不得残留英文硬编码
- 城市专有名词可以保留国际写法，但页面叙述语言必须统一
- Legal / policy / methodology 页面不得出现半页翻译、半页英文

### 4.7 关键词本地表达校准

- 禁止把英文主关键词直接机械翻译为目标语言关键词
- 必须先确认该语言用户真实会怎么搜索，再决定 Title、H1、Description、正文前 100 字与 FAQ 的写法
- 同一个搜索意图在不同语言里，正确表达方式、词序、常用搭配、是否带介词或城市名，可能都不同
- 必须优先采用目标语言里的自然高频表达，而不是“翻得对但没人搜”的表达
- guides / methodology / trust 页面同样适用，不能只保证城市页自然、其余页面仍沿用英文逻辑直译

---

## 5. 结构化数据标准

### 5.1 JSON-LD 必须同步本地化

- `name`
- `description`
- `breadcrumb`
- `FAQPage` 中的问题与答案

### 5.2 结构化数据类型

- 首页：`WebSite` + `Organization`
- 城市页：`WebPage` + `BreadcrumbList` + `FAQPage`
- 指南页：`CollectionPage` 或 `Article`
- 方法论页：`TechArticle`

### 5.3 禁止项

- 禁止语言页面沿用英文 schema 文案
- 禁止 schema 中 canonical URL 指向英文页
- 禁止 FAQ 文本与页面主语言不一致

---

## 6. Canonical 与 Hreflang 标准

### 6.1 Canonical 规则

- 每个语言版本默认 self-canonical
- 英文页 canonical 指向英文自身
- 西语页 canonical 指向西语自身
- 阿语页 canonical 指向阿语自身
- 禁止把多语言页统一 canonical 到英文页

### 6.2 Hreflang 规则

- 每个页面必须列出该页面的全部可用语言版本
- 必须包含自己
- 建议包含 `x-default`
- 所有语言版本的 hreflang 集合必须完全一致

示例语言代码：

- `en`
- `es`
- `ar`
- `fr`
- `tr`
- `id`
- `pt`
- `ms`
- `x-default`

### 6.3 区域代码规则

- 第一阶段优先只做语言级，不急着细分国家级
- 若后续做国家级，必须使用正确组合：
  - `en-GB`
  - `es-MX`
  - `pt-BR`
- 禁止错误代码：
  - `en-UK`

### 6.4 缺页规则

- 某个页面如果暂时没有西语版本，就不要在 hreflang 中伪造西语 URL
- 只声明真实存在且可索引的语言页面

---

## 7. Sitemap 标准

### 7.1 Sitemap 架构

- 使用 `sitemap-index.xml` 统一聚合
- 每个语言至少拆出一个独立 sitemap
- 建议继续按语言 + 页面类型拆分

建议形式：

- `/sitemap-index.xml`
- `/sitemap-en-sunrise.xml`
- `/sitemap-es-sunrise.xml`
- `/sitemap-ar-prayer.xml`

### 7.2 提交规则

- 每新增一个语言 sitemap，提交到 Google Search Console
- sitemap 中只放 canonical、可索引 URL
- noindex 页面、重定向页、404 页禁止出现在 sitemap 中

---

## 8. 内容质量标准

### 8.1 允许的内容生产方式

- 可以借助翻译工具或 AI 提高效率
- 但必须人工审校核心模板与 trust 页面
- 必须保证翻译后内容自然、准确、对用户有用

### 8.2 不允许的内容

- 只改 Title / H1，正文仍为英文
- 只有 UI 文案翻译，主体内容未翻译
- 机械替换城市名的大面积薄内容
- 方法论、法律、祈祷计算说明与实际产品不一致

### 8.3 模板内容要求

- 程序化页面可以使用模板
- 但模板必须承载真实城市数据、真实语言内容、真实内链
- 模板页面必须先满足“对用户有用”，再考虑关键词覆盖

---

## 9. 内链标准

### 9.1 同语言内链优先

- 西语页优先链接西语页
- 法语页优先链接法语页
- 阿语页优先链接阿语页

### 9.2 页面最少内链要求

- 首页链接到本语言核心城市页
- 城市页至少包含：
  - 本语言首页链接
  - 本语言城市索引链接
  - 本语言附近城市链接
  - 本语言相关功能页链接

### 9.3 语言切换器规则

- 语言切换器必须输出真实 `<a href>` 链接
- 禁止只靠 JS 动态跳转
- 当前页不存在对应语言版本时，跳转到该语言首页或同主题 hub，不要跳 404

---

## 10. 技术与体验标准

### 10.1 HTML 语言声明

- 每个页面必须正确设置 `<html lang="">`
- 阿拉伯语页面必须设置 RTL

示例：

- 英文：`<html lang="en">`
- 西语：`<html lang="es">`
- 阿语：`<html lang="ar" dir="rtl">`

### 10.2 Performance 基线

- Lighthouse SEO >= 95
- Core Web Vitals 不因多语言版本显著下降
- 构建后不得出现模板级 404、空白页、错误 hreflang、错误 canonical

### 10.3 搜索与别名

- 城市搜索必须支持：
  - 英文名
  - 本地语言名
  - 常见别名
- 示例：
  - `New York`
  - `Nueva York`
  - `Estambul`

---

## 11. Google Search Console 与监控标准

### 11.1 上线前

- 确认语言目录已被 sitemap 覆盖
- 确认 robots 未误拦截
- 确认 canonical / hreflang / title / description 正确输出

### 11.2 上线后 30 天内重点观察

- 已提交 URL 的索引率
- 各语言目录 impressions
- 各语言目录 CTR
- 模板页是否出现大量 soft 404
- 是否出现“Duplicate, Google chose different canonical”异常

### 11.3 继续扩量前的建议门槛

- 试点语言目录已出现稳定 impressions
- 试点核心 URL 有被索引
- 无模板级 canonical / hreflang 错误
- 无大面积薄内容警报

---

## 12. SunriseTime 多语言上线验收清单

### 12.1 语言级验收

- [ ] 已创建独立语言目录
- [ ] 已生成语言 sitemap
- [ ] 已接入 hreflang
- [ ] 已设置 self-canonical
- [ ] 已设置 `html lang`
- [ ] 阿语已完成 RTL 适配
- [ ] Search Console 已提交 sitemap

### 12.2 模板级验收

- [ ] 首页为目标语言
- [ ] 城市页 Title / Description / H1 已本地化
- [ ] Prayer 页 Title / Description / H1 已本地化
- [ ] FAQ / JSON-LD 已本地化
- [ ] 内链锚文本已本地化
- [ ] policy / methodology 已本地化
- [ ] 无明显英文残留

### 12.3 SEO 质量验收

- [ ] 页面主内容为目标语言
- [ ] URL 可抓取、可访问、非重定向链
- [ ] canonical 正确
- [ ] hreflang 成对互指
- [ ] sitemap 仅含 canonical URL
- [ ] 页面可通过真实 HTML 链接进入

---

## 13. SunriseTime 当前推荐语言代码

| 语言 | 代码 | 上线优先级 |
|---|---|---|
| 英语 | `en` | 已有主站 |
| 西班牙语 | `es` | 第一梯队 |
| 阿拉伯语 | `ar` | 第一梯队 |
| 法语 | `fr` | 第一梯队 |
| 土耳其语 | `tr` | 第二梯队 |
| 印尼语 | `id` | 第二梯队 |
| 葡萄牙语 | `pt` | 第三梯队 |
| 马来语 | `ms` | 第三梯队 |

---

## 14. 官方参考

- Google Search Central: managing multi-regional and multilingual sites  
  https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Google Search Central: localized versions / hreflang  
  https://developers.google.com/search/docs/specialty/international/localized-versions
- Google Search Central: canonicalization  
  https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Google Search Central: consolidate duplicate URLs  
  https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central: title link best practices  
  https://developers.google.com/search/docs/advanced/appearance/title-link
- Google Search Central: control snippets / descriptions  
  https://developers.google.com/search/docs/appearance/snippet
- Google Search Central: crawlable links  
  https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google Search Central: Search Essentials  
  https://developers.google.com/search/docs/essentials
