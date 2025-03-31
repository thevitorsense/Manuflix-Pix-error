/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUSHINPAY_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
