import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

import { verifySignature } from "@upstash/qstash/nextjs";

const redis = Redis.fromEnv();

/**
 * Load the current bitcoin price in USD and store it in our database at the current timestamp
 */
async function handler(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const bitcoinPrice = await fetch("https://blockchain.info/ticker").then(
            (r) => r.json(),
        ).then((r) => r["USD"]["last"]) as number;

        await redis.zadd("bitcoin-prices", {
            score: Date.now(),
            member: bitcoinPrice,
        });

        res.send("OK");
    } catch (err) {
        res.status(500).send(err);
    } finally {
        res.end();
    }
}
export default verifySignature(handler, {
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY
});



export const config = {
    api: {
        bodyParser: false,
    },
};
