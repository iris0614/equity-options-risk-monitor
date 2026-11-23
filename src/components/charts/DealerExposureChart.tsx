import type { IndicatorSnapshot, ThresholdBand, IndicatorId } from '../../types';
import { DEALER_GAMMA_FLOOR } from '../../config/indicators';
import { formatNum } from '../../utils/format';

interface Props {
  snap: IndicatorSnapshot;
  thresholds: Record<IndicatorId, ThresholdBand>;
  asOf: string;
}

interface GaugeRow {
  title: string;
  value: number | null;
  unit: string;
  min: number;
  max: number;
  floor?: number;
  leftLabel: string;
  midLabel: string;
  rightLabel: string;
  rightClass?: string;
  leftClass?: string;
}

function pct(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 100;
}

function ZeroGauge({
  title,
  value,
  unit,
  min,
  max,
  floor,
  leftLabel,
  midLabel,
  rightLabel,
  rightClass = 'text-navy-soft',
  leftClass = 'text-navy-soft',
}: GaugeRow) {
  const zeroPct = pct(0, min, max);
  const floorPct = floor !== undefined ? pct(floor, min, max) : null;
  const valPct =
    value === null ? null : Math.min(100, Math.max(0, pct(value, min, max)));

  const negative = value !== null && value < 0;
  const positive = value !== null && value > 0;
  const barColor = negative
    ? '#DC2626'
    : positive
      ? '#1A7F37'
      : '#94A3B8';

  // Fill from value toward zero (original: red segment between value and zero).
  let fillLeft = 0;
  let fillWidth = 0;
  if (valPct !== null) {
    if (value! < 0) {
      fillLeft = valPct;
      fillWidth = Math.max(0, zeroPct - valPct);
    } else if (value! > 0) {
      fillLeft = zeroPct;
      fillWidth = Math.max(0, valPct - zeroPct);
    }
  }

  const display =
    value === null
      ? 'N/A'
      : `${formatNum(value, unit === '' ? 0 : 1)}${unit ? ` ${unit}` : ''}`;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-xs font-semibold text-navy">{title}</h4>
        <span
          className={`font-mono text-sm font-semibold tabular-nums ${
            negative ? 'text-danger' : positive ? 'text-ok' : 'text-navy'
          }`}
        >
          {display}
        </span>
      </div>

      <div className="relative h-3.5 overflow-hidden rounded-sm">
        {/* zero-axis zone wash: left red / right green */}
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${zeroPct}%`,
            background: '#F9F3F4',
          }}
        />
        <div
          className="absolute inset-y-0"
          style={{
            left: `${zeroPct}%`,
            width: `${100 - zeroPct}%`,
            background: '#F0F9F7',
          }}
        />
        {/* value → zero fill (left of zero = red, right = green) */}
        {valPct !== null && fillWidth > 0 && (
          <div
            className="absolute top-0 h-full"
            style={{
              left: `${fillLeft}%`,
              width: `${fillWidth}%`,
              background: barColor,
            }}
          />
        )}
        {/* historical floor marker */}
        {floorPct !== null && (
          <div
            className="absolute top-0 h-full w-px border-l border-dashed border-danger"
            style={{ left: `${floorPct}%` }}
          />
        )}
        {/* zero axis */}
        <div
          className="absolute top-0 h-full w-0.5 bg-slate-800"
          style={{ left: `${zeroPct}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      <div className="relative h-4 text-[10px]">
        <span className={`absolute left-0 ${leftClass}`}>{leftLabel}</span>
        <span
          className="absolute -translate-x-1/2 text-navy-soft"
          style={{ left: `${zeroPct}%` }}
        >
          {midLabel}
        </span>
        <span className={`absolute right-0 ${rightClass}`}>{rightLabel}</span>
        {floorPct !== null && (
          <span
            className="absolute -translate-x-1/2 text-danger"
            style={{ left: `${floorPct}%`, top: 0 }}
          >
            {/* floor label already in leftLabel for dealer row */}
          </span>
        )}
      </div>
    </div>
  );
}

function regimeBadge(dealerGamma: number | null, gex: number | null): {
  text: string;
  className: string;
} {
  if (dealerGamma !== null && dealerGamma <= DEALER_GAMMA_FLOOR) {
    return { text: '击穿历史底线', className: 'bg-red-50 text-danger' };
  }
  if (
    (dealerGamma !== null && dealerGamma < 0) ||
    (gex !== null && gex < 0)
  ) {
    return { text: '负 Gamma 加速区', className: 'bg-red-50 text-danger' };
  }
  if (
    (dealerGamma !== null && dealerGamma >= 0) ||
    (gex !== null && gex >= 0)
  ) {
    return { text: '正 Gamma 阻尼区', className: 'bg-emerald-50 text-ok' };
  }
  return { text: 'N/A', className: 'bg-slate-100 text-navy-soft' };
}

export function DealerExposureChart({ snap }: Props) {
  const dealer = snap.dealerGamma.value;
  const gex = snap.gex.value;
  const netDelta = snap.netDeltaFlow.value;
  const badge = regimeBadge(dealer, gex);

  const buffer =
    dealer === null ? null : Math.round((dealer - DEALER_GAMMA_FLOOR) * 10) / 10;
  const bufferText =
    buffer === null
      ? 'N/A'
      : buffer <= 0
        ? `已跌穿底线 ${formatNum(Math.abs(buffer), 1)} $B`
        : `+${formatNum(buffer, 1)} $B`;

  return (
    <div className="panel flex h-full flex-col p-3">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy">
            做市商库存与历史底线水位
          </h3>
          <p className="text-[10px] text-navy-soft">
            Dealer Agg Gamma ({DEALER_GAMMA_FLOOR}B 底线) / SPX GEX / Net Delta
          </p>
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
        >
          {badge.text}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        <ZeroGauge
          title="SPX Dealer Agg Gamma"
          value={dealer}
          unit="$B"
          min={-10}
          max={10}
          floor={DEALER_GAMMA_FLOOR}
          leftLabel={`底线 ${DEALER_GAMMA_FLOOR}B`}
          midLabel="零轴翻转 0.0B"
          rightLabel="正Gamma +10B"
          leftClass="text-danger"
          rightClass="text-ok"
        />
        <ZeroGauge
          title="SPX Gamma Exposure (GEX)"
          value={gex}
          unit="$B"
          min={-130}
          max={130}
          leftLabel="-$130B（极值）"
          midLabel="零轴 0B"
          rightLabel="+$130B"
        />
        <ZeroGauge
          title="Estimated Net Delta Flow"
          value={netDelta}
          unit=""
          min={-150}
          max={150}
          leftLabel="-150（持续卖出）"
          midLabel="零轴平衡点"
          rightLabel="+150（买回对冲）"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-2 text-[11px]">
        <span className="text-navy-muted">
          距离 {DEALER_GAMMA_FLOOR}B 历史底线缓冲：
        </span>
        <span
          className={`font-mono font-semibold ${
            buffer !== null && buffer <= 0 ? 'text-danger' : 'text-danger'
          }`}
        >
          {bufferText}
        </span>
      </div>
    </div>
  );
}
