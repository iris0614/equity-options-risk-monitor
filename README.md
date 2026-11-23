# Equity Options Risk Monitor

美股期权微观结构与流动性踩踏监控仪表盘（Institutional Risk Monitor）。

金融逻辑、基准数值、阶段判定与综合评分公式以原始参考站点为准：  
https://sites.google.com/view/fupeng715/full-page-embed

> 本仓库数据为**情景模拟 / 研究样本**硬编码，**不是**实时行情接口。缺失值显示 N/A，不编造 live market data。

## 功能

- 四阶段风险演化（原始 `detectRegime` 优先级）
- 六节点负反馈传导链（动态高亮）
- 五维 14 项指标 + 压力滑杆
- 综合压力指数 0–100（原始 `computeStressIndex`）
- 双清单：风险升级 / OPEX 修复
- 五情景切换、CSV 导入导出、本地快照

## 本地运行

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm test
npm run build
```

## GitHub Pages 部署

- 推送到 `main` 后，Actions 工作流 `.github/workflows/deploy-pages.yml` 自动构建并发布。
- 构建时 `VITE_BASE=/equity-options-risk-monitor/`，避免子路径白屏。
- 仓库 Settings → Pages → Source 选 **GitHub Actions**。
- 公共地址（启用后）：https://iris0614.github.io/equity-options-risk-monitor/

## 数据更新

1. 编辑 `src/config/scenarios.ts` 中情景指标；或
2. 在 UI 调整滑杆后「导出 CSV」，再「导入 CSV」；或
3. 保存浏览器快照（localStorage，仅本机）。

阈值说明见 `src/config/thresholds.ts`；状态规则见 `src/engine/status.ts`；评分/阶段见 `src/engine/score.ts`、`src/engine/stages.ts`。

## 安全

- 无后端、无 API Key、无密钥写入前端。
- 公开页仅含静态研究样本与客户端计算。

## 许可与免责

仅供微观结构逻辑推演与复盘参考，不构成投资建议。综合评分不是崩盘概率。
