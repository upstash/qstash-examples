import "styles/globals.css";

import React from "react";
import type { AppProps } from "next/app";
import Header from "components/Header";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        breadcrumbOptions={{
          data: [
            {
              name: "qstash-examples",
              url: "https://github.com/upstash/qstash-examples",
            },
            {
              name: "scheduled-updater",
              url:
                "https://github.com/upstash/qstash-examples/tree/main/scheduled-updater",
            },
          ],
        }}
      />

      {
        /*<ReadBlogPost>
        This is a sample project for the blogpost{" "}
        <a
          className="text-primary-600"
          target="_blank"
          rel="noopener noreferrer"
          href="https://blog.upstash.com/nextjs-caching-with-redis"
        >
          Example Post
        </a>
      </ReadBlogPost>*/
      }

      <div className="mx-auto w-full max-w-3xl py-14 px-6">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
