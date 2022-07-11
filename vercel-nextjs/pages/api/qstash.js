import { verifySignature } from "@upstash/qstash/nextjs";

async function handler(req, res) {

    console.log("If this is printed, the signature has already been verified");

    // do stuff


    res.status(200).end();
}

export default verifySignature(handler, {
    "currentSigningKey": process.env.QSTASH_CURRENT_SIGNING_KEY,
    "nextSigningKey": process.env.QSTASH_NEXT_SIGNING_KEY,
});

export const config = {
    api: {
        bodyParser: false,
    },
};