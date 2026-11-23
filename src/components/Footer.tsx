export function Footer() {
  return (
    <footer className="rounded-md border border-line bg-white/80 px-4 py-3 text-[11px] leading-relaxed text-navy-muted">
      <p className="font-semibold text-navy">免责声明 / Disclaimer</p>
      <p className="mt-1">
        本仪表盘为研究与情景模拟工具，展示期权微观结构与流动性压力的相互关系。综合评分
        <strong className="font-semibold">不可解释为崩盘概率</strong>
        ，亦不构成投资、交易或风险管理建议。做市商敞口（GEX / Gamma / Delta /
        Vanna / Charm）为模型估算，须标注方法与单位，非交易所披露头寸。缺失数据以
        N/A 显示，不编造实时行情。SKEW
        须结合历史分位数与 VIX 解读，不可单独定义危机。Vanna
        方向取决于经销商头寸，不默认「波动率上升 = 卖压」。
      </p>
      <p className="mt-1 text-navy-soft">
        Institutional Risk Monitor · Research / Scenario Simulation Only · Not
        live market data
      </p>
    </footer>
  );
}
