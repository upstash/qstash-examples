import { Receiver } from "@upstash/qstash/cloudflare";
export interface Env {
  QSTASH_CURRENT_SIGNING_KEY: string;
  QSTASH_NEXT_SIGNING_KEY: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const c = new Receiver({
      currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
    });

    const body = await request.text();

    const isValid = await c.verify({
      signature: request.headers.get("Upstash-Signature")!,
      body,
    }).catch((err) => {
      console.error(err);
      return false;
    });
    if (!isValid) {
      return new Response("Invalid signature", { status: 401 });
    }
    console.log("The signature was valid");

    // do work here

    return new Response("Hello World!");
  },
};
