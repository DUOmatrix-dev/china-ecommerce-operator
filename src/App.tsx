/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle,
  signOutUser,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  StorefrontMetricsRecord,
  ProductListingRecord,
  CampaignTaskRecord,
  AdCampaignRecord,
  PlatformName,
  INITIAL_STOREFRONTS,
  INITIAL_LISTINGS,
  INITIAL_CAMPAIGN_TASKS,
  INITIAL_AD_CAMPAIGNS,
  GENERATED_IMAGES,
} from './data/operatorSeedData';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StorefrontOverviewView } from './components/StorefrontOverviewView';
import { ListingStudioView } from './components/ListingStudioView';
import { CampaignWarRoomView } from './components/CampaignWarRoomView';
import { AdAndLiveView } from './components/AdAndLiveView';
import { UnitEconomicsView } from './components/UnitEconomicsView';
import { FileText, Cloud, LogOut, Copy, Check, X, User as UserIcon } from 'lucide-react';

type ActiveTab =
  | 'storefronts'
  | 'listings'
  | 'campaigns'
  | 'ads_live'
  | 'unit_economics';

function OperatorWorkbench() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('storefronts');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformName | 'All'>('All');

  // Firebase Auth & Firestore State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Domain State (Initialized with rich realistic multi-platform seed data; synced with Firestore when authenticated)
  const [storefronts, setStorefronts] = useState<StorefrontMetricsRecord[]>(() =>
    INITIAL_STOREFRONTS.map((s) => ({ ...s, ownerId: 'local_operator' }))
  );
  const [listings, setListings] = useState<ProductListingRecord[]>(() =>
    INITIAL_LISTINGS.map((l) => ({ ...l, ownerId: 'local_operator' }))
  );
  const [campaignTasks, setCampaignTasks] = useState<CampaignTaskRecord[]>(() =>
    INITIAL_CAMPAIGN_TASKS.map((c) => ({ ...c, ownerId: 'local_operator' }))
  );
  const [adCampaigns, setAdCampaigns] = useState<AdCampaignRecord[]>(() =>
    INITIAL_AD_CAMPAIGNS.map((a) => ({ ...a, ownerId: 'local_operator' }))
  );

  // UI Feedback States
  const [copiedReport, setCopiedReport] = useState(false);
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [avatarFallback, setAvatarFallback] = useState(false);

  // 1. Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Attach Real-Time Firestore Listeners when Authenticated
  useEffect(() => {
    if (!isAuthReady || !user) return;

    const uid = user.uid;

    // Storefronts Listener
    const sfQuery = query(collection(db, 'storefronts'), where('ownerId', '==', uid));
    const unsubStorefronts = onSnapshot(
      sfQuery,
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed initial storefronts for this authenticated operator
          for (const item of INITIAL_STOREFRONTS) {
            const docId = `${uid}_${item.id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
            try {
              await setDoc(doc(db, 'storefronts', docId), {
                ownerId: uid,
                platform: item.platform,
                brandName: item.brandName.slice(0, 80),
                monthlyGmv: item.monthlyGmv,
                orderVolume: item.orderVolume,
                avgOrderValue: item.avgOrderValue,
                conversionRate: item.conversionRate,
                storeRating: item.storeRating,
                adSpend: item.adSpend,
                adRoi: item.adRoi,
                returnRate: item.returnRate,
                repeatPurchaseRate: item.repeatPurchaseRate,
                liveCommerceGmvShare: item.liveCommerceGmvShare,
                organicSearchPct: item.organicSearchPct,
                paidSearchPct: item.paidSearchPct,
                recommendationFeedPct: item.recommendationFeedPct,
                liveCommercePct: item.liveCommercePct,
                shortVideoPct: item.shortVideoPct,
                privateDomainPct: item.privateDomainPct,
                updatedAt: serverTimestamp(),
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `storefronts/${docId}`);
            }
          }
        } else {
          const loaded: StorefrontMetricsRecord[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ownerId: String(data.ownerId),
              platform: data.platform as PlatformName,
              brandName: String(data.brandName),
              monthlyGmv: Number(data.monthlyGmv),
              orderVolume: Number(data.orderVolume),
              avgOrderValue: Number(data.avgOrderValue),
              conversionRate: Number(data.conversionRate),
              storeRating: Number(data.storeRating),
              adSpend: Number(data.adSpend),
              adRoi: Number(data.adRoi),
              returnRate: Number(data.returnRate),
              repeatPurchaseRate: Number(data.repeatPurchaseRate),
              liveCommerceGmvShare: Number(data.liveCommerceGmvShare),
              organicSearchPct: Number(data.organicSearchPct),
              paidSearchPct: Number(data.paidSearchPct),
              recommendationFeedPct: Number(data.recommendationFeedPct),
              liveCommercePct: Number(data.liveCommercePct),
              shortVideoPct: Number(data.shortVideoPct),
              privateDomainPct: Number(data.privateDomainPct),
            };
          });
          setStorefronts(loaded);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'storefronts')
    );

    // Listings Listener
    const listingsQuery = query(collection(db, 'listings'), where('ownerId', '==', uid));
    const unsubListings = onSnapshot(
      listingsQuery,
      async (snapshot) => {
        if (snapshot.empty) {
          for (const item of INITIAL_LISTINGS) {
            const docId = `${uid}_${item.id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
            try {
              await setDoc(doc(db, 'listings', docId), {
                ownerId: uid,
                skuCode: item.skuCode.slice(0, 40),
                productName: item.productName.slice(0, 80),
                platform: item.platform,
                roleTag: item.roleTag,
                brandKeyword: item.brandKeyword.slice(0, 40),
                coreKeyword: item.coreKeyword.slice(0, 40),
                attributeKeyword: item.attributeKeyword.slice(0, 40),
                sellingPoint: item.sellingPoint.slice(0, 40),
                scenarioKeyword: item.scenarioKeyword.slice(0, 40),
                optimizedTitle: item.optimizedTitle.slice(0, 120),
                retailPrice: item.retailPrice,
                cogs: item.cogs,
                platformFeePct: item.platformFeePct,
                adCostPerUnit: item.adCostPerUnit,
                logisticsCost: item.logisticsCost,
                slot1Text: item.slot1Text.slice(0, 120),
                slot2Text: item.slot2Text.slice(0, 120),
                slot3Text: item.slot3Text.slice(0, 120),
                slot4Text: item.slot4Text.slice(0, 120),
                slot5Text: item.slot5Text.slice(0, 120),
                imageKey: item.imageKey,
                updatedAt: serverTimestamp(),
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `listings/${docId}`);
            }
          }
        } else {
          const loaded: ProductListingRecord[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ownerId: String(data.ownerId),
              skuCode: String(data.skuCode),
              productName: String(data.productName),
              platform: data.platform as PlatformName,
              roleTag: data.roleTag as ProductListingRecord['roleTag'],
              brandKeyword: String(data.brandKeyword),
              coreKeyword: String(data.coreKeyword),
              attributeKeyword: String(data.attributeKeyword),
              sellingPoint: String(data.sellingPoint),
              scenarioKeyword: String(data.scenarioKeyword),
              optimizedTitle: String(data.optimizedTitle),
              retailPrice: Number(data.retailPrice),
              cogs: Number(data.cogs),
              platformFeePct: Number(data.platformFeePct),
              adCostPerUnit: Number(data.adCostPerUnit),
              logisticsCost: Number(data.logisticsCost),
              slot1Text: String(data.slot1Text),
              slot2Text: String(data.slot2Text),
              slot3Text: String(data.slot3Text),
              slot4Text: String(data.slot4Text),
              slot5Text: String(data.slot5Text),
              imageKey: data.imageKey as 'thermos' | 'skincare',
            };
          });
          setListings(loaded);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'listings')
    );

    // Campaign Tasks Listener
    const campQuery = query(collection(db, 'campaigns'), where('ownerId', '==', uid));
    const unsubCampaigns = onSnapshot(
      campQuery,
      async (snapshot) => {
        if (snapshot.empty) {
          for (const item of INITIAL_CAMPAIGN_TASKS) {
            const docId = `${uid}_${item.id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
            try {
              await setDoc(doc(db, 'campaigns', docId), {
                ownerId: uid,
                campaignName: item.campaignName.slice(0, 60),
                phase: item.phase,
                title: item.title.slice(0, 160),
                category: item.category.slice(0, 40),
                completed: item.completed,
                priority: item.priority,
                updatedAt: serverTimestamp(),
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `campaigns/${docId}`);
            }
          }
        } else {
          const loaded: CampaignTaskRecord[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ownerId: String(data.ownerId),
              campaignName: String(data.campaignName),
              phase: data.phase as CampaignTaskRecord['phase'],
              title: String(data.title),
              category: String(data.category),
              completed: Boolean(data.completed),
              priority: data.priority as CampaignTaskRecord['priority'],
            };
          });
          setCampaignTasks(loaded);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'campaigns')
    );

    // Ad Campaigns Listener
    const adQuery = query(collection(db, 'ad_campaigns'), where('ownerId', '==', uid));
    const unsubAdCampaigns = onSnapshot(
      adQuery,
      async (snapshot) => {
        if (snapshot.empty) {
          for (const item of INITIAL_AD_CAMPAIGNS) {
            const docId = `${uid}_${item.id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
            try {
              await setDoc(doc(db, 'ad_campaigns', docId), {
                ownerId: uid,
                platform: item.platform,
                toolName: item.toolName.slice(0, 60),
                campaignFocus: item.campaignFocus.slice(0, 120),
                dailyBudget: item.dailyBudget,
                spend: item.spend,
                gmvGenerated: item.gmvGenerated,
                ctr: item.ctr,
                cvr: item.cvr,
                status: item.status,
                updatedAt: serverTimestamp(),
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `ad_campaigns/${docId}`);
            }
          }
        } else {
          const loaded: AdCampaignRecord[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ownerId: String(data.ownerId),
              platform: data.platform as PlatformName,
              toolName: String(data.toolName),
              campaignFocus: String(data.campaignFocus),
              dailyBudget: Number(data.dailyBudget),
              spend: Number(data.spend),
              gmvGenerated: Number(data.gmvGenerated),
              ctr: Number(data.ctr),
              cvr: Number(data.cvr),
              status: data.status as AdCampaignRecord['status'],
            };
          });
          setAdCampaigns(loaded);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'ad_campaigns')
    );

    return () => {
      unsubStorefronts();
      unsubListings();
      unsubCampaigns();
      unsubAdCampaigns();
    };
  }, [isAuthReady, user]);

  // Mutation Handlers (Validated against firebase-blueprint.json & firestore.rules)
  const handleUpdateStorefront = async (updated: StorefrontMetricsRecord) => {
    setStorefronts((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (user) {
      const docId = updated.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
      try {
        await setDoc(doc(db, 'storefronts', docId), {
          ownerId: user.uid,
          platform: updated.platform,
          brandName: (updated.brandName || 'Brand Store').slice(0, 80),
          monthlyGmv: Math.max(0, Number(updated.monthlyGmv) || 0),
          orderVolume: Math.max(0, Number(updated.orderVolume) || 0),
          avgOrderValue: Math.max(0, Number(updated.avgOrderValue) || 0),
          conversionRate: Math.min(100, Math.max(0, Number(updated.conversionRate) || 0)),
          storeRating: Math.min(5, Math.max(0, Number(updated.storeRating) || 0)),
          adSpend: Math.max(0, Number(updated.adSpend) || 0),
          adRoi: Math.max(0, Number(updated.adRoi) || 0),
          returnRate: Math.min(100, Math.max(0, Number(updated.returnRate) || 0)),
          repeatPurchaseRate: Math.min(100, Math.max(0, Number(updated.repeatPurchaseRate) || 0)),
          liveCommerceGmvShare: Math.min(100, Math.max(0, Number(updated.liveCommerceGmvShare) || 0)),
          organicSearchPct: Math.min(100, Math.max(0, Number(updated.organicSearchPct) || 0)),
          paidSearchPct: Math.min(100, Math.max(0, Number(updated.paidSearchPct) || 0)),
          recommendationFeedPct: Math.min(100, Math.max(0, Number(updated.recommendationFeedPct) || 0)),
          liveCommercePct: Math.min(100, Math.max(0, Number(updated.liveCommercePct) || 0)),
          shortVideoPct: Math.min(100, Math.max(0, Number(updated.shortVideoPct) || 0)),
          privateDomainPct: Math.min(100, Math.max(0, Number(updated.privateDomainPct) || 0)),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `storefronts/${docId}`);
      }
    }
  };

  const handleSaveListing = async (listing: ProductListingRecord, isNew: boolean) => {
    if (isNew) {
      setListings((prev) => [...prev, listing]);
    } else {
      setListings((prev) => prev.map((l) => (l.id === listing.id ? listing : l)));
    }

    if (user) {
      const docId = (isNew ? `${user.uid}_${listing.id}` : listing.id)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 120);
      try {
        await setDoc(doc(db, 'listings', docId), {
          ownerId: user.uid,
          skuCode: (listing.skuCode || 'SKU-01').slice(0, 40),
          productName: (listing.productName || 'Product').slice(0, 80),
          platform: listing.platform,
          roleTag: listing.roleTag,
          brandKeyword: (listing.brandKeyword || 'Brand').slice(0, 40),
          coreKeyword: (listing.coreKeyword || 'Keyword').slice(0, 40),
          attributeKeyword: (listing.attributeKeyword || 'Spec').slice(0, 40),
          sellingPoint: (listing.sellingPoint || 'Benefit').slice(0, 40),
          scenarioKeyword: (listing.scenarioKeyword || 'Scenario').slice(0, 40),
          optimizedTitle: (listing.optimizedTitle || 'Optimized Title').slice(0, 120),
          retailPrice: Math.max(0, Number(listing.retailPrice) || 0),
          cogs: Math.max(0, Number(listing.cogs) || 0),
          platformFeePct: Math.min(100, Math.max(0, Number(listing.platformFeePct) || 0)),
          adCostPerUnit: Math.max(0, Number(listing.adCostPerUnit) || 0),
          logisticsCost: Math.max(0, Number(listing.logisticsCost) || 0),
          slot1Text: (listing.slot1Text || 'Slot 1').slice(0, 120),
          slot2Text: (listing.slot2Text || 'Slot 2').slice(0, 120),
          slot3Text: (listing.slot3Text || 'Slot 3').slice(0, 120),
          slot4Text: (listing.slot4Text || 'Slot 4').slice(0, 120),
          slot5Text: (listing.slot5Text || 'Slot 5').slice(0, 120),
          imageKey: listing.imageKey,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(
          err,
          isNew ? OperationType.CREATE : OperationType.UPDATE,
          `listings/${docId}`
        );
      }
    }
  };

  const handleToggleCampaignTask = async (task: CampaignTaskRecord) => {
    const updated: CampaignTaskRecord = { ...task, completed: !task.completed };
    setCampaignTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));

    if (user) {
      const docId = task.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
      try {
        await setDoc(doc(db, 'campaigns', docId), {
          ownerId: user.uid,
          campaignName: task.campaignName.slice(0, 60),
          phase: task.phase,
          title: task.title.slice(0, 160),
          category: task.category.slice(0, 40),
          completed: updated.completed,
          priority: task.priority,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `campaigns/${docId}`);
      }
    }
  };

  const handleAddCampaignTask = async (
    newTask: Omit<CampaignTaskRecord, 'id' | 'ownerId'>
  ) => {
    const rawId = `camp_${Date.now()}`;
    const docId = user ? `${user.uid}_${rawId}` : rawId;
    const created: CampaignTaskRecord = {
      ...newTask,
      id: docId,
      ownerId: user ? user.uid : 'local_operator',
    };
    setCampaignTasks((prev) => [created, ...prev]);

    if (user) {
      try {
        await setDoc(doc(db, 'campaigns', docId), {
          ownerId: user.uid,
          campaignName: newTask.campaignName.slice(0, 60),
          phase: newTask.phase,
          title: newTask.title.slice(0, 160),
          category: newTask.category.slice(0, 40),
          completed: newTask.completed,
          priority: newTask.priority,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `campaigns/${docId}`);
      }
    }
  };

  const handleUpdateAdCampaign = async (updated: AdCampaignRecord) => {
    setAdCampaigns((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

    if (user) {
      const docId = updated.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
      try {
        await setDoc(doc(db, 'ad_campaigns', docId), {
          ownerId: user.uid,
          platform: updated.platform,
          toolName: updated.toolName.slice(0, 60),
          campaignFocus: updated.campaignFocus.slice(0, 120),
          dailyBudget: Math.max(0, Number(updated.dailyBudget) || 0),
          spend: Math.max(0, Number(updated.spend) || 0),
          gmvGenerated: Math.max(0, Number(updated.gmvGenerated) || 0),
          ctr: Math.min(100, Math.max(0, Number(updated.ctr) || 0)),
          cvr: Math.min(100, Math.max(0, Number(updated.cvr) || 0)),
          status: updated.status,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `ad_campaigns/${docId}`);
      }
    }
  };

  // Generate Dynamic Markdown Report Deliverable
  const generateMarkdownReport = () => {
    const byPlat = (p: PlatformName) =>
      storefronts.find((s) => s.platform === p) || storefronts[0];
    const tmall = byPlat('Taobao/Tmall');
    const pdd = byPlat('Pinduoduo');
    const jd = byPlat('JD');
    const dy = byPlat('Douyin Shop');

    return `# AURUM China E-Commerce Operations Report

## 平台概览 (Platform Overview)
| Metric              | Taobao/Tmall | Pinduoduo  | JD         | Douyin Shop |
|---------------------|-------------|------------|------------|-------------|
| Monthly GMV         | ¥${tmall?.monthlyGmv.toLocaleString()} | ¥${pdd?.monthlyGmv.toLocaleString()} | ¥${jd?.monthlyGmv.toLocaleString()} | ¥${dy?.monthlyGmv.toLocaleString()} |
| Order Volume        | ${tmall?.orderVolume.toLocaleString()} | ${pdd?.orderVolume.toLocaleString()} | ${jd?.orderVolume.toLocaleString()} | ${dy?.orderVolume.toLocaleString()} |
| Avg Order Value     | ¥${tmall?.avgOrderValue} | ¥${pdd?.avgOrderValue} | ¥${jd?.avgOrderValue} | ¥${dy?.avgOrderValue} |
| Conversion Rate     | ${tmall?.conversionRate}% | ${pdd?.conversionRate}% | ${jd?.conversionRate}% | ${dy?.conversionRate}% |
| Store Rating        | ${tmall?.storeRating}/5.0 | ${pdd?.storeRating}/5.0 | ${jd?.storeRating}/5.0 | ${dy?.storeRating}/5.0 |
| Ad Spend (ROI)      | ¥${tmall?.adSpend.toLocaleString()} (${tmall?.adRoi}:1) | ¥${pdd?.adSpend.toLocaleString()} (${pdd?.adRoi}:1) | ¥${jd?.adSpend.toLocaleString()} (${jd?.adRoi}:1) | ¥${dy?.adSpend.toLocaleString()} (${dy?.adRoi}:1) |
| Return Rate         | ${tmall?.returnRate}% | ${pdd?.returnRate}% | ${jd?.returnRate}% | ${dy?.returnRate}% |

## 流量结构 (Traffic Breakdown — Tmall Flagship)
- Organic Search: ${tmall?.organicSearchPct}%
- Paid Search (直通车/搜索推广): ${tmall?.paidSearchPct}%
- Recommendation Feed: ${tmall?.recommendationFeedPct}%
- Live Commerce: ${tmall?.liveCommercePct}%
- Content/Short Video: ${tmall?.shortVideoPct}%
- Repeat Customers & Private Domain: ${tmall?.privateDomainPct}%

## 标题优化与单品列表 (Optimized SKU Titles)
${listings
  .map(
    (l) =>
      `- **${l.platform} (${l.skuCode} · ¥${l.retailPrice} · ${l.roleTag})**: \`${l.optimizedTitle}\``
  )
  .join('\n')}
`;
  };

  const handleCopyMarkdownReport = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to complete Google Sign-In.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: [Brand title, one line] — [5 nav links, single-line] — [1 primary action] */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('storefronts');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
        >
          China E-Commerce Operator
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('storefronts')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'storefronts'
                ? 'border-red-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Storefronts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'listings'
                ? 'border-red-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Listing Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'campaigns'
                ? 'border-red-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Campaign War Room
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ads_live')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'ads_live'
                ? 'border-red-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Ad Stack & Live
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unit_economics')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'unit_economics'
                ? 'border-red-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Unit Economics
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setShowMarkdownModal(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Export Operations Report
          </button>
        </div>
      </header>

      {/* Mobile Section Switcher (visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {(
          [
            ['storefronts', 'Storefronts'],
            ['listings', 'Listing Studio'],
            ['campaigns', 'Campaign War Room'],
            ['ads_live', 'Ad Stack & Live'],
            ['unit_economics', 'Unit Economics'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeTab === key
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Content Container (1440px Desktop Presence) */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Operator Identity & Cloud Sync Context Strip */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center">
              {!avatarFallback ? (
                <img
                  src={GENERATED_IMAGES.operatorAvatar}
                  alt="Chief China E-Commerce Operator"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFallback(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Taobao · Tmall · Pinduoduo · JD · Douyin Shop Operations Command
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                <span>Double 11 Countdown: 58 Days Out</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>Target ROAS &ge; 3.0:1</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>
                  {user
                    ? `Cloud Firestore Synced (${user.email})`
                    : 'Local Session Mode — Sign in with Google to persist across devices'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {authError && (
              <span className="text-xs text-red-600 max-w-xs truncate">{authError}</span>
            )}
            {user ? (
              <button
                type="button"
                onClick={() => signOutUser()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Cloud className="w-3.5 h-3.5 text-red-600" />
                Sign In with Google to Persist Data
              </button>
            )}
          </div>
        </div>

        {/* Active View Viewport */}
        {activeTab === 'storefronts' && (
          <StorefrontOverviewView
            storefronts={storefronts}
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
            onUpdateStorefront={handleUpdateStorefront}
            onCopyMarkdownReport={handleCopyMarkdownReport}
            copiedReport={copiedReport}
          />
        )}

        {activeTab === 'listings' && (
          <ListingStudioView
            listings={listings}
            onSaveListing={handleSaveListing}
          />
        )}

        {activeTab === 'campaigns' && (
          <CampaignWarRoomView
            tasks={campaignTasks}
            onToggleTask={handleToggleCampaignTask}
            onAddTask={handleAddCampaignTask}
          />
        )}

        {activeTab === 'ads_live' && (
          <AdAndLiveView
            adCampaigns={adCampaigns}
            onUpdateAdCampaign={handleUpdateAdCampaign}
          />
        )}

        {activeTab === 'unit_economics' && (
          <UnitEconomicsView
            listings={listings}
            storefronts={storefronts}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 px-6">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            China E-Commerce Operator Workbench · Multi-Platform Storefront, Live Commerce & Campaign Engineering
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowMarkdownModal(true)}
              className="hover:text-slate-900 transition-colors"
            >
              View Markdown Deliverables
            </button>
          </div>
        </div>
      </footer>

      {/* Markdown Operations Deliverable Modal */}
      {showMarkdownModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h2 className="text-base font-semibold text-slate-900">
                  China E-Commerce Operations Markdown Deliverable
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyMarkdownReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedReport ? 'Copied Markdown' : 'Copy Markdown'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMarkdownModal(false)}
                  className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <pre className="text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-4 whitespace-pre-wrap text-slate-800 leading-relaxed">
                {generateMarkdownReport()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <OperatorWorkbench />
    </ErrorBoundary>
  );
}
