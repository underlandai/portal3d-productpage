// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly FROM_EMAIL: string;
  readonly WEBSITE_EMAIL: string;
  readonly SUBSCRIBERS_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
