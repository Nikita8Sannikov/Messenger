import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";

// Vite автоматически поддерживает Typescript, поэтому дополнительных полей указывать не нужно.
// Vite также автоматически загружает env переменные в зависимости от NODE_ENV переменной, которая устанавливается при запуске команды npm run dev/build и тд.
// В этих командах NODE_ENV устанавливается автоматически.

export default defineConfig({
    plugins: [
        react({
            jsxImportSource: "@emotion/react",
            babel: {
                plugins: ["@emotion/babel-plugin"],
            },
        })
    ],
    build: {
        outDir: "dist",      // Директория для сборки продакшен бандла
        target: browserslistToEsbuild([">0.2%", "not dead", "last 2 versions"])   // Установка browerlists
    },
    publicDir: "public",    // Директория для статичных файлов (дает возможность обращаться к картинках/шрифтам и тд прямиком из папки public)
    server: {
        open: true,         // Автоматически открывает браузер при запуске проекта
        port: 3000          // Порт локального сервера для разработки клиента
    }
});