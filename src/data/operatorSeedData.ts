export type PlatformName = 'Taobao/Tmall' | 'Pinduoduo' | 'JD' | 'Douyin Shop';

export interface StorefrontMetricsRecord {
  id: string;
  ownerId: string;
  platform: PlatformName;
  brandName: string;
  monthlyGmv: number;
  orderVolume: number;
  avgOrderValue: number;
  conversionRate: number;
  storeRating: number;
  adSpend: number;
  adRoi: number;
  returnRate: number;
  repeatPurchaseRate: number;
  liveCommerceGmvShare: number;
  organicSearchPct: number;
  paidSearchPct: number;
  recommendationFeedPct: number;
  liveCommercePct: number;
  shortVideoPct: number;
  privateDomainPct: number;
}

export interface ProductListingRecord {
  id: string;
  ownerId: string;
  skuCode: string;
  productName: string;
  platform: PlatformName;
  roleTag: '引流款 Traffic Driver' | '利润款 Profit Item' | '活动款 Promo Item';
  brandKeyword: string;
  coreKeyword: string;
  attributeKeyword: string;
  sellingPoint: string;
  scenarioKeyword: string;
  optimizedTitle: string;
  retailPrice: number;
  cogs: number;
  platformFeePct: number;
  adCostPerUnit: number;
  logisticsCost: number;
  slot1Text: string;
  slot2Text: string;
  slot3Text: string;
  slot4Text: string;
  slot5Text: string;
  imageKey: 'thermos' | 'skincare';
}

export type CampaignPhase =
  | 'T-60 Days: Strategic Planning'
  | 'T-30 Days: Preparation Phase'
  | 'T-7 Days: Warm-Up (蓄水期)'
  | 'T-Day: Execution (爆发期)'
  | 'T+1 to T+7: Post-Campaign';

export interface CampaignTaskRecord {
  id: string;
  ownerId: string;
  campaignName: string;
  phase: CampaignPhase;
  title: string;
  category: string;
  completed: boolean;
  priority: 'Critical' | 'High' | 'Standard';
}

export interface AdCampaignRecord {
  id: string;
  ownerId: string;
  platform: PlatformName;
  toolName: string;
  campaignFocus: string;
  dailyBudget: number;
  spend: number;
  gmvGenerated: number;
  ctr: number;
  cvr: number;
  status: 'Scaling' | 'Testing' | 'Paused';
}

export const GENERATED_IMAGES = {
  thermos: '/src/assets/images/product_thermos_hero_1795003798523.jpg',
  skincare: '/src/assets/images/product_skincare_essence_1795003800601.jpg',
  operatorAvatar: '/src/assets/images/avatar_ecommerce_operator_1795003801152.jpg',
};

export const INITIAL_STOREFRONTS: Omit<StorefrontMetricsRecord, 'ownerId'>[] = [
  {
    id: 'sf_tmall',
    platform: 'Taobao/Tmall',
    brandName: 'AURUM 旗舰店 (Tmall Flagship)',
    monthlyGmv: 3420000,
    orderVolume: 18190,
    avgOrderValue: 188,
    conversionRate: 3.85,
    storeRating: 4.91,
    adSpend: 890000,
    adRoi: 3.84,
    returnRate: 4.2,
    repeatPurchaseRate: 28.4,
    liveCommerceGmvShare: 24.5,
    organicSearchPct: 28,
    paidSearchPct: 24,
    recommendationFeedPct: 16,
    liveCommercePct: 18,
    shortVideoPct: 6,
    privateDomainPct: 8,
  },
  {
    id: 'sf_pdd',
    platform: 'Pinduoduo',
    brandName: 'AURUM 官方专卖店 (PDD Value Pack)',
    monthlyGmv: 1680000,
    orderVolume: 21265,
    avgOrderValue: 79,
    conversionRate: 5.62,
    storeRating: 4.84,
    adSpend: 685000,
    adRoi: 2.45,
    returnRate: 3.8,
    repeatPurchaseRate: 26.1,
    liveCommerceGmvShare: 11.2,
    organicSearchPct: 31,
    paidSearchPct: 36,
    recommendationFeedPct: 21,
    liveCommercePct: 5,
    shortVideoPct: 3,
    privateDomainPct: 4,
  },
  {
    id: 'sf_jd',
    platform: 'JD',
    brandName: 'AURUM 京东自营旗舰店 (JD Self-Operated)',
    monthlyGmv: 2150000,
    orderVolume: 9033,
    avgOrderValue: 238,
    conversionRate: 4.42,
    storeRating: 4.94,
    adSpend: 560000,
    adRoi: 3.84,
    returnRate: 2.9,
    repeatPurchaseRate: 31.2,
    liveCommerceGmvShare: 14.0,
    organicSearchPct: 39,
    paidSearchPct: 29,
    recommendationFeedPct: 12,
    liveCommercePct: 8,
    shortVideoPct: 4,
    privateDomainPct: 8,
  },
  {
    id: 'sf_douyin',
    platform: 'Douyin Shop',
    brandName: 'AURUM 抖音官方直播间 (Douyin Mall)',
    monthlyGmv: 2490000,
    orderVolume: 15759,
    avgOrderValue: 158,
    conversionRate: 3.12,
    storeRating: 4.82,
    adSpend: 795000,
    adRoi: 3.13,
    returnRate: 4.8,
    repeatPurchaseRate: 22.8,
    liveCommerceGmvShare: 58.6,
    organicSearchPct: 14,
    paidSearchPct: 18,
    recommendationFeedPct: 15,
    liveCommercePct: 34,
    shortVideoPct: 14,
    privateDomainPct: 5,
  },
];

