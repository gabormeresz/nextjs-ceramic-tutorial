"use client";

import styles from "./page.module.css";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { useViewerConnection } from "@self.id/react";
import { EthereumAuthProvider } from "@self.id/web";
import RecordSetter from "./components/RecordSetter";

export default function Home() {
  const [connection, connect, disconnect] = useViewerConnection();

  const web3ModalRef = useRef();

  const getProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    const wrappedProvider = new Web3Provider(provider);
    return wrappedProvider;
  };

  const connectToSelfID = async () => {
    const ethereumAuthProvider = await getEthereumAuthProvider();
    connect(ethereumAuthProvider);
  };

  const getEthereumAuthProvider = async () => {
    const wrappedProvider = await getProvider();
    const signer = wrappedProvider.getSigner();
    const address = await signer.getAddress();
    return new EthereumAuthProvider(wrappedProvider.provider, address);
  };

  useEffect(() => {
    if (connection.status !== "connected") {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [connection.status]);

  return (
    <main className={styles.main}>
      <div className={styles.main}>
        <div className={styles.navbar}>
          <span className={styles.title}>Ceramic Demo</span>
          {connection.status === "connected" ? (
            <span className={styles.subtitle}>Connected</span>
          ) : (
            <button
              onClick={connectToSelfID}
              className={styles.button}
              disabled={connection.status === "connecting"}
            >
              Connect
            </button>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.connection}>
            {connection.status === "connected" ? (
              <div>
                <span className={styles.subtitle}>
                  Your 3ID is {connection.selfID.id}
                </span>
                <RecordSetter />
              </div>
            ) : (
              <span className={styles.subtitle}>
                Connect with your wallet to access your 3ID
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
