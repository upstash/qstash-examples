import { verifySignature } from "@upstash/qstash/nextjs";

function handler(_req, res) {
  console.log("If this is printed, the signature has already been verified");

  // do stuff

  res.status(200).end();
}

/**
 * verifySignature will try to load `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` from the environment.
 */
export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
