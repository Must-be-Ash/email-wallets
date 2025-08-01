"use client";

import { useIsSignedIn, useEvmAddress } from "@coinbase/cdp-hooks";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animation-variants";

export default function WalletStatus() {
  const isSignedIn = useIsSignedIn();
  const evmAddress = useEvmAddress();

  if (!isSignedIn) {
    return null;
  }

  return (
    <motion.div
      variants={itemVariants}
      className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-center text-sm text-green-400"
    >
      <p className="font-medium">✅ Wallet Connected</p>
      {evmAddress && (
        <p className="mt-1 font-mono text-xs text-green-300/80">
          {evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}
        </p>
      )}
    </motion.div>
  );
}