# Cloudflare Redirect Setup - Final Steps

## Status
✓ **underland.cloud** domain has been removed from Vercel
✓ **app.underland.cloud** is already redirecting correctly (301 → app.underlandex.com)
⚠️ **underland.cloud** needs Cloudflare redirect configuration

---

## Setup Instructions (5 minutes)

### Step 1: Configure DNS in Cloudflare

1. Log into **Cloudflare Dashboard**: https://dash.cloudflare.com/
2. Select the **underland.cloud** domain
3. Go to **DNS → Records**
4. Ensure you have an A or CNAME record for the root domain:
   - **Type**: A
   - **Name**: @ (or leave blank for root)
   - **Content**: Any IP (e.g., `192.0.2.1`) - it won't be used
   - **Proxy status**: ✓ **Proxied** (orange cloud)

### Step 2: Create Redirect Rules

1. Still in Cloudflare for **underland.cloud**
2. Go to **Rules → Redirect Rules** (in left sidebar)
3. Click **Create rule**

**Redirect Rule Configuration:**

```
Rule name: Redirect to underlandex.com

When incoming requests match:
  Field: Hostname
  Operator: equals
  Value: underland.cloud

OR

  Field: Hostname
  Operator: equals
  Value: www.underland.cloud

Then:
  Type: Dynamic
  Expression: concat("https://underlandex.com", http.request.uri.path)
  Status code: 301
  Preserve query string: ✓ (checked)
```

**Screenshot guide:**
- Set **Hostname equals underland.cloud**
- Click **OR** to add second condition
- Set **Hostname equals www.underland.cloud**
- Under "Then" select **Dynamic redirect**
- Enter: `concat("https://underlandex.com", http.request.uri.path)`
- Status code: **301**

4. Click **Deploy**

---

## Alternative: Simple Redirect Rule (If above doesn't work)

If the dynamic expression is complex, use this simpler approach:

1. Create Rule 1:
   - When: `Hostname equals underland.cloud`
   - Then: `Static` → `https://underlandex.com`
   - Status: **301**

2. Create Rule 2:
   - When: `Hostname equals www.underland.cloud`
   - Then: `Static` → `https://underlandex.com`
   - Status: **301**

**Note**: This won't preserve paths, but will work for the homepage redirect needed by Google Search Console.

---

## Verification

After setting up (wait 30-60 seconds), test:

```bash
curl -I http://underland.cloud/
# Expected: 301 Moved Permanently
# Expected: Location: https://underlandex.com/

curl -I https://underland.cloud/
# Expected: 301 Moved Permanently
# Expected: Location: https://underlandex.com/

curl -I https://underland.cloud/some-path
# Expected: 301 Moved Permanently
# Expected: Location: https://underlandex.com/some-path
```

---

## Google Search Console - Final Step

Once redirects are working:

1. Go to: https://search.google.com/search-console
2. Select property: **sc-domain:underland.cloud**
3. Go to **Settings** (gear icon in bottom left)
4. Click **Change of address**
5. Select new site: **sc-domain:underlandex.com**
6. Click **Validate and Submit**

**Expected results:**
- ✓ **301-redirect from homepage**: PASS
- ✓ **301-redirects from sample pages**: PASS
- ✓ **Verification for both sites**: PASS (already done)

---

## Summary of Changes Made

1. ✓ Removed `underland.cloud` from Vercel project
2. ✓ `app.underland.cloud` already redirects correctly via Cloudflare
3. ⚠️ Need to add Cloudflare redirect rule for main `underland.cloud` domain

---

## Troubleshooting

### If redirect doesn't work after 2 minutes:
1. Go to **Caching → Configuration** in Cloudflare
2. Click **Purge Everything**
3. Wait 1 minute and test again

### If you get "Redirect loop":
- Make sure `underlandex.com` is NOT also set up with redirects
- Check that only `underland.cloud` redirects to `underlandex.com`
- Verify proxy status (orange cloud) is enabled

### If Cloudflare asks for verification:
- The domain should already be verified since DNS is managed by Cloudflare
- If not, add a TXT record with the verification code provided

---

## Current Domain Setup

```
underland.cloud → [NEEDS REDIRECT] → underlandex.com
app.underland.cloud → [✓ WORKING] → app.underlandex.com
portal3d.underlandex.com → [✓ ACTIVE] → This Vercel project
```

---

## Questions?

If you encounter any issues:
1. Take a screenshot of the Cloudflare redirect rule configuration
2. Check the Cloudflare DNS records for underland.cloud
3. Verify the domain is using Cloudflare nameservers