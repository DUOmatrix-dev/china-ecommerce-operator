import React, { useState } from 'react';
import {
  AdCampaignRecord,
  PlatformName,
} from '../data/operatorSeedData';
import { TrendingUp, Video, Users, Check, Edit3, X } from 'lucide-react';

interface AdAndLiveViewProps {
  adCampaigns: AdCampaignRecord[];
  onUpdateAdCampaign: (campaign: AdCampaignRecord) => Promise<void>;
}

const WEEKLY_OPTIMIZATION_CYCLE = [
  {
    day: 'Monday · Data Audit & Culling',
    focus: 'Review past 7-day keyword and creative ROAS; pause bottom 20% underperformers with ROAS below platform floor.',
  },
  {
    day: 'Tuesday–Thursday · Creative & Keyword Testing',
    focus: 'Launch 5 new main-image creatives per Wanxiangtai/Qianchuan group; test seasonal long-tail search terms.',
  },
  {
    day: 'Friday · Bid Scaling for Weekend Traffic',
    focus: 'Raise bids +15% on proven high-conversion keywords (ROAS > 3.5:1) ahead of Friday evening shopping peak.',
  },
  {
    day: 'Weekend · Automated Guardrails',
    focus: 'Monitor automated smart-bidding pacing (货品加速 / 拉新快) with minimal manual intervention to preserve algorithm learning.',
  },
];

