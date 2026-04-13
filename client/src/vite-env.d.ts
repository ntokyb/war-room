/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WAR_ROOM_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
