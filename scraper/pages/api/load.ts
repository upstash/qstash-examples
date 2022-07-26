import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

type Prices = {
  /**
   * Timestamp with millisecond precision
   */
  ts: number;
  /**
   * Bitcoin price in ISD
   */
  value: number;
}[];

/**
 * Load the scraped data from the database and return it
 */
async function handler(_req: NextApiRequest, res: NextApiResponse<Prices>) {
  try {
    const raw = await redis.zrange<string[]>("bitcoin-prices", 0, -1, {
      withScores: true,
    });

    const prices: Prices = [];
    while (raw.length >= 2) {
      const value = parseFloat(raw.shift()!);
      const ts = parseFloat(raw.shift()!);
      prices.push({ ts, value });
    }

    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500);
  } finally {
    res.end();
  }
}
export default handler;