export const AdAndLiveView: React.FC<AdAndLiveViewProps> = ({
  adCampaigns,
  onUpdateAdCampaign,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformName | 'All'>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdCampaignRecord | null>(null);

  // Live Commerce & KOL Incremental ROI Simulator State
  const [kolPitFee, setKolPitFee] = useState<number>(25000);
  const [kolCommissionPct, setKolCommissionPct] = useState<number>(20);
  const [kolGrossGmv, setKolGrossGmv] = useState<number>(180000);
  const [liveReturnRatePct, setLiveReturnRatePct] = useState<number>(12);
  const [skuGrossMarginPct, setSkuGrossMarginPct] = useState<number>(62);

  const visibleCampaigns =
    selectedPlatform === 'All'
      ? adCampaigns
      : adCampaigns.filter((c) => c.platform === selectedPlatform);

  const totalSpend = visibleCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalGmv = visibleCampaigns.reduce((acc, c) => acc + c.gmvGenerated, 0);
  const overallRoas = totalSpend > 0 ? totalGmv / totalSpend : 0;

  // KOL True Incremental Profit Math
  const netSettledGmv = kolGrossGmv * (1 - liveReturnRatePct / 100);
  const kolCommissionCost = netSettledGmv * (kolCommissionPct / 100);
  const grossProfitBeforeKol = netSettledGmv * (skuGrossMarginPct / 100);
  const netIncrementalProfit = grossProfitBeforeKol - kolPitFee - kolCommissionCost;
  const effectiveKolRoas =
    kolPitFee + kolCommissionCost > 0
      ? netSettledGmv / (kolPitFee + kolCommissionCost)
      : 0;

  const startEdit = (item: AdCampaignRecord) => {
    setEditingId(item.id);
    setDraft({ ...item });
  };

  const saveEdit = async () => {
    if (!draft) return;
    await onUpdateAdCampaign(draft);
    setEditingId(null);
    setDraft(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Paid Traffic & Live Commerce Operations · 直通车 · 万相台 · 多多搜索 · 巨量千川 · 直播带货
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
            Platform Advertising Stack & Live Commerce ROI Engine
          </h1>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Taobao/Tmall', 'Pinduoduo', 'JD', 'Douyin Shop'] as const).map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedPlatform === plat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {plat === 'All' ? 'All Ad Stacks' : plat}
            </button>
          ))}
        </div>
      </div>

      {/* Ad Stack Performance Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              01. Platform Advertising Stack ROAS Matrix (全域推广工具投产比)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Target ROAS: 3.0:1+ on Tmall/JD/Douyin · 2.0:1+ on Pinduoduo high-velocity search.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-slate-700">
            Total 30d Spend: <strong>¥{totalSpend.toLocaleString()}</strong> · Attributed GMV:{' '}
            <strong>¥{totalGmv.toLocaleString()}</strong> · Blended ROAS:{' '}
            <strong className={overallRoas >= 3.0 ? 'text-emerald-700' : 'text-amber-700'}>
              {overallRoas.toFixed(2)}:1
            </strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                <th className="py-3 px-4">Platform & Tool</th>
                <th className="py-3 px-4">Bidding & Audience Strategy</th>
                <th className="py-3 px-4 text-right">Daily Budget</th>
                <th className="py-3 px-4 text-right">30d Spend</th>
                <th className="py-3 px-4 text-right">30d GMV</th>
                <th className="py-3 px-4 text-right">ROAS</th>
                <th className="py-3 px-4 text-right">CTR / CVR</th>
                <th className="py-3 px-4 text-right">State</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {visibleCampaigns.map((camp) => {
                const isEditing = editingId === camp.id && draft !== null;
                const roas = camp.spend > 0 ? camp.gmvGenerated / camp.spend : 0;
                const targetFloor = camp.platform === 'Pinduoduo' ? 2.0 : 3.0;

                return (
                  <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{camp.toolName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{camp.platform}</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">
                      {camp.campaignFocus}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.dailyBudget}
                          onChange={(e) =>
                            setDraft({ ...draft, dailyBudget: Number(e.target.value) || 0 })
                          }
                          className="w-24 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                        />
                      ) : (
                        `¥${camp.dailyBudget.toLocaleString()}`
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.spend}
                          onChange={(e) =>
                            setDraft({ ...draft, spend: Number(e.target.value) || 0 })
                          }
                          className="w-24 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                        />
                      ) : (
                        `¥${camp.spend.toLocaleString()}`
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-slate-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.gmvGenerated}
                          onChange={(e) =>
                            setDraft({ ...draft, gmvGenerated: Number(e.target.value) || 0 })
                          }
                          className="w-28 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                        />
                      ) : (
                        `¥${camp.gmvGenerated.toLocaleString()}`
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span
                        className={
                          roas >= targetFloor
                            ? 'text-emerald-700 font-semibold'
                            : 'text-amber-700 font-semibold'
                        }
                      >
                        {roas.toFixed(2)}:1
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs text-slate-600">
                      {camp.ctr.toFixed(2)}% / {camp.cvr.toFixed(2)}%
                    </td>

                    <td className="py-3.5 px-4 text-right text-xs font-medium">
                      {isEditing ? (
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              status: e.target.value as AdCampaignRecord['status'],
                            })
                          }
                          className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white"
                        >
                          <option value="Scaling">Scaling</option>
                          <option value="Testing">Testing</option>
                          <option value="Paused">Paused</option>
                        </select>
                      ) : (
                        <span
                          className={
                            camp.status === 'Scaling'
                              ? 'text-emerald-700'
                              : camp.status === 'Testing'
                              ? 'text-amber-700'
                              : 'text-slate-400'
                          }
                        >
                          {camp.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={saveEdit}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setDraft(null);
                            }}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(camp)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md whitespace-nowrap shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Adjust Bid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom 2-Column Split: Live Commerce & KOL Incremental ROI Simulator + Universal Optimization Cycle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Cols: Live Commerce & KOL True Incremental ROI Calculator */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-slate-700" />
                02. Live Commerce & KOL Incremental ROI Evaluator (达人坑位费与净利测算)
              </h2>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                Taobao Live · Douyin · Kuaishou
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluate influencer live sessions on true net incremental profit after fixed pit fees (坑位费), commission splits, and live-room return rates.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Slot Pit Fee 坑位费 (¥)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={kolPitFee}
                  onChange={(e) => setKolPitFee(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Commission 佣金 (%)
                </label>
                <input
                  type="number"
                  value={kolCommissionPct}
                  onChange={(e) =>
                    setKolCommissionPct(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Live Gross GMV (¥)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={kolGrossGmv}
                  onChange={(e) => setKolGrossGmv(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Live Return Rate (%)
                </label>
                <input
                  type="number"
                  value={liveReturnRatePct}
                  onChange={(e) =>
                    setLiveReturnRatePct(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Product Margin (%)
                </label>
                <input
                  type="number"
                  value={skuGrossMarginPct}
                  onChange={(e) =>
                    setSkuGrossMarginPct(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono tabular-nums">
              <div>
                <div className="text-xs font-sans text-slate-500">Settled Net GMV</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  ¥{Math.round(netSettledGmv).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-sans text-slate-500">Total KOL Cost</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  ¥{Math.round(kolPitFee + kolCommissionCost).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-sans text-slate-500">Net KOL ROAS</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {effectiveKolRoas.toFixed(2)}:1
                </div>
              </div>
              <div>
                <div className="text-xs font-sans text-slate-500">Net Profit / Loss</div>
                <div
                  className={`text-base font-bold mt-1 ${
                    netIncrementalProfit >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {netIncrementalProfit >= 0 ? '+' : ''}¥
                  {Math.round(netIncrementalProfit).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600">
            <strong>Live Room Product Sequencing:</strong> Rotate every 15 minutes — 1. 福利款 (Flash Welfare Hook) → 2. 引流款 (High-Volume Traffic Driver) → 3. 利润款 (Core Margin Hero) → 4. 形象款 (High-AOV Flagship Anchor).
          </div>
        </section>

        {/* Right 5 Cols: Zhitongche 40/30/30 Rule & Weekly Optimization Cycle */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              03. Weekly Ad Optimization Discipline (周度推广优化节奏)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Zhitongche (直通车) 40% Proven Converters / 30% Testing / 30% Brand Terms allocation.
            </p>

            <div className="mt-4 divide-y divide-slate-200">
              {WEEKLY_OPTIMIZATION_CYCLE.map((item) => (
                <div key={item.day} className="py-3 first:pt-0 last:pb-0">
                  <div className="text-xs font-semibold text-slate-900">{item.day}</div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.focus}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
            Monthly Audit: Reallocate budget across Tmall, Pinduoduo, JD, and Douyin based on marginal customer acquisition cost and 90-day repeat purchase LTV.
          </div>
        </section>
      </div>
    </div>
  );
};
