# Chapter loading

This static site loads chapter iframe URLs from `assets/data/chapters.json`.
Visitors never call Alchemy or Ethereum RPC. No key, Vercel migration, or build
step is needed.

The initial mapping comes from the adjacent `contracts/assets/chapter-*.json`
files and has not yet been verified against the live contract. Chapters 1–7
use token IDs 0–6; chapters 8–21 use their chapter number, as documented in the
contracts project. Token 7 is skipped.

## Refresh chapter destinations

With Node.js 22+ and network access:

```sh
node scripts/refresh-chapters.mjs
```

The script reads the Guardian contract's `tokenURI` values at a single Ethereum
mainnet block, fetches metadata, and stores each `external_url`. It replaces the
snapshot only when every chapter succeeds. Review the JSON diff and deploy the
static files through the normal publishing process.

The default public RPC requires no key but can be unavailable or rate limited.
Set `ETHEREUM_RPC_URL` in your local or CI environment to use another provider.
Never commit credential-bearing URLs. The script does not write the endpoint
into public files.

Guardian updates appear only after refresh and deployment. You can also edit
chapter URLs manually in the JSON; the next refresh replaces those changes.
No recurring refresh has been configured.

The loader reports mapping failures. Browsers cannot reliably detect HTTP errors
inside cross-origin iframes; check destination availability directly as well.
