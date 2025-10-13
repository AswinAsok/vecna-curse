import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/",
                "src/test/",
                "**/*.d.ts",
                "**/*.config.*",
                "**/mockData",
                "dist/",
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@/components": path.resolve(__dirname, "./src/components"),
            "@/features": path.resolve(__dirname, "./src/features"),
            "@/core": path.resolve(__dirname, "./src/core"),
            "@/utils": path.resolve(__dirname, "./src/utils"),
            "@/types": path.resolve(__dirname, "./src/types"),
            "@/config": path.resolve(__dirname, "./src/config"),
            "@/lib": path.resolve(__dirname, "./src/lib"),
            "@/app": path.resolve(__dirname, "./src/app"),
        },
    },
});
