import { useState } from "react"

export const useUserId: () => [string, (s: string) => void] = () => {
    const key = "qstash+novuhq:userId"

    const [userId, setUserId] = useState<string>(() => {
        if (typeof window === "undefined") {
            return ""
        }
        return window.localStorage.getItem(key) ?? Math.random().toFixed(10)

    })

    const setValue = (value: string) => {
        if (typeof window === "undefined") {
            return
        }
        setUserId(value)
        try {

            window.localStorage.setItem(key, value)
        } catch (err) {
            console.error(err)
        }
    }


    return [userId, setValue]


}