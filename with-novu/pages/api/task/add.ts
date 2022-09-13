import { NextApiRequest, NextApiResponse } from "next";
import { Novu } from '@novu/node';
import { Client } from "@upstash/qstash"
import assert from "assert";
import { randomUUID } from "crypto";

export type AddRequest = {
    userId: string
    x: number
    y: number
}
export type AddResponse = {
    taskId: string
}
export type ErrorResponse = {
    error: string
}



export default async function (req: NextApiRequest, res: NextApiResponse<AddResponse | ErrorResponse>): Promise<void> {
    try {

        const novuApiKey = process.env.NOVU_API_KEY;
        assert(novuApiKey, "NOVU_API_KEY is not defined")
        const qstashToken = process.env.QSTASH_TOKEN;
        assert(qstashToken, "QSTASH_TOKEN is not defined");

        const novu = new Novu(novuApiKey)
        const qstash = new Client({
            token: qstashToken,
        })

        const { userId, x, y } = req.body as AddRequest
        const taskId = randomUUID()

        await qstash.publishJSON({
            url: `https://${process.env.VERCEL_URL}/api/task/process`,
            retries: 3,
            body: {
                taskId,
                userId,
                x,
                y,
            }
        })

        res.status(201)
        res.json({ taskId })
        return

    } catch (error) {
        console.error((error as Error).message)
        res.status(500).json({ error: (error as Error).message })
    } finally {
        res.end()
    }
}


