import React, { useState } from 'react';
import {
  CampaignTaskRecord,
  CampaignPhase,
} from '../data/operatorSeedData';
import { Check, Plus, Calculator, Clock, ShieldAlert } from 'lucide-react';

interface CampaignWarRoomViewProps {
  tasks: CampaignTaskRecord[];
  onToggleTask: (task: CampaignTaskRecord) => Promise<void>;
  onAddTask: (newTask: Omit<CampaignTaskRecord, 'id' | 'ownerId'>) => Promise<void>;
}

const PHASES: CampaignPhase[] = [
  'T-60 Days: Strategic Planning',
  'T-30 Days: Preparation Phase',
  'T-7 Days: Warm-Up (蓄水期)',
  'T-Day: Execution (爆发期)',
  'T+1 to T+7: Post-Campaign',
];

const HOURLY_WAVE_PLAYBOOK = [
  {
    window: '00:00 – 02:00 · Midnight Deposit Final Payment Surge (尾款爆发波)',
    action: 'Unlock pre-sale balance payments; boost Zhitongche & Wanxiangtai cart-retargeting bids +35%; trigger First-1000-Orders full-size gift.',
    targetShare: '38% of Day-1 GMV',
  },
  {
    window: '10:00 – 12:00 · Morning Commute Flash Drop (早间秒杀波)',
    action: 'Drop limited 500-unit PDD & Taobao flash bundle; switch live room to Dual-Host high-energy demonstration.',
    targetShare: '14% of Day-1 GMV',
  },
  {
    window: '14:00 – 16:00 · Afternoon Category Coupon Push (午后蓄水波)',
    action: 'Send WeChat Private Domain & Tmall Member SMS alert for expiring ¥300-¥50 stacking coupons; audit warehouse dispatch queue.',
    targetShare: '12% of Day-1 GMV',
  },
  {
    window: '20:00 – 24:00 · Prime-Time Marathon Finale (晚8点黄金爆发波)',
    action: 'Peak KOL simulcast & Brand Live Room CEO red-packet drop; reallocate remaining ad budget to top-3 ROAS SKUs.',
    targetShare: '36% of Day-1 GMV',
  },
];

