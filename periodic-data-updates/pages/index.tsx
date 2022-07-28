import type { GetStaticPropsResult, NextPage } from "next";
import { Line } from "@ant-design/plots";
import { Redis } from "@upstash/redis";
import Link from "next/link";

const redis = Redis.fromEnv();

type Price = {
  /**
   * Unix timestamp in milliseconds
   */
  time: number;
  /**
   * Price in USD
   */
  value: number;
};

const Home: NextPage<{ prices: Price[] }> = ({ prices }) => {
  return (
    <>
      <main className="space-y-10">
        <header>
          <h1 className="text-4xl font-bold">
            <span className="text-primary-500">
              qStash scheduled-db-updates example
            </span>
          </h1>

          <p className="mt-4">
            This is an example of using qStash to trigger Next.js serverless
            functions to fetch updates from an external API using CRON schedules
          </p>

          <p className="mt-4">
            The api route <code>/api/cron</code>{" "}
            is triggered every 10 minutes by{" "}
            <Link href="https://console.upstash.com/qstash">
              <a className="border-b border-primary-500 hover:text-primary-500">
                qStash
              </a>
            </Link>{" "}
            and loads data into our database. On this page you can see the
            aggregated data.
          </p>
        </header>

        <h2 className="text-xl font-bold">Bitcoin price in USD over time</h2>
        <Line
          data={prices.map(({ time, value }) => ({
            time: new Date(time).toLocaleString(),
            value,
          }))}
          padding="auto"
          xField="time"
          yField="value"
          color="#10b981"
          xAxis={{
            tickCount: 5,
          }}
          yAxis={{
            label: {
              formatter: (value) => `$${parseFloat(value).toLocaleString()}`,
            },
          }}
        />
      </main>
    </>
  );
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ prices: Price[] }>
> {
  const raw = await redis.zrange<string[]>("bitcoin-prices", 0, -1, {
    withScores: true,
  });

  const prices: Price[] = [];
  while (raw.length >= 2) {
    const value = parseFloat(raw.shift()!);
    const time = parseFloat(raw.shift()!);
    prices.push({ time, value });
  }

  return {
    props: {
      prices,
    },
    revalidate: 60,
  };
}

export default Home;
