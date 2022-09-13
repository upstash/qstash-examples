import { Novu } from "@novu/node";
import { verifySignature } from "@upstash/qstash/nextjs";
import assert from "assert";
import { NextApiRequest, NextApiResponse } from "next";


async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {


        const { userId, x, y } = req.body as { userId: string, taskId: string, x: number, y: number }

        const novuApiKey = process.env.NOVU_API_KEY;
        assert(novuApiKey, "NOVU_API_KEY is not defined")
        const novu = new Novu(novuApiKey)

        const rng = Math.random()
        const success = rng > 0.5

        if (success) {
            const data = {
                to: {
                    subscriberId: userId
                },
                payload: {
                    x: x.toString(),
                    y: y.toString(),
                    result: (x + y).toString()
                }
            }
            console.log({ data })
            const ntr = await novu.trigger('add.success', data).catch(err => {
                throw new Error(`Novu error: ${err.message}`)
            })
            console.log(JSON.stringify(ntr.data, null, 2))

            return res.send("ok")

        }

        if (!success) {
            const error = "simulated error"
            const ntr = await novu.trigger('add.failure', {
                to: {
                    subscriberId: userId
                },
                payload: {
                    x,
                    y,
                    error
                }
            }).catch(err => {
                throw new Error(`Novu error: ${err.message}`)
            })
            console.log(JSON.stringify(ntr.data, null, 2))
            return res.status(500).send(error)

        }

    } catch (error) {
        console.error((error as Error).message)
        res.status(500).json({ error: (error as Error).message })
    } finally {
        res.end()
    }
}

export default verifySignature(handler);

export const config = {
    api: {
        bodyParser: false,
    },
};