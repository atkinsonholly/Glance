import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import customTheme from "@/styles/theme";
import Layout from "@/components/layout";
import Loading from "@/components/atoms/Loading";

import type { AppProps } from "next/app";

const { chains, provider } = configureChains(
  [polygonMumbai, polygon],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || "" }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Glance',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})
 
const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

const ClientApp = ({ Component, pageProps }: AppProps) => {

  const router = useRouter();
  const [routerIsLoading, setRouterIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.pathname) setRouterIsLoading(true);
      else setRouterIsLoading(false);
    };
    const handleComplete = (_url: string) => setRouterIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
  }, [router]);
  
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <LivepeerConfig client={livepeerClient}>
          <ChakraProvider theme={customTheme}>
            <Head>
              <meta content="width=device-width, initial-scale=1" name="viewport" />
              <link
                href="/eye_favicon.jpeg"
                rel="shortcut icon"
                type="image/x-icon"
              />
              <link
                href="/eye_favicon.jpeg"
                rel="apple-touch-icon"
              />
              <link rel="preload" href="/fonts/RubikGlitch-Regular.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-Black.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-BlackItalic.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-Bold.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-BoldItalic.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-ExtraBold.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-ExtraBoldItalic.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-Italic.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-Light.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-LightItalic.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-Medium.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-MediumItalic.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-Regular.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-SemiBold.ttf" as="font" crossOrigin="" />
              <link rel="preload" href="/fonts/Rubik-SemiBoldItalic.ttf" as="font" crossOrigin="" />
              
            </Head>
            <Layout>
              {routerIsLoading && <Loading />}
              {!routerIsLoading && <Component {...pageProps} />}
            </Layout>
          </ChakraProvider>
        </LivepeerConfig>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ClientApp