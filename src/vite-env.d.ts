interface ImportMetaEnv {
  readonly VITE_COUNTER_NS?: string
  readonly VITE_COUNTER_KEY?: string
  readonly VITE_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
