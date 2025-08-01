"use client";

import { CDPReactProvider } from '@coinbase/cdp-react';

const cdpConfig = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID!,
  basePath: "https://api.cdp.coinbase.com/platform",
  useMock: false,
  debugging: true, // Enable debugging to see detailed errors
};

const appConfig = {
  name: "Next.js + Notion — Waitlist Template",
  logoUrl: "/waitlist-logo.png",
};

export function CDPProvider({ children }: { children: React.ReactNode }) {
  return (
    <CDPReactProvider config={cdpConfig} app={appConfig}>
      {children}
    </CDPReactProvider>
  );
}