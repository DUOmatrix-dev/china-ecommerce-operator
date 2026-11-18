import React, { useState } from 'react';
import {
  ProductListingRecord,
  PlatformName,
  PLATFORM_ALGO_RULES,
  GENERATED_IMAGES,
} from '../data/operatorSeedData';
import { Check, Copy, Plus, Sparkles, Image as ImageIcon, Layers } from 'lucide-react';

interface ListingStudioViewProps {
  listings: ProductListingRecord[];
  onSaveListing: (listing: ProductListingRecord, isNew: boolean) => Promise<void>;
}

const DETAIL_PAGE_SECTIONS = [
  {
    step: '01. Core Value Proposition Banner (3-Second Hook)',
    benchmark: 'Bounce rate < 18%',
    checklist: 'Single unmistakable promise + core visual anchor above the fold on mobile.',
  },
  {
    step: '02. Problem / Solution Framework with Lifestyle Imagery',
    benchmark: 'Dwell time +12s',
    checklist: 'Contrast everyday pain point against immediate visual demonstration of the product solving it.',
  },
  {
    step: '03. Product Specifications & Material Authority',
    benchmark: 'Trust conversion +1.4%',
    checklist: 'Highlight medical-grade 316L / cold-pressed botanical extraction specs with close-up macro proof.',
  },
  {
    step: '04. Indirect Comparison Matrix vs. Ordinary Market Alternatives',
    benchmark: 'Price justification',
    checklist: 'Compare thermal retention / absorption speed vs generic alternatives without naming rival trademarks.',
  },
  {
    step: '05. Verified Buyer Reviews & KOL Social Proof Showcase',
    benchmark: 'Add-to-cart +2.1%',
    checklist: 'Curate real buyer unboxing photos, repeat purchase rate, and SGS/dermatologist certificates.',
  },
  {
    step: '06. Usage Instructions & Care Guide',
    benchmark: 'Return rate -0.8%',
    checklist: 'Set clear expectations on cleaning, temperature care, or skin patch testing to prevent post-sale returns.',
  },
  {
    step: '07. Brand Story & Flagship Fulfillment Guarantees',
    benchmark: 'DSR Rating 4.9+',
    checklist: 'Display warehouse dispatch speed, 211 Next-Day / Freight Return Insurance (运费险).',
  },
  {
    step: '08. Top 5 Purchase Objection FAQ',
    benchmark: 'Silent order ratio > 68%',
    checklist: 'Pre-emptively answer sizing, gifting packaging, warranty, and campaign price-match rules.',
  },
];

