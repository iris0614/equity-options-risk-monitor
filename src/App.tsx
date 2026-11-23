import { Header } from './components/Header';
import { ScenarioBar } from './components/ScenarioBar';
import { StageCards } from './components/StageCards';
import { TransmissionDiagram } from './components/TransmissionDiagram';
import { VolTermStructure } from './components/charts/VolTermStructure';
import { PutCallChart } from './components/charts/PutCallChart';
import { DealerExposureChart } from './components/charts/DealerExposureChart';
import { CompositePanel } from './components/charts/CompositeGauge';
import { IndicatorGrid } from './components/IndicatorGrid';
import { ChecklistPanel } from './components/ChecklistPanel';
import { ScoreTrace } from './components/ScoreTrace';
import { ConfigPanel } from './components/ConfigPanel';
import { Footer } from './components/Footer';
import { useRiskMonitor } from './hooks/useRiskMonitor';

export default function App() {
  const api = useRiskMonitor();
  const { model } = api;

  return (
    <div className="mx-auto min-h-screen w-full max-w-monitor px-3 py-3 md:px-4 md:py-4">
      <div className="flex flex-col gap-3">
        <Header
          asOf={api.asOf}
          score={model.score}
          stages={model.stages}
          customMode={api.customMode}
        />

        <ScenarioBar
          scenarioId={api.scenarioId}
          onSelect={api.applyScenario}
          onReset={api.resetBaseline}
          onExport={api.exportCsv}
          onImportFile={api.importCsv}
          onSaveSnapshot={() => {
            const name = window.prompt(
              '快照名称',
              `${api.scenarioId}-${new Date().toISOString().slice(0, 16)}`,
            );
            if (name) api.saveSnapshot(name);
          }}
        />

        <StageCards stages={model.stages} />

        <TransmissionDiagram links={model.transmission} />

        <div className="grid gap-3 lg:grid-cols-3">
          <VolTermStructure
            snap={api.indicators}
            series={api.series}
            asOf={api.asOf}
            vixTrigger={api.thresholds.vix.triggered}
          />
          <PutCallChart
            snap={api.indicators}
            thresholds={api.thresholds}
            asOf={api.asOf}
          />
          <DealerExposureChart
            snap={api.indicators}
            thresholds={api.thresholds}
            asOf={api.asOf}
          />
        </div>

        <CompositePanel
          score={model.score}
          series={api.series}
          asOf={api.asOf}
        />

        <IndicatorGrid score={model.score} onChange={api.updateIndicator} />

        <ChecklistPanel
          escalation={model.checklists.escalation}
          repair={model.checklists.repair}
          onToggleEsc={api.toggleManualEsc}
          onToggleRep={api.toggleManualRep}
        />

        <ScoreTrace score={model.score} weights={api.weights} />

        <ConfigPanel
          thresholds={api.thresholds}
          onThreshold={api.updateThreshold}
          snapshots={api.snapshots}
          onLoad={api.loadSnapshot}
          onRemove={api.removeSnapshot}
        />

        <Footer />
      </div>
    </div>
  );
}