export const INITIAL_LISTINGS: Omit<ProductListingRecord, 'ownerId'>[] = [
  {
    id: 'sku_tmall_thermos',
    skuCode: 'AUR-316-TI500',
    productName: '316 Titanium Insulated Vacuum Flask 500ml',
    platform: 'Taobao/Tmall',
    roleTag: '利润款 Profit Item',
    brandKeyword: 'AURUM奥伦',
    coreKeyword: '保温杯女士高颜值',
    attributeKeyword: '316医用级不锈钢纯钛内胆',
    sellingPoint: '大容量24小时长效锁温便携',
    scenarioKeyword: '学生上班族车载2026新款礼盒',
    optimizedTitle: 'AURUM奥伦保温杯女士高颜值316医用级不锈钢纯钛内胆大容量24小时长效锁温便携学生上班族车载2026新款礼盒',
    retailPrice: 189,
    cogs: 46,
    platformFeePct: 5.5,
    adCostPerUnit: 38,
    logisticsCost: 6.5,
    slot1Text: 'Clean matte titanium bottle on travertine plinth, mobile-readable 316 callout badge',
    slot2Text: '24H Hot / 36H Ice — Zero metallic aftertaste with medical-grade 316L seamless liner',
    slot3Text: 'Commuter desk & luxury vehicle cup-holder lifestyle scenario with one-hand flip lid',
    slot4Text: '120,000+ Tmall Sold · Top 3 Category Ranking · SGS Food-Contact Certified',
    slot5Text: 'Double 11 Pre-Sale: Pay ¥20 Deposit to Offset ¥50 + Free Custom Laser Engraving',
    imageKey: 'thermos',
  },
  {
    id: 'sku_pdd_thermos',
    skuCode: 'AUR-316-PDD2PK',
    productName: '316 Stainless Insulated Cup Value Twin-Pack',
    platform: 'Pinduoduo',
    roleTag: '引流款 Traffic Driver',
    brandKeyword: '工厂直供316不锈钢保温杯',
    coreKeyword: '第二件半价大容量水杯',
    attributeKeyword: '双层真空24小时保温保冷',
    sellingPoint: '百亿补贴正品保证摔不烂',
    scenarioKeyword: '已拼10万+件学生车载男女同款',
    optimizedTitle: '工厂直供316不锈钢保温杯第二件半价大容量水杯双层真空24小时保温保冷百亿补贴正品保证摔不烂已拼10万+件学生车载男女同款',
    retailPrice: 79,
    cogs: 24,
    platformFeePct: 1.2,
    adCostPerUnit: 19,
    logisticsCost: 4.2,
    slot1Text: 'Twin-pack bundle hero shot with high-contrast ¥79 For 2 Cups price anchor',
    slot2Text: '316 Stainless Steel Stamp — Full Refund if Not Authentic 316 Liner',
    slot3Text: 'Boiling water 24-hour digital thermometer test proving 68°C retention',
    slot4Text: '100,000+ Group Buys Completed · 99.2% Positive PDD Buyer Reviews',
    slot5Text: '24-Hour Group Buy Flash Price: Instant ¥10 Coupon + Free Brush Set Today',
    imageKey: 'thermos',
  },
  {
    id: 'sku_jd_thermos',
    skuCode: 'AUR-JD-PRO600',
    productName: 'AURUM Pro 600ml Smart Temp Display Vacuum Flask',
    platform: 'JD',
    roleTag: '利润款 Profit Item',
    brandKeyword: 'AURUM奥伦京东自营',
    coreKeyword: '智能显温纯钛保温杯600ml',
    attributeKeyword: '316L不锈钢抗菌内胆IPX7防水',
    sellingPoint: '商务办公礼品级顺丰次日达',
    scenarioKeyword: '车载户外旅行男士高端水杯',
    optimizedTitle: 'AURUM奥伦京东自营智能显温纯钛保温杯600ml 316L不锈钢抗菌内胆IPX7防水商务办公礼品级车载水杯',
    retailPrice: 239,
    cogs: 58,
    platformFeePct: 8.0,
    adCostPerUnit: 42,
    logisticsCost: 8.5,
    slot1Text: 'Precision technical cutaway showing OLED temperature cap + 5-layer copper thermal shield',
    slot2Text: 'OLED Smart Touch Cap — Instant 1-Second Water Temperature Readout (No Charging Required)',
    slot3Text: 'Executive boardroom & high-speed rail travel scenario with gift-ready magnetic box',
    slot4Text: 'JD Self-Operated 211 Next-Day Delivery · 365-Day Replacement Warranty',
    slot5Text: 'JD Plus Member Exclusive: ¥30 Instant Discount + Complimentary Executive Gift Bag',
    imageKey: 'thermos',
  },
  {
    id: 'sku_douyin_skincare',
    skuCode: 'AURA-BOT-30ML',
    productName: 'AURA Rosehip & Neroli Botanical Facial Essence 30ml',
    platform: 'Douyin Shop',
    roleTag: '活动款 Promo Item',
    brandKeyword: 'AURA奥拉旗舰店',
    coreKeyword: '玫瑰果橙花以油养肤精华油',
    attributeKeyword: '30ml冷压萃取修护屏障',
    sellingPoint: '熬夜急救提亮抗初老不油腻',
    scenarioKeyword: '抖音同款买1享5干敏肌救星',
    optimizedTitle: 'AURA奥拉旗舰店玫瑰果橙花以油养肤精华油30ml冷压萃取修护屏障熬夜急救提亮抗初老不油腻抖音同款买1享5干敏肌救星',
    retailPrice: 158,
    cogs: 28,
    platformFeePct: 5.0,
    adCostPerUnit: 48,
    logisticsCost: 5.0,
    slot1Text: 'Golden amber glass dropper bottle catching sunlight with Buy 30ml Get 45ml Total Live Exclusive overlay',
    slot2Text: 'Water-Light Micro-Molecular Oil — Absorbs in 8 Seconds for Overnight Glass-Skin Glow',
    slot3Text: 'Before/After 7-day late-night skin barrier hydration test on sensitive skin',
    slot4Text: 'Top 1 Douyin Botanical Essence List · Recommended by 45+ Skincare Dermatologist KOLs',
    slot5Text: 'Live Room Flash Drop: Buy 1 Full Size (30ml) Receive 3x5ml Travel Vials + Jade Gua Sha',
    imageKey: 'skincare',
  },
];

