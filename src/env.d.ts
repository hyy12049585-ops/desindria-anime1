// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // هر env دیگه‌ای که داری اضافه کن
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
