export const env = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.makemypass.com",
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
} as const;

// Type for environment variables
export type Env = typeof env;