export const INITIAL_CAMPAIGN_TASKS: Omit<CampaignTaskRecord, 'ownerId'>[] = [
  {
    id: 'camp_t60_1',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-60 Days: Strategic Planning',
    title: 'Lock ¥12.5M cross-platform GMV target and reverse-engineer UV, CVR, and AOV targets per store',
    category: 'Merchandising',
    completed: true,
    priority: 'Critical',
  },
  {
    id: 'camp_t60_2',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-60 Days: Strategic Planning',
    title: 'Negotiate Tmall & JD main venue pit slots (会场坑位) with platform category Xiaoer',
    category: 'Merchandising',
    completed: true,
    priority: 'Critical',
  },
  {
    id: 'camp_t60_3',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-60 Days: Strategic Planning',
    title: 'Structure SKU matrix: 20% 引流款 (traffic drivers), 50% 利润款 (profit items), 30% 活动款 (exclusive bundles)',
    category: 'Merchandising',
    completed: true,
    priority: 'High',
  },
  {
    id: 'camp_t30_1',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-30 Days: Preparation Phase',
    title: 'Configure Pre-Sale (预售) deposit multiplier mechanics (¥20 deposit = ¥50 deduction) & 跨店满减 (¥300-¥50) margin stress test',
    category: 'Merchandising',
    completed: true,
    priority: 'Critical',
  },
  {
    id: 'camp_t30_2',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-30 Days: Preparation Phase',
    title: 'Launch Wanxiangtai (万相台) Ла新快 & Zhitongche long-tail keyword testing with 5 creative variants per hero SKU',
    category: 'Traffic & Ads',
    completed: true,
    priority: 'High',
  },
  {
    id: 'camp_t30_3',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-30 Days: Preparation Phase',
    title: 'Finalize 12-hour Live Commerce host rotation scripts, flash drop sequences, and Top 15 Xiaohongshu KOC seeding briefs',
    category: 'Live Commerce',
    completed: false,
    priority: 'High',
  },
  {
    id: 'camp_t7_1',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-7 Days: Warm-Up (蓄水期)',
    title: 'Activate pre-sale deposit collection & scale Super Recommendation (超级推荐) add-to-cart retargeting',
    category: 'Traffic & Ads',
    completed: false,
    priority: 'Critical',
  },
  {
    id: 'camp_t7_2',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-7 Days: Warm-Up (蓄水期)',
    title: 'Push WeChat Private Domain (私域) VIP early-access coupons & SMS reminders to 85,000 historical buyers',
    category: 'Retention',
    completed: false,
    priority: 'High',
  },
  {
    id: 'camp_tday_1',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-Day: Execution (爆发期)',
    title: 'War Room live hourly Zhitongche/Qianchuan bid adjustments during 8PM Day-1 wave & flash drops (10am, 2pm, 8pm, 12am)',
    category: 'Traffic & Ads',
    completed: false,
    priority: 'Critical',
  },
  {
    id: 'camp_tday_2',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T-Day: Execution (爆发期)',
    title: 'Monitor real-time SKU safety stock across 4 regional warehouses to prevent overselling penalty & maintain <25s CS response time',
    category: 'Inventory & CS',
    completed: false,
    priority: 'Critical',
  },
  {
    id: 'camp_tpost_1',
    campaignName: 'Double 11 (双11) Global Shopping Festival',
    phase: 'T+1 to T+7: Post-Campaign',
    title: 'Enroll all campaign buyers into 90-day WeChat CRM retention workflow with unboxing review incentives & post-campaign ROAS audit',
    category: 'Retention',
    completed: false,
    priority: 'Standard',
  },
];

