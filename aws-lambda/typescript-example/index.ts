import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { createHash, createHmac } from "node:crypto";
export const handler = async (
  event: APIGatewayEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
  console.log("Custom message")

  const signature = event.headers["upstash-signature"]!;
  const currentSigningKey = process.env["QSTASH_CURRENT_SIGNING_KEY"];
  const nextSigningKey = process.env["QSTASH_NEXT_SIGNING_KEY"];
  const url = `https://${event.requestContext.domainName}`;

  console.log({ signature, currentSigningKey, nextSigningKey, url })
  try {
    // Try to verify the signature with the current signing key and if that fails, try the next signing key
    // This allows you to roll your signing keys once without downtime
    try {
      verify(signature, currentSigningKey, event.body, url)
    } catch (err) {
      console.error(
        `Failed to verify signature with current signing key: ${err}`,
      );
      verify(signature, nextSigningKey, event.body, url);

    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err instanceof Error ? err.toString() : err,
    };
  }

  // Add your business logic here
  console.log("Doing work")
  return {
    statusCode: 200,
    body: "OK",
  };
};

/**
 * @param jwt - The content of the `upstash-signature` header
 * @param signingKey - The signing key to use to verify the signature (Get it from Upstash Console)
 * @param body - The raw body of the request
 * @param url - The public URL of the lambda function
 */
function verify(
  jwt: string,
  signingKey: string,
  body: string | null,
  url: string,
): void {
  const split = jwt.split(".");
  if (split.length != 3) {
    throw new Error("Invalid JWT");
  }
  const [header, payload, signature] = split;

  if (
    signature !=
    createHmac("sha256", signingKey)
      .update(`${header}.${payload}`)
      .digest("base64url")
  ) {
    throw new Error("Invalid JWT signature");
  }
  // Now the jwt is verified and we can start looking at the claims in the payload
  const p: {
    sub: string;
    iss: string;
    exp: number;
    nbf: number;
    body: string;
  } = JSON.parse(Buffer.from(payload, "base64url").toString());

  if (p.iss !== "Upstash") {
    throw new Error(`invalid issuer: ${p.iss}, expected "Upstash"`);
  }
  if (p.sub !== url) {
    throw new Error(`invalid subject: ${p.sub}, expected "${url}"`);
  }

  const now = Math.floor(Date.now() / 1000);
  if (now > p.exp) {
    throw new Error("token has expired");
  }
  if (now < p.nbf) {
    throw new Error("token is not yet valid");
  }

  if (body != null) {
    if (
      p.body.replace(/=+$/, "") !=
      createHash("sha256").update(body).digest("base64url")
    ) {
      throw new Error("body hash does not match");
    }
  }
}
