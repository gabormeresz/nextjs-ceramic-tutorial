"use client";

import { Provider } from "@self.id/react";

export default function CeramicProvider({ children }) {
  return <Provider client={{ ceramic: "testnet-clay" }}>{children}</Provider>;
}
