export function Footer() {
  return (
    <footer className="rounded-md border border-line bg-white/80 px-4 py-3 text-[11px] leading-relaxed text-navy-muted">
      <p className="font-semibold text-navy">免责声明</p>
      <p className="mt-1">
        美股期权微观结构与流动性踩踏监控仪表盘 ·
        仅用于机构微观结构逻辑推演与复盘参考，不构成投资建议。综合评分不可解释为崩盘概率。做市商敞口（GEX
        / Gamma / Delta）为模型估算。缺失数据以 N/A
        显示，不编造实时行情。SKEW 须结合 VIX；Vanna
        方向取决于经销商头寸。
      </p>
    </footer>
  );
}
