/**
 * Phase 0: Payload-First Security TDD Test Suite
 * Verifies all 12 "Dirty Dozen" adversarial payloads are rejected with PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'create' | 'update' | 'get' | 'list';
  auth: { uid: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Identity Spoofing on Storefront Create',
    collection: 'storefronts',
    docId: 'sf_tmall_01',
    operation: 'create',
    auth: { uid: 'attacker_uid', email_verified: true },
    payload: { ownerId: 'victim_uid_999', platform: 'Taobao/Tmall', brandName: 'Aura' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Email Token Write',
    collection: 'listings',
    docId: 'sku_01',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: false },
    payload: { ownerId: 'user_1', skuCode: 'SKU-01', platform: 'JD' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Listing Update',
    collection: 'listings',
    docId: 'sku_01',
    operation: 'update',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', isVerifiedOfficialFlagship: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'OwnerId Mutation on Campaign Task Update',
    collection: 'campaigns',
    docId: 'task_01',
    operation: 'update',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_2', completed: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Client-Forged Timestamp Injection',
    collection: 'ad_campaigns',
    docId: 'ad_01',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', updatedAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'ID Poisoning Attack',
    collection: 'storefronts',
    docId: 'invalid$id!with*spaces',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Denial-of-Wallet Oversized String Payload',
    collection: 'listings',
    docId: 'sku_01',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', optimizedTitle: 'A'.repeat(5000) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Enum Violation on Platform Field',
    collection: 'storefronts',
    docId: 'sf_01',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', platform: 'AmazonUS' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Value Poisoning on Update (Type Confusion)',
    collection: 'ad_campaigns',
    docId: 'ad_01',
    operation: 'update',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', dailyBudget: 'ten_thousand_rmb' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Unauthorized Cross-Tenant Get',
    collection: 'storefronts',
    docId: 'sf_owned_by_uid_B',
    operation: 'get',
    auth: { uid: 'uid_A', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Unfiltered Collection Scraping',
    collection: 'listings',
    docId: '*',
    operation: 'list',
    auth: { uid: 'uid_A', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unauthorized Action-Based Update Field Modification',
    collection: 'campaigns',
    docId: 'task_01',
    operation: 'update',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', undeclaredGhostField: 123 },
    expectedResult: 'PERMISSION_DENIED',
  },
];