export const INITIAL_AD_CAMPAIGNS: Omit<AdCampaignRecord, 'ownerId'>[] = [
  {
    id: 'ad_tmall_ztc',
    platform: 'Taobao/Tmall',
    toolName: '直通车 (Zhitongche Search)',
    campaignFocus: 'High-conversion long-tail keywords (316保温杯女高颜值) — 40% proven / 30% test / 30% brand',
    dailyBudget: 15000,
    spend: 420000,
    gmvGenerated: 1680000,
    ctr: 4.85,
    cvr: 4.12,
    status: 'Scaling',
  },
  {
    id: 'ad_tmall_wxt',
    platform: 'Taobao/Tmall',
    toolName: '万相台 (Wanxiangtai Smart)',
    campaignFocus: '货品加速 (Product Acceleration) + 拉新快 (New Customer Acquisition Lookalike)',
    dailyBudget: 11000,
    spend: 310000,
    gmvGenerated: 1190000,
    ctr: 3.62,
    cvr: 3.75,
    status: 'Scaling',
  },
  {
    id: 'ad_tmall_cjtj',
    platform: 'Taobao/Tmall',
    toolName: '超级推荐 (Super Recommendation)',
    campaignFocus: 'Homepage discovery feed + Cart abandoner retargeting (5 creative rotation)',
    dailyBudget: 5500,
    spend: 160000,
    gmvGenerated: 550000,
    ctr: 2.95,
    cvr: 2.88,
    status: 'Testing',
  },
  {
    id: 'ad_pdd_search',
    platform: 'Pinduoduo',
    toolName: '多多搜索 (Doudou Search)',
    campaignFocus: 'First 14-day aggressive category keyword ranking + 千人千面 personalized weight',
    dailyBudget: 14500,
    spend: 430000,
    gmvGenerated: 1095000,
    ctr: 5.92,
    cvr: 6.18,
    status: 'Scaling',
  },
  {
    id: 'ad_pdd_scene',
    platform: 'Pinduoduo',
    toolName: '多多场景 (Doudou Display)',
    campaignFocus: 'Competitor SKU detail-page intercept + high-intent group-buy retargeting',
    dailyBudget: 8500,
    spend: 255000,
    gmvGenerated: 585000,
    ctr: 3.45,
    cvr: 4.82,
    status: 'Testing',
  },
  {
    id: 'ad_jd_jst',
    platform: 'JD',
    toolName: '京速推 & 京东快车 (JD Express)',
    campaignFocus: 'High-AOV specification search terms + JD Plus high-credit buyer segment',
    dailyBudget: 19000,
    spend: 560000,
    gmvGenerated: 2150000,
    ctr: 4.21,
    cvr: 4.65,
    status: 'Scaling',
  },
  {
    id: 'ad_douyin_qc',
    platform: 'Douyin Shop',
    toolName: '巨量千川 (Douyin Qianchuan Live)',
    campaignFocus: 'Live room 30-second viewer retention & GPM (GMV per 1,000 impressions) optimization',
    dailyBudget: 26500,
    spend: 795000,
    gmvGenerated: 2490000,
    ctr: 4.15,
    cvr: 3.42,
    status: 'Scaling',
  },
];