export const ListingStudioView: React.FC<ListingStudioViewProps> = ({
  listings,
  onSaveListing,
}) => {
  const [selectedId, setSelectedId] = useState<string>(listings[0]?.id || '');
  const [activeSlot, setActiveSlot] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [imgFallback, setImgFallback] = useState<Record<string, boolean>>({});
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [saving, setSaving] = useState(false);
  const [auditedSteps, setAuditedSteps] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false,
    7: false,
  });

  const currentListing =
    listings.find((l) => l.id === selectedId) || listings[0];

  const [formState, setFormState] = useState<ProductListingRecord>(
    currentListing || {
      id: 'sku_custom_1',
      ownerId: '',
      skuCode: 'AUR-NEW-01',
      productName: 'New Flagship Product',
      platform: 'Taobao/Tmall',
      roleTag: '利润款 Profit Item',
      brandKeyword: 'AURUM',
      coreKeyword: '保温杯女',
      attributeKeyword: '316不锈钢',
      sellingPoint: '大容量便携',
      scenarioKeyword: '学生上班族2026新款',
      optimizedTitle: 'AURUM保温杯女316不锈钢大容量便携学生上班族2026新款',
      retailPrice: 169,
      cogs: 42,
      platformFeePct: 5.0,
      adCostPerUnit: 35,
      logisticsCost: 6.0,
      slot1Text: 'Clean product on neutral background, mobile-readable callout',
      slot2Text: 'Single core benefit with high-contrast headline overlay',
      slot3Text: 'Real-life commuter and office desk usage scenario',
      slot4Text: '100,000+ units sold & SGS inspection certification',
      slot5Text: 'Limited campaign offer: Deposit ¥20 offsets ¥50',
      imageKey: 'thermos',
    }
  );

  const handleSelectListing = (listing: ProductListingRecord) => {
    setSelectedId(listing.id);
    setFormState({ ...listing });
  };

  const handleCreateNewDraft = () => {
    const newId = `sku_${Date.now()}`;
    const newListing: ProductListingRecord = {
      id: newId,
      ownerId: currentListing?.ownerId || '',
      skuCode: `AUR-${Math.floor(100 + Math.random() * 900)}`,
      productName: 'Custom Multi-Platform SKU',
      platform: 'Taobao/Tmall',
      roleTag: '引流款 Traffic Driver',
      brandKeyword: 'AURUM奥伦',
      coreKeyword: '纯钛保温杯',
      attributeKeyword: '316L医用级内胆',
      sellingPoint: '超轻便24小时锁温',
      scenarioKeyword: '通勤车载伴手礼盒',
      optimizedTitle: 'AURUM奥伦纯钛保温杯316L医用级内胆超轻便24小时锁温通勤车载伴手礼盒',
      retailPrice: 159,
      cogs: 39,
      platformFeePct: 5.0,
      adCostPerUnit: 30,
      logisticsCost: 6.0,
      slot1Text: 'Hero shot on clean stone surface with 316L Titanium badge',
      slot2Text: 'Ultra-lightweight 210g body — lighter than a smartphone',
      slot3Text: 'Outdoor hiking & urban coffee shop carry scenario',
      slot4Text: '99.4% Positive Rating · Official Flagship Authenticity Guarantee',
      slot5Text: '618 / Double 11 Flash Offer: Free Gift Box + Freight Insurance',
      imageKey: 'thermos',
    };
    setSelectedId(newId);
    setFormState(newListing);
  };

  const assembleFormulaTitle = () => {
    const assembled = `${formState.brandKeyword}${formState.coreKeyword}${formState.attributeKeyword}${formState.sellingPoint}${formState.scenarioKeyword}`.slice(
      0,
      120
    );
    setFormState({ ...formState, optimizedTitle: assembled });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isNew = !listings.some((l) => l.id === formState.id);
      await onSaveListing(formState, isNew);
    } finally {
      setSaving(false);
    }
  };

  const platformRule = PLATFORM_ALGO_RULES[formState.platform];
  const charCount = formState.optimizedTitle.length;
  const maxChars = platformRule.maxChars;

  const slotDescriptions: Record<1 | 2 | 3 | 4 | 5, { label: string; purpose: string; value: string; field: keyof ProductListingRecord }> = {
    1: {
      label: 'Slot 1 · Hero Shot (搜索主图)',
      purpose: 'Clean product on neutral surface, mobile-readable for high search CTR',
      value: formState.slot1Text,
      field: 'slot1Text',
    },
    2: {
      label: 'Slot 2 · Core Selling Point (核心卖点图)',
      purpose: 'Single high-impact benefit with clear text overlay',
      value: formState.slot2Text,
      field: 'slot2Text',
    },
    3: {
      label: 'Slot 3 · Usage Scenario (场景痛点图)',
      purpose: 'Product in real-life commuter, home, or executive context',
      value: formState.slot3Text,
      field: 'slot3Text',
    },
    4: {
      label: 'Slot 4 · Social Proof & Specs (背书权威图)',
      purpose: 'Sales volume milestones, awards, and SGS/quality certifications',
      value: formState.slot4Text,
      field: 'slot4Text',
    },
    5: {
      label: 'Slot 5 · Promotion & Urgency CTA (大促利益点图)',
      purpose: 'Pre-sale deposit multiplier, bundle value, and urgency mechanics',
      value: formState.slot5Text,
      field: 'slot5Text',
    },
  };

  const currentSlot = slotDescriptions[activeSlot];
  const previewImgSrc =
    formState.imageKey === 'skincare'
      ? GENERATED_IMAGES.skincare
      : GENERATED_IMAGES.thermos;

  const completedAuditCount = Object.values(auditedSteps).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Product Listing Optimization Framework · 标题优化 · 主图5图 · 详情页架构
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
            Platform-Native Listing Studio & Visual Merchandising
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {listings.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectListing(item)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  formState.id === item.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.platform} · {item.skuCode}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateNewDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New SKU Listing
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            {saving ? 'Saving SKU...' : 'Save SKU Optimization'}
          </button>
        </div>
      </div>

      {/* Top Split: Platform Title Formula Builder + 5-Slot Main Image Interactive Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Cols: Platform-Specific Title Formula Workbench */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  01. Search Title Optimization Engine (标题组合公式)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Keyword research tool: {platformRule.tool} · Target Formula: {platformRule.formula}
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-600">
                {formState.roleTag}
              </span>
            </div>

            {/* Platform, Role, and SKU Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Platform
                </label>
                <select
                  value={formState.platform}
                  onChange={(e) =>
                    setFormState({ ...formState, platform: e.target.value as PlatformName })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Taobao/Tmall">Taobao/Tmall (60 chars)</option>
                  <option value="Pinduoduo">Pinduoduo (60 chars)</option>
                  <option value="JD">JD (45 chars rec.)</option>
                  <option value="Douyin Shop">Douyin Shop (60 chars)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  SKU Architecture Role
                </label>
                <select
                  value={formState.roleTag}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      roleTag: e.target.value as ProductListingRecord['roleTag'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="引流款 Traffic Driver">引流款 Traffic Driver</option>
                  <option value="利润款 Profit Item">利润款 Profit Item</option>
                  <option value="活动款 Promo Item">活动款 Promo Item</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  SKU Code & Visual Asset
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={40}
                    value={formState.skuCode}
                    onChange={(e) => setFormState({ ...formState, skuCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg text-slate-900"
                  />
                  <select
                    value={formState.imageKey}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        imageKey: e.target.value as 'thermos' | 'skincare',
                      })
                    }
                    className="px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="thermos">Flask</option>
                    <option value="skincare">Essence</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5 Keyword Building Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  1. Brand / Price Hook
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={formState.brandKeyword}
                  onChange={(e) => setFormState({ ...formState, brandKeyword: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  2. Core Search Keyword
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={formState.coreKeyword}
                  onChange={(e) => setFormState({ ...formState, coreKeyword: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  3. Spec / Attribute
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={formState.attributeKeyword}
                  onChange={(e) =>
                    setFormState({ ...formState, attributeKeyword: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  4. Value / Benefit
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={formState.sellingPoint}
                  onChange={(e) => setFormState({ ...formState, sellingPoint: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  5. Scenario / Proof
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={formState.scenarioKeyword}
                  onChange={(e) =>
                    setFormState({ ...formState, scenarioKeyword: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Assembled Title Box */}
            <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800">
                  Compiled {formState.platform} Search Title
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={assembleFormulaTitle}
                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-Compile from Formula
                  </button>
                  <span
                    className={`text-xs font-mono tabular-nums font-medium ${
                      charCount <= maxChars ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {charCount} / {maxChars} units
                  </span>
                </div>
              </div>

              <textarea
                rows={2}
                maxLength={120}
                value={formState.optimizedTitle}
                onChange={(e) => setFormState({ ...formState, optimizedTitle: e.target.value })}
                className="w-full px-3 py-2 text-sm font-medium bg-white border border-slate-300 rounded-lg text-slate-900"
              />

              <div className="flex items-center justify-between mt-2.5 text-xs text-slate-500">
                <span>Benchmark Example: {platformRule.example}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(formState.optimizedTitle);
                    setCopiedTitle(true);
                    setTimeout(() => setCopiedTitle(false), 2000);
                  }}
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium whitespace-nowrap shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedTitle ? 'Copied' : 'Copy Title'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Retail Price:{' '}
              <strong className="font-mono tabular-nums text-slate-900">
                ¥{formState.retailPrice}
              </strong>{' '}
              · COGS:{' '}
              <strong className="font-mono tabular-nums text-slate-900">¥{formState.cogs}</strong>
            </span>
            <span>Rotate seasonal long-tail keywords every 14 days via {platformRule.tool}</span>
          </div>
        </section>

        {/* Right 5 Cols: 5-Slot Main Image Strategy Interactive Studio */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  02. Main Image 5-Slot Strategy (主图5图视觉规范)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  800x800 1:1 mobile search & product gallery carousel planner.
                </p>
              </div>
            </div>

            {/* Slot Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mt-4">
              {([1, 2, 3, 4, 5] as const).map((slotNum) => (
                <button
                  key={slotNum}
                  onClick={() => setActiveSlot(slotNum)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeSlot === slotNum
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Slot {slotNum}
                </button>
              ))}
            </div>

            {/* Visual Preview Frame with Measured Scrim & Resilient Fallback */}
            <div className="mt-4 relative aspect-square max-h-64 mx-auto w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              {!imgFallback[formState.imageKey] ? (
                <img
                  src={previewImgSrc}
                  alt={`${formState.productName} — ${currentSlot.label}`}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgFallback((prev) => ({ ...prev, [formState.imageKey]: true }))
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 text-center">
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <div className="text-sm font-semibold">{formState.productName}</div>
                  <div className="text-xs text-slate-300 mt-1">{currentSlot.label}</div>
                </div>
              )}

              {/* Measured Scrim Overlay for Main Image Callout Simulation */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>
                    {formState.platform} · Slot {activeSlot}/5
                  </span>
                  <span>¥{formState.retailPrice}</span>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-300">
                    {currentSlot.label}
                  </div>
                  <div className="text-sm font-semibold leading-snug mt-0.5">
                    {currentSlot.value}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Slot Visual Brief Editor */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">{currentSlot.label}</span>
                <span className="text-slate-500">{currentSlot.purpose}</span>
              </div>
              <input
                type="text"
                maxLength={120}
                value={currentSlot.value}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [currentSlot.field]: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
            Best practice: Test Slot 1 hero variations via Zhitongche (直通车) split-testing until mobile search CTR exceeds category top-10 threshold.
          </div>
        </section>
      </div>

      {/* Bottom Full-Width Section: 8-Step Detail Page (详情页) Conversion Funnel Auditor */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              03. Detail Page 8-Screen Conversion Architecture (详情页8屏高转化结构)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Audit each detail-page screen before launching paid search or live commerce traffic to prevent detail-page bounce at the price section.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums font-medium text-slate-800">
            Readiness Score: {completedAuditCount} / 8 Screens Verified
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {DETAIL_PAGE_SECTIONS.map((item, idx) => {
            const isChecked = !!auditedSteps[idx];
            return (
              <button
                key={item.step}
                type="button"
                onClick={() =>
                  setAuditedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                }
                className={`text-left p-4 rounded-xl border transition-colors flex flex-col justify-between ${
                  isChecked
                    ? 'bg-slate-50/90 border-slate-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 leading-snug">
                      {item.step}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-xs flex items-center justify-center shrink-0 mt-0.5 border ${
                        isChecked
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.checklist}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Target Metric</span>
                  <span className="text-slate-800 font-medium">{item.benchmark}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
