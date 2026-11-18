import React, { useState } from 'react';
import {
  ProductListingRecord,
  StorefrontMetricsRecord,
} from '../data/operatorSeedData';
import { DollarSign, AlertTriangle, CheckCircle2, Repeat, Truck } from 'lucide-react';

interface UnitEconomicsViewProps {
  listings: ProductListingRecord[];
  storefronts: StorefrontMetricsRecord[];
}

export const UnitEconomicsView: React.FC<UnitEconomicsViewProps> = ({
  listings,
  storefronts,
}) => {
  const [selectedSkuId, setSelectedSkuId] = useState<string>(listings[0]?.id || '');
  const activeSku = listings.find((l) => l.id === selectedSkuId) || listings[0];

  // Interactive Margin Waterfall Overrides
  const [price, setPrice] = useState<number>(activeSku?.retailPrice || 189);
  const [cogs, setCogs] = useState<number>(activeSku?.cogs || 46);
  const [platformFeePct, setPlatformFeePct] = useState<number>(activeSku?.platformFeePct || 5.5);
  const [adCost, setAdCost] = useState<number>(activeSku?.adCostPerUnit || 38);
  const [logistics, setLogistics] = useState<number>(activeSku?.logisticsCost || 6.5);
  const [returnRatePct, setReturnRatePct] = useState<number>(4.2);

  // Private Domain (WeChat CRM) LTV Simulator
  const [wechatPoolSize, setWechatPoolSize] = useState<number>(85000);
  const [ninetyDayRepeatPct, setNinetyDayRepeatPct] = useState<number>(28.4);
  const [privateDomainAov, setPrivateDomainAov] = useState<number>(176);

  const handleSelectSku = (sku: ProductListingRecord) => {
    setSelectedSkuId(sku.id);
    setPrice(sku.retailPrice);
    setCogs(sku.cogs);
    setPlatformFeePct(sku.platformFeePct);
    setAdCost(sku.adCostPerUnit);
    setLogistics(sku.logisticsCost);
  };

  const platformFeeRmb = price * (platformFeePct / 100);
  const returnFrictionRmb = (price * (returnRatePct / 100)) * 0.22; // reverse logistics & damaged packaging loss
  const totalUnitCost = cogs + platformFeeRmb + adCost + logistics + returnFrictionRmb;
  const netProfitPerUnit = price - totalUnitCost;
  const netMarginPct = price > 0 ? (netProfitPerUnit / price) * 100 : 0;

  // Private Domain Zero-Ad-Spend Repeat GMV
  const repeatBuyers = Math.round(wechatPoolSize * (ninetyDayRepeatPct / 100));
  const privateDomainQuarterlyGmv = repeatBuyers * privateDomainAov;
  const savedAdSpend = Math.round(privateDomainQuarterlyGmv * 0.24);

  return (
    <div className="space-y-8">
      {/* Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Margin Protection, Cross-Platform Arbitrage & WeChat Private Domain · 单品毛利瀑布与私域复购
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
            SKU Unit Economics Waterfall & Private Domain LTV
          </h1>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {listings.map((sku) => (
            <button
              key={sku.id}
              onClick={() => handleSelectSku(sku)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeSku?.id === sku.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sku.platform} · ¥{sku.retailPrice}
            </button>
          ))}
        </div>
      </div>

      {/* Top Split: Interactive SKU Margin Waterfall + Cross-Platform Arbitrage Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Cols: Interactive Unit Economics Waterfall */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  01. Single-Unit Margin Waterfall Analysis (单品净利拆解瀑布)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Never pursue GMV at the expense of profitability. Stress-test every promotional price against full platform fees, ad CPA, and return friction.
                </p>
              </div>
              <div className="text-right font-mono tabular-nums">
                <span
                  className={`text-sm font-bold ${
                    netMarginPct >= 15
                      ? 'text-emerald-700'
                      : netMarginPct >= 0
                      ? 'text-amber-700'
                      : 'text-red-600'
                  }`}
                >
                  Net: ¥{netProfitPerUnit.toFixed(2)} ({netMarginPct.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Hand Price (¥)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  COGS 成本 (¥)
                </label>
                <input
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Plat. Fee (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={platformFeePct}
                  onChange={(e) => setPlatformFeePct(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ad CPA 推广 (¥)
                </label>
                <input
                  type="number"
                  value={adCost}
                  onChange={(e) => setAdCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Logistics (¥)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={logistics}
                  onChange={(e) => setLogistics(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Returns 退货 (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={returnRatePct}
                  onChange={(e) => setReturnRatePct(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Visual Cost Waterfall Rows */}
            <div className="mt-5 space-y-2.5 font-mono tabular-nums text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="font-sans font-medium text-slate-700">
                  1. Buyer Hand-Price Revenue (实收客单价)
                </span>
                <span className="font-semibold text-slate-900">¥{price.toFixed(2)} (100.0%)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-slate-600">
                <span className="font-sans">2. Manufacturing COGS (工厂出厂成本)</span>
                <span>
                  -¥{cogs.toFixed(2)} ({price > 0 ? ((cogs / price) * 100).toFixed(1) : '0.0'}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-slate-600">
                <span className="font-sans">
                  3. Platform Commission & Payment Fee ({platformFeePct}%)
                </span>
                <span>-¥{platformFeeRmb.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-slate-600">
                <span className="font-sans">
                  4. Paid Traffic Acquisition Cost per Unit (单均推广费)
                </span>
                <span>
                  -¥{adCost.toFixed(2)} ({price > 0 ? ((adCost / price) * 100).toFixed(1) : '0.0'}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-slate-600">
                <span className="font-sans">
                  5. Regional Warehouse & Express Fulfillment + Return Loss
                </span>
                <span>-¥{(logistics + returnFrictionRmb).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-300 text-sm font-bold">
                <span className="font-sans text-slate-900">Net Operating Profit per Unit (单笔净利)</span>
                <span
                  className={
                    netProfitPerUnit >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }
                >
                  ¥{netProfitPerUnit.toFixed(2)} ({netMarginPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs">
            {netProfitPerUnit >= 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-slate-600">
                  Unit economics positive: Ready to scale paid search & live room volume.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-red-600 font-medium">
                  Margin Warning: Negative unit profit (-¥{Math.abs(netProfitPerUnit).toFixed(2)}). Restructure as a multi-unit bundle or lower paid traffic CPA before running promotion.
                </span>
              </>
            )}
          </div>
        </section>

        {/* Right 5 Cols: WeChat Private Domain (私域运营) & Settlement Cycle Cash Flow */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-slate-700" />
              02. Private Domain CRM & 90-Day Repeat Engine (微信私域复购模型)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Convert one-time platform buyers into WeChat Mini Program & VIP group members to exceed the 25% 90-day repeat purchase benchmark.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  WeChat CRM Pool
                </label>
                <input
                  type="number"
                  step="5000"
                  value={wechatPoolSize}
                  onChange={(e) => setWechatPoolSize(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  90d Repeat Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={ninetyDayRepeatPct}
                  onChange={(e) =>
                    setNinetyDayRepeatPct(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Repeat AOV (¥)
                </label>
                <input
                  type="number"
                  value={privateDomainAov}
                  onChange={(e) => setPrivateDomainAov(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono tabular-nums text-xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-slate-600">90-Day Repeat Orders</span>
                <span className="font-semibold text-slate-900">
                  {repeatBuyers.toLocaleString()} orders
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-slate-600">Zero-Commission Private Domain GMV</span>
                <span className="font-semibold text-emerald-700">
                  ¥{privateDomainQuarterlyGmv.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-slate-600">Saved Platform Ad Acquisition Spend</span>
                <span className="font-semibold text-slate-900">
                  ¥{savedAdSpend.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Cash Flow & Logistics Settlement Summary */}
            <div className="mt-5 pt-4 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-700" />
                Supply Chain & Settlement Cycle Working Capital (账期与分仓管理)
              </div>
              <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                <div>
                  · <strong>Tmall / Taobao:</strong> ~10–15 days Alipay escrow until buyer delivery confirmation.
                </div>
                <div>
                  · <strong>JD Self-Operated (京东自营):</strong> 30–45 days net invoice settlement; multi-warehouse (华东/华南/华北/西南) required for 211 Next-Day badge.
                </div>
                <div>
                  · <strong>Pinduoduo / Douyin:</strong> 7–15 days post-receipt settlement; hold 3% reserve for campaign return waves.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
            Cross-Platform SKU Rule: Differentiate SKU packaging sizes (500ml Tmall Flagship vs 2×400ml PDD Value Pack vs 600ml JD Smart Pro) to eliminate direct price-comparison scraping.
          </div>
        </section>
      </div>
    </div>
  );
};