export const PLATFORM_ALGO_RULES: Record<
  PlatformName,
  {
    maxChars: number;
    formula: string;
    example: string;
    tool: string;
    buyerPsychology: string;
    commissionNote: string;
  }
> = {
  'Taobao/Tmall': {
    maxChars: 60,
    formula: '[Brand] + [Core Keyword] + [Attribute] + [Selling Point] + [Scenario]',
    example: 'AURUM奥伦保温杯女士高颜值316不锈钢大容量便携学生上班族2026新款',
    tool: '生意参谋 (Business Advisor)',
    buyerPsychology: 'Lifestyle & brand story driven; high sensitivity to main image CTR and detail page visual merchandising.',
    commissionNote: 'Tmall Category Commission 2%–5% + Alipay 0.55% fee; 15-day average settlement cycle.',
  },
  Pinduoduo: {
    maxChars: 60,
    formula: '[Core Keyword] + [Price Anchor] + [Value Proposition] + [Social Proof]',
    example: '工厂直供316不锈钢保温杯第二件半价双层真空百亿补贴已拼10万+件',
    tool: '多多搜索词分析 (Doudou Keyword Tool)',
    buyerPsychology: 'Extreme value & social-proof sensitivity; group-buy urgency and factory-direct bundle pricing win.',
    commissionNote: '0% base commission + 0.6% WeChat Pay technical service fee; fast volume velocity.',
  },
  JD: {
    maxChars: 45,
    formula: '[Brand] + [Product Name] + [Key Specification] + [Use Scenario]',
    example: 'AURUM奥伦京东自营智能显温纯钛保温杯600ml 316L抗菌商务车载水杯',
    tool: '京东商智 (JD Business Intelligence)',
    buyerPsychology: 'Specification precision, brand authenticity, and 211 Next-Day fulfillment reliability drive high AOV.',
    commissionNote: 'JD POP / Self-Operated margin 5%–10%; T+15 to T+30 settlement cycle.',
  },
  'Douyin Shop': {
    maxChars: 60,
    formula: '[Brand/Live Hook] + [Core Pain-Point] + [Ingredient/Spec] + [Immediate Benefit] + [Bundle Offer]',
    example: 'AURA奥拉玫瑰果以油养肤精华油30ml冷压修护熬夜提亮抖音同款买1享5',
    tool: '巨量算数 & 罗盘 (Douyin Compass)',
    buyerPsychology: 'Impulse content discovery; first 3 seconds of short video or live room script dictates GPM conversion.',
    commissionNote: 'Douyin Mall 2%–5% technical fee + KOL commission (10%–25% on affiliate links).',
  },
};
