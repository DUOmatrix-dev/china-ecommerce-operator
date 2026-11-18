import React, { useState } from 'react';
import {
  StorefrontMetricsRecord,
  PlatformName,
  PLATFORM_ALGO_RULES,
} from '../data/operatorSeedData';
import { Edit3, Check, X, Copy, Plus, ArrowUpRight, AlertCircle } from 'lucide-react';

interface StorefrontOverviewViewProps {
  storefronts: StorefrontMetricsRecord[];
  selectedPlatform: PlatformName | 'All';
  onSelectPlatform: (p: PlatformName | 'All') => void;
  onUpdateStorefront: (updated: StorefrontMetricsRecord) => Promise<void>;
  onCopyMarkdownReport: () => void;
  copiedReport: boolean;
}

export const StorefrontOverviewView: React.FC<StorefrontOverviewViewProps> = ({
  storefronts,
  selectedPlatform,
  onSelectPlatform,
  onUpdateStorefront,
  onCopyMarkdownReport,
  copiedReport,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StorefrontMetricsRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const visibleStorefronts =
    selectedPlatform === 'All'
      ? storefronts
      : storefronts.filter((s) => s.platform === selectedPlatform);

  const totalGmv = visibleStorefronts.reduce((acc, s) => acc + s.monthlyGmv, 0);
  const totalOrders = visibleStorefronts.reduce((acc, s) => acc + s.orderVolume, 0);
  const totalAdSpend = visibleStorefronts.reduce((acc, s) => acc + s.adSpend, 0);
  const blendedRoi = totalAdSpend > 0 ? totalGmv * 0.31 / (totalAdSpend / 3.2) : 0;
  const actualBlendedRoas =
    totalAdSpend > 0
      ? visibleStorefronts.reduce((acc, s) => acc + s.adSpend * s.adRoi, 0) / totalAdSpend
      : 0;
  const avgConversion =
    visibleStorefronts.length > 0
      ? visibleStorefronts.reduce((acc, s) => acc + s.conversionRate, 0) /
        visibleStorefronts.length
      : 0;
  const avgRating =
    visibleStorefronts.length > 0
      ? visibleStorefronts.reduce((acc, s) => acc + s.storeRating, 0) /
        visibleStorefronts.length
      : 0;
  const avgReturnRate =
    visibleStorefronts.length > 0
      ? visibleStorefronts.reduce((acc, s) => acc + s.returnRate, 0) /
        visibleStorefronts.length
      : 0;
  const weightedLiveShare =
    totalGmv > 0
      ? visibleStorefronts.reduce(
          (acc, s) => acc + s.monthlyGmv * (s.liveCommerceGmvShare / 100),
          0
        ) /
        totalGmv *
        100
      : 0;

  const startEditing = (sf: StorefrontMetricsRecord) => {
    setEditingId(sf.id);
    setDraft({ ...sf });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const recalculatedAov =
        draft.orderVolume > 0 ? Math.round(draft.monthlyGmv / draft.orderVolume) : draft.avgOrderValue;
      await onUpdateStorefront({
        ...draft,
        avgOrderValue: recalculatedAov,
      });
      setEditingId(null);
      setDraft(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Workspace Filter & Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Multi-Platform Store Operations · 平台概览与流量结构
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
            Cross-Platform Storefront Performance & Traffic Architecture
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Interactive Segmented Platform Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['All', 'Taobao/Tmall', 'Pinduoduo', 'JD', 'Douyin Shop'] as const).map((plat) => (
              <button
                key={plat}
                onClick={() => onSelectPlatform(plat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedPlatform === plat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {plat === 'All' ? 'All Platforms' : plat}
              </button>
            ))}
          </div>

          <button
            onClick={onCopyMarkdownReport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            {copiedReport ? 'Copied Markdown Report' : 'Copy Markdown Report'}
          </button>
        </div>
      </div>

      {/* Executive Success Metrics Strip (Full-Width 5-Column Benchmark Grid) */}
      <section aria-label="Executive Benchmarks">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500">Monthly Gross GMV (月度总交易额)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2">
              ¥{totalGmv.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-700 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              <span>+18.4% MoM</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">Target &gt;15%</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500">Blended Advertising ROAS (综合投产比)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2">
              {actualBlendedRoas.toFixed(2)}:1
            </div>
            <div className="text-xs mt-2 flex items-center gap-1">
              <span
                className={
                  actualBlendedRoas >= 3.0 ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'
                }
              >
                {actualBlendedRoas >= 3.0 ? 'Exceeds 3.0:1 Floor' : 'Below 3.0:1 Floor'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-mono tabular-nums">
                Spend ¥{(totalAdSpend / 1000).toFixed(0)}K
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500">Store DSR / Experience Rating</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2">
              {avgRating.toFixed(2)} / 5.0
            </div>
            <div className="text-xs mt-2 flex items-center gap-1">
              <span
                className={
                  avgRating >= 4.8 ? 'text-emerald-700 font-medium' : 'text-red-600 font-medium'
                }
              >
                {avgRating >= 4.8 ? 'Healthy (4.8+ Benchmark)' : 'Action Needed (<4.8)'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-mono tabular-nums">
                CVR {avgConversion.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500">Order Return Rate (退货退款率)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2">
              {avgReturnRate.toFixed(1)}%
            </div>
            <div className="text-xs mt-2 flex items-center gap-1">
              <span
                className={
                  avgReturnRate <= 5.0 ? 'text-emerald-700 font-medium' : 'text-red-600 font-medium'
                }
              >
                {avgReturnRate <= 5.0 ? 'Within <5.0% Cap' : 'Exceeds 5.0% Cap'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-mono tabular-nums">
                {totalOrders.toLocaleString()} Orders
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500">Live Commerce Share (直播占比)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2">
              {weightedLiveShare.toFixed(1)}%
            </div>
            <div className="text-xs mt-2 flex items-center gap-1">
              <span
                className={
                  weightedLiveShare >= 20.0
                    ? 'text-emerald-700 font-medium'
                    : 'text-amber-700 font-medium'
                }
              >
                {weightedLiveShare >= 20.0 ? 'Target 20%+ Met' : 'Scale Live Sessions'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">Blended Share</span>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Platform Operations Comparison Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              01. Multi-Platform Store Operations Matrix (平台核心指标对比)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click Edit Row on any storefront to update monthly actuals, conversion rates, or ad spend.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Showing {visibleStorefronts.length} of {storefronts.length} active storefronts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                <th className="py-3 px-4">Platform & Storefront</th>
                <th className="py-3 px-4 text-right">Monthly GMV</th>
                <th className="py-3 px-4 text-right">Orders</th>
                <th className="py-3 px-4 text-right">AOV (客单价)</th>
                <th className="py-3 px-4 text-right">Conv. Rate</th>
                <th className="py-3 px-4 text-right">Store Rating</th>
                <th className="py-3 px-4 text-right">Ad Spend (ROAS)</th>
                <th className="py-3 px-4 text-right">Return Rate</th>
                <th className="py-3 px-4 text-right">90d Repeat</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {visibleStorefronts.map((sf) => {
                const isEditing = editingId === sf.id && draft !== null;
                return (
                  <tr
                    key={sf.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{sf.platform}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{sf.brandName}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-slate-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.monthlyGmv}
                          onChange={(e) =>
                            setDraft({ ...draft, monthlyGmv: Number(e.target.value) || 0 })
                          }
                          className="w-28 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                        />
                      ) : (
                        `¥${sf.monthlyGmv.toLocaleString()}`
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft.orderVolume}
                          onChange={(e) =>
                            setDraft({ ...draft, orderVolume: Number(e.target.value) || 0 })
                          }
                          className="w-24 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                        />
                      ) : (
                        sf.orderVolume.toLocaleString()
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                      ¥{sf.avgOrderValue}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.05"
                          value={draft.conversionRate}
                          onChange={(e) =>
                            setDraft({ ...draft, conversionRate: Number(e.target.value) || 0 })
                          }
                          className="w-20 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                        />
                      ) : (
                        <span
                          className={
                            sf.conversionRate >= 3.5 ? 'text-emerald-700 font-medium' : 'text-slate-900'
                          }
                        >
                          {sf.conversionRate.toFixed(2)}%
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          max="5"
                          value={draft.storeRating}
                          onChange={(e) =>
                            setDraft({ ...draft, storeRating: Number(e.target.value) || 0 })
                          }
                          className="w-20 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                        />
                      ) : (
                        <span
                          className={
                            sf.storeRating >= 4.85 ? 'text-emerald-700 font-medium' : 'text-amber-700'
                          }
                        >
                          {sf.storeRating.toFixed(2)}/5.0
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={draft.adSpend}
                            onChange={(e) =>
                              setDraft({ ...draft, adSpend: Number(e.target.value) || 0 })
                            }
                            className="w-24 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                          />
                          <input
                            type="number"
                            step="0.05"
                            value={draft.adRoi}
                            onChange={(e) =>
                              setDraft({ ...draft, adRoi: Number(e.target.value) || 0 })
                            }
                            className="w-16 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-900">¥{(sf.adSpend / 1000).toFixed(0)}K</span>
                          <span className="text-slate-400 mx-1">·</span>
                          <span
                            className={
                              sf.adRoi >= 3.0 ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'
                            }
                          >
                            {sf.adRoi.toFixed(2)}:1
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={draft.returnRate}
                          onChange={(e) =>
                            setDraft({ ...draft, returnRate: Number(e.target.value) || 0 })
                          }
                          className="w-16 px-2 py-1 text-right text-xs border border-slate-300 rounded-md"
                        />
                      ) : (
                        <span
                          className={
                            sf.returnRate <= 5.0 ? 'text-slate-700' : 'text-red-600 font-medium'
                          }
                        >
                          {sf.returnRate.toFixed(1)}%
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                      {sf.repeatPurchaseRate.toFixed(1)}%
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Save changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(sf)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors whitespace-nowrap shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Row
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

      {/* Traffic Breakdown (流量结构) & Platform Algorithm Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Traffic Structure Breakdown */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              02. Storefront Traffic Structure (流量结构拆解)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution across Organic Search, Paid Search (直通车/多多搜索/京速推), Feeds, Live Commerce, Short Video, and Private Domain.
            </p>

            <div className="mt-6 space-y-6">
              {visibleStorefronts.map((sf) => (
                <div key={sf.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">
                      {sf.platform} · <span className="font-normal text-slate-500">{sf.brandName}</span>
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">
                      Live Share {sf.liveCommerceGmvShare.toFixed(1)}% of GMV
                    </span>
                  </div>

                  {/* Multi-Segment Progress Bar */}
                  <div className="h-3 w-full rounded-md overflow-hidden flex bg-slate-100">
                    <div
                      style={{ width: `${sf.organicSearchPct}%` }}
                      className="bg-slate-800"
                      title={`Organic Search: ${sf.organicSearchPct}%`}
                    />
                    <div
                      style={{ width: `${sf.paidSearchPct}%` }}
                      className="bg-red-600"
                      title={`Paid Search: ${sf.paidSearchPct}%`}
                    />
                    <div
                      style={{ width: `${sf.recommendationFeedPct}%` }}
                      className="bg-amber-500"
                      title={`Recommendation Feed: ${sf.recommendationFeedPct}%`}
                    />
                    <div
                      style={{ width: `${sf.liveCommercePct}%` }}
                      className="bg-emerald-600"
                      title={`Live Commerce: ${sf.liveCommercePct}%`}
                    />
                    <div
                      style={{ width: `${sf.shortVideoPct}%` }}
                      className="bg-sky-600"
                      title={`Short Video: ${sf.shortVideoPct}%`}
                    />
                    <div
                      style={{ width: `${sf.privateDomainPct}%` }}
                      className="bg-indigo-600"
                      title={`Private Domain / Repeat: ${sf.privateDomainPct}%`}
                    />
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 text-xs text-slate-600 font-mono tabular-nums">
                    <div>Organic: {sf.organicSearchPct}%</div>
                    <div>Paid: {sf.paidSearchPct}%</div>
                    <div>Feed: {sf.recommendationFeedPct}%</div>
                    <div>Live: {sf.liveCommercePct}%</div>
                    <div>Video: {sf.shortVideoPct}%</div>
                    <div>Repeat: {sf.privateDomainPct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-800 inline-block" /> Organic Search
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-red-600 inline-block" /> Paid Search (直通车/搜索)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" /> Recommendation Feed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" /> Live Commerce
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-sky-600 inline-block" /> Short Video / Seeding
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" /> WeChat Private Domain
            </span>
          </div>
        </section>

        {/* Platform Operational Diagnosis & Playbook */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              03. Operator Diagnostic & Cross-Platform Playbook
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable diagnostics grounded in platform algorithm rules and unit economics.
            </p>

            <div className="mt-5 divide-y divide-slate-200">
              {(['Taobao/Tmall', 'Pinduoduo', 'JD', 'Douyin Shop'] as PlatformName[]).map((plat) => {
                const rule = PLATFORM_ALGO_RULES[plat];
                return (
                  <div key={plat} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{plat}</span>
                      <span className="text-slate-500">{rule.tool}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {rule.buyerPsychology}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      Fee & Cycle: {rule.commissionNote}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900">Operator Rule:</strong> Never copy-paste titles or SKU pricing across Tmall, Pinduoduo, and JD. Repackage Pinduoduo SKUs as value twin-packs to protect flagship AOV on Tmall and JD.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
