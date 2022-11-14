import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";

const botConfig = {
  name: "Best of NYTimes Bot",
  url: "https://picsum.photos/200", // random image
};

// Q: How to work with the Discord Webhook API?
// A: https://gist.github.com/Birdie0/78ee79402a4301b1faf412ab5f1cdcf9
// Q: How does the NYTimes response look like?
// A: https://developer.nytimes.com/docs/most-popular-product/1/routes/viewed/%7Bperiod%7D.json/get
const sendMessage = (json: any) => {
  return fetch(process.env.DISCORD_WEBHOOK!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: botConfig.name,
      avatar_url: botConfig.url,
      embeds: json.results.slice(0, 5).map((article: any) => {
        return {
          title: article.title,
          description: article.abstract,
          url: article.url,
        };
      }),
    }),
  });
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const decoded = Buffer.from(req.body.body, "base64");
    const json = JSON.parse(decoded.toString());
    const result = await sendMessage(json);
    if (!result.ok) {
      return res.status(500).end();
    }
    return res.status(201).end();
  } catch (e) {
    return res.status(500).end(e);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default verifySignature(handler);
