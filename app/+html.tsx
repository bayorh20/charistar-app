import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#1B5E3B" />
        <meta
          name="description"
          content="Charistar — Premium yogurt, parfait, granola & healthy snacks. Order fresh for Nigerian campus and city delivery."
        />
        <title>Charistar — Healthy Cravings, Delivered Fresh</title>
        <link rel="icon" href="/favicon.ico" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                width: 100%;
                margin: 0;
                padding: 0;
                background: #E8F3EC;
              }
              html {
                height: 100%;
                height: 100dvh;
              }
              body {
                height: 100%;
                height: 100dvh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                overflow: hidden;
                overscroll-behavior: none;
              }
              #root {
                display: flex;
                flex-direction: column;
                height: 100%;
                height: 100dvh;
                min-height: 0;
                overflow: hidden;
              }
              ::-webkit-scrollbar { width: 6px; height: 6px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: #D4E8DC; border-radius: 3px; }
              ::-webkit-scrollbar-thumb:hover { background: #1B5E3B; }
              * { box-sizing: border-box; }
              input, textarea, button { font-family: inherit; }
              a { -webkit-tap-highlight-color: transparent; }
              img { max-width: 100%; height: auto; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
