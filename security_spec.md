# Security Specification: China E-Commerce Operator

## 1. Data Invariants & Relationship Mapping
- **Master Source of Truth**: Every document in `/storefronts/{storefrontId}`, `/listings/{listingId}`, `/campaigns/{campaignId}`, and `/ad_campaigns/{adCampaignId}` is owned directly by a verified Google-authenticated operator (`ownerId == request.auth.uid` and `request.auth.token.email_verified == true`).
- **Path Variable Hardening**: All document IDs (`storefrontId`, `listingId`, `campaignId`, `adCampaignId`) must satisfy `isValidId(id)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
- **Strict Key Allowlisting & Anti-Update-Gap**:
  - `create` and `update` operations must pass `isValidStorefrontMetrics(incoming())`, `isValidProductListing(incoming())`, `isValidCampaignTask(incoming())`, or `isValidAdCampaign(incoming())`.
  - `ownerId` is immutable on update (`incoming().ownerId == existing().ownerId`).
  - `updatedAt` must strictly equal `request.time`.
- **Secure List Queries**: `allow list` must explicitly check `resource.data.ownerId == request.auth.uid` without delegating security to client-side filtering.

## 2. The "Dirty Dozen" Payloads

1. **Identity Spoofing on Storefront Create**:
   `{ "ownerId": "victim_uid_999", "platform": "Taobao/Tmall", "brandName": "SpoofBrand", ... }`
2. **Unverified Email Token Write**:
   Authenticated request with `request.auth.token.email_verified == false` attempting to create a `/listings/{listingId}` document.
3. **Shadow Field Injection on Listing Update**:
   `{ ...validListingPayload, "isVerifiedOfficialFlagship": true }`
4. **OwnerId Mutation on Campaign Task Update**:
   Updating `/campaigns/task_1` with `incoming().ownerId = "other_operator_uid"`.
5. **Client-Forged Timestamp Injection**:
   Creating `/ad_campaigns/ad_1` with `updatedAt: Timestamp.fromMillis(1700000000000)` instead of `serverTimestamp()` (`request.time`).
6. **ID Poisoning Attack**:
   Creating a document at `/storefronts/invalid$id!with*spaces` or a 2048-character document ID.
7. **Denial-of-Wallet Oversized String Payload**:
   Creating `/listings/sku_1` with `optimizedTitle` containing a 50,000-character string (`> 120` maxLength).
8. **Enum Violation on Platform Field**:
   Creating `/storefronts/sf_1` with `platform: "AmazonUS"` (not in `['Taobao/Tmall', 'Pinduoduo', 'JD', 'Douyin Shop']`).
9. **Value Poisoning on Update (Type Confusion)**:
   Updating `/ad_campaigns/ad_1` with `dailyBudget: "ten_thousand_rmb"` (string instead of number) or negative budget.
10. **Unauthorized Cross-Tenant Get**:
    Operator `uid_A` attempting `get(/storefronts/sf_owned_by_uid_B)`.
11. **Unfiltered Collection Scraping (`list` without owner filter)**:
    Operator `uid_A` executing `getDocs(collection(db, 'listings'))` without `.where('ownerId', '==', 'uid_A')`.
12. **Unauthorized Action-Based Update Field Modification**:
    Updating `/campaigns/task_1` with an undeclared field not included in `affectedKeys().hasOnly(...)`.