export const CampaignWarRoomView: React.FC<CampaignWarRoomViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<CampaignPhase | 'All'>('All');
  const [gmvTarget, setGmvTarget] = useState<number>(12500000);
  const [targetAov, setTargetAov] = useState<number>(215);
  const [targetCvr, setTargetCvr] = useState<number>(4.5);
  const [depositAmount, setDepositAmount] = useState<number>(20);
  const [depositOffset, setDepositOffset] = useState<number>(50);
  const [crossStoreThreshold, setCrossStoreThreshold] = useState<number>(300);
  const [crossStoreDiscount, setCrossStoreDiscount] = useState<number>(50);
  const [shelfPrice, setShelfPrice] = useState<number>(329);

  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPhase, setNewPhase] = useState<CampaignPhase>('T-30 Days: Preparation Phase');
  const [newCategory, setNewCategory] = useState('Traffic & Ads');
  const [newPriority, setNewPriority] = useState<'Critical' | 'High' | 'Standard'>('High');
  const [adding, setAdding] = useState(false);

  const visibleTasks =
    selectedPhase === 'All'
      ? tasks
      : tasks.filter((t) => t.phase === selectedPhase);

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Reverse-Engineered Campaign Math
  const requiredOrders = targetAov > 0 ? Math.ceil(gmvTarget / targetAov) : 0;
  const requiredVisitors =
    targetCvr > 0 ? Math.ceil(requiredOrders / (targetCvr / 100)) : 0;
  const safetyStockUnits = Math.ceil(requiredOrders * 1.18); // 18% safety buffer to prevent overselling penalty
  const csAgentsRequired = Math.max(4, Math.ceil(requiredOrders / 3200));

  // Pre-Sale & Cross-Store Stacking Effective Price Math
  const depositBenefit = Math.max(0, depositOffset - depositAmount);
  const crossStoreApplies = shelfPrice >= crossStoreThreshold ? crossStoreDiscount : 0;
  const finalBuyerPrice = Math.max(
    0,
    shelfPrice - depositBenefit - crossStoreApplies
  );
  const effectiveDiscountPct =
    shelfPrice > 0 ? (((shelfPrice - finalBuyerPrice) / shelfPrice) * 100).toFixed(1) : '0.0';

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await onAddTask({
        campaignName: 'Double 11 (双11) Global Shopping Festival',
        phase: newPhase,
        title: newTitle.trim().slice(0, 160),
        category: newCategory,
        completed: false,
        priority: newPriority,
      });
      setNewTitle('');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            618 & Double 11 Campaign Engineering · 大促作战室与预售满减推演
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
            Festival Campaign Battle Plan & Mechanics Simulator
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            <button
              onClick={() => setSelectedPhase('All')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedPhase === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Phases ({completedCount}/{tasks.length})
            </button>
            {PHASES.map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedPhase === phase
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {phase.split(':')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 2-Column Split: Reverse-Engineered GMV Target Calculator + Pre-Sale Mechanics Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 6 Cols: Reverse-Engineered GMV & Inventory Capacity Planner */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-slate-700" />
                01. Target GMV Reverse-Engineering (大促目标倒推模型)
              </h2>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                GMV = UV × CVR × AOV
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Set campaign GMV target at T-60 days and calculate required traffic, safety stock, and CS staffing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Campaign GMV Target (¥)
                </label>
                <input
                  type="number"
                  step="500000"
                  value={gmvTarget}
                  onChange={(e) => setGmvTarget(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target AOV 客单价 (¥)
                </label>
                <input
                  type="number"
                  value={targetAov}
                  onChange={(e) => setTargetAov(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Conversion (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetCvr}
                  onChange={(e) => setTargetCvr(Math.max(0.1, Number(e.target.value) || 0.1))}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500">Required Orders</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {requiredOrders.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Required UV Traffic</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {requiredVisitors.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Safety Stock (+18%)</div>
                <div className="text-lg font-bold font-mono tabular-nums text-emerald-700 mt-1">
                  {safetyStockUnits.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">CS Shift Staffing</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {csAgentsRequired} Specialists
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 text-xs text-slate-500">
            Inventory Discipline: Lock factory production orders at T-45 days. Overselling during Double 11 incurs a 5%–30% Tmall platform deposit penalty.
          </div>
        </section>

        {/* Right 6 Cols: Pre-Sale Deposit Multiplier & Cross-Store Stacking Calculator */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                02. Pre-Sale & Cross-Store Mechanics (预售定金膨胀 + 跨店满减)
              </h2>
              <span className="text-xs font-mono tabular-nums text-red-600 font-semibold">
                Final Price: ¥{finalBuyerPrice} (-{effectiveDiscountPct}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate stacked campaign discounts (预售定金立减 + 跨店满300减50) to verify price competitiveness and prevent accidental negative margins.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Campaign Price (¥)
                </label>
                <input
                  type="number"
                  value={shelfPrice}
                  onChange={(e) => setShelfPrice(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Deposit 定金 (¥)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Offsets 抵扣 (¥)
                </label>
                <input
                  type="number"
                  value={depositOffset}
                  onChange={(e) => setDepositOffset(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  满减 Threshold (¥)
                </label>
                <input
                  type="number"
                  value={crossStoreThreshold}
                  onChange={(e) =>
                    setCrossStoreThreshold(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  满减 Deduction (¥)
                </label>
                <input
                  type="number"
                  value={crossStoreDiscount}
                  onChange={(e) =>
                    setCrossStoreDiscount(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs text-slate-600 font-mono tabular-nums">
                <div>
                  Step 1 (T-7d Pre-Sale): Buyer pays Deposit ¥{depositAmount} (expands to ¥{depositOffset}, net benefit -¥{depositBenefit})
                </div>
                <div>
                  Step 2 (T-Day Wave 1): Cross-store滿{crossStoreThreshold}减{crossStoreDiscount} deducts -¥{crossStoreApplies}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">Buyer Hand-Price (到手价)</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  ¥{finalBuyerPrice}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
            Compliance Check: Tmall & JD require the campaign Hand-Price (到手价) to be lower than or equal to the lowest recorded transaction price in the preceding 30 days (最低价校验).
          </div>
        </section>
      </div>

      {/* Middle Section: Interactive T-60 to T+7 Battle Plan Checklist & Task Creator */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              03. Campaign Execution Checklist (T-60 Days to T+7 Retention)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track operational readiness across Merchandising, Traffic & Ads, Live Commerce, Inventory & CS, and Post-Campaign Retention.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums font-medium text-slate-900">
            Campaign Readiness: {completionPct}% ({completedCount} of {tasks.length} complete)
          </div>
        </div>

        {/* Add Custom Battle Plan Task Form */}
        <form
          onSubmit={handleCreateTask}
          className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4 pb-5 border-b border-slate-200"
        >
          <div className="md:col-span-5">
            <input
              type="text"
              maxLength={160}
              placeholder="Add campaign milestone (e.g., Lock Top-3 Douyin KOL live pit slots)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={newPhase}
              onChange={(e) => setNewPhase(e.target.value as CampaignPhase)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            >
              <option value="Merchandising">Merchandising</option>
              <option value="Traffic & Ads">Traffic & Ads</option>
              <option value="Live Commerce">Live Commerce</option>
              <option value="Inventory & CS">Inventory & CS</option>
              <option value="Retention">Retention</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <select
              value={newPriority}
              onChange={(e) =>
                setNewPriority(e.target.value as 'Critical' | 'High' | 'Standard')
              }
              className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Standard">Standard</option>
            </select>
            <button
              type="submit"
              disabled={adding || !newTitle.trim()}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </form>

        {/* Checklist Items */}
        <div className="divide-y divide-slate-200 mt-2">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task)}
              className="py-3.5 flex items-start justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  className={`mt-0.5 w-4 h-4 rounded-xs flex items-center justify-center border shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>
                <div>
                  <div
                    className={`text-sm font-medium ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </div>
                  {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">{task.phase}</span>
                    <span aria-hidden="true">·</span>
                    <span>{task.category}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        task.priority === 'Critical'
                          ? 'text-red-600 font-medium'
                          : task.priority === 'High'
                          ? 'text-amber-700 font-medium'
                          : 'text-slate-500'
                      }
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400 shrink-0">
                {task.completed ? 'DONE' : 'PENDING'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Section: T-Day Outbreak Wave (爆发期) Hourly Pacing Schedule */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-700" />
              04. T-Day War Room Hourly Flash-Drop & Bidding Schedule (爆发日分时作战表)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Synchronized ad bid multipliers, flash deal drops (10am, 2pm, 8pm, midnight), and live commerce marathon handoffs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {HOURLY_WAVE_PLAYBOOK.map((wave) => (
            <div
              key={wave.window}
              className="p-4 border border-slate-200 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-slate-900 leading-snug">
                  {wave.window}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {wave.action}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-mono tabular-nums">
                <span className="text-slate-500">GMV Pacing Share</span>
                <span className="font-semibold text-slate-900">{wave.targetShare}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
