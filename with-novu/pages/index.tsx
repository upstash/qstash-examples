import { Button, Display, Fieldset, Grid, Input, Link, Page, Spacer, Tag, Text, useInput, useToasts } from '@geist-ui/core'
import { NovuProvider, useNotifications } from '@novu/notification-center'
import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import type { AddRequest } from './api/task/add'
import { useUserId } from '../lib/useUserId'



const Notifications: React.FC = () => {
  const { notifications, markAsSeen, refetch } = useNotifications();
  setInterval(refetch, 2000)


  const { setToast } = useToasts()
  useEffect(() => {
    notifications.filter(n => !n.seen).forEach((n) => {
      console.log({ n })

      switch (n.templateIdentifier) {
        case "add.success":
          setToast({
            text: <Text>{`Success: ${n.payload["x"]} + ${n.payload["y"]} = ${n.payload["result"]}`}</Text>,
          })
          break;
        case "add.failure":
          setToast({
            text: <Text>{`Failed to add: ${n.payload["x"]} + ${n.payload["y"]}: ${n.payload["error"]}`}</Text>,
            type: "error"
          })
          break

        default:
          setToast({
            text: <Text>{`Unknown template: ${n.templateIdentifier}`}</Text>,
            type: "warning"
          })
      }

      markAsSeen(n._id)
    })

  }, [notifications])

  return null
}

const Home: NextPage = () => {



  const { setToast } = useToasts({ placement: "topRight" })


  const [userId] = useUserId()
  console.log("random user id:", userId)
  const [loading, setLoading] = useState(false)

  async function createTask(req: AddRequest): Promise<void> {
    const res = await fetch("/api/task/add", {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (res.status !== 201) {
      const err = ((await res.json()) as { error: string }).error
      setToast({
        text: err,
        type: "error"
      })

      return
    }

  }


  const x = useInput((Math.random() * 100).toFixed(0))
  const y = useInput((Math.random() * 100).toFixed(0))

  return (
    <Page>
      <Grid.Container justify="center" alignItems="center">

        <Grid>



          <Text h2>Asynchronous serverless processing with <Link color href="https://upstash.com/qstash">QStash</Link> and notifications by <Link color href="https://novu.co/">novu</Link></Text>
        </Grid>
        <Display shadow>
          <NovuProvider subscriberId={userId} applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID!}>
            <Notifications />
          </NovuProvider>

          <Fieldset>

            <Fieldset.Content>
              <Fieldset.Title>Add these numbers asynchronously</Fieldset.Title>
              <Grid.Container padding={2} alignItems="center" justify="center">

                <Input label="x" {...x.bindings} required htmlType='number'></Input>
                <Spacer />
                +
                <Spacer />
                <Input label="y"{...y.bindings} required htmlType='number'></Input>
              </Grid.Container>
            </Fieldset.Content>
            <Fieldset.Footer>
              <Grid.Container justify="center">

                <Button type="secondary" scale={2 / 3} disabled={loading} loading={loading} onClick={async () => {
                  if (x.state === "") {
                    setToast({
                      text: "x is empty"
                      , type: "error"
                    })
                    return
                  }
                  if (y.state === "") {
                    setToast({
                      text: "y is empty"
                      , type: "error"
                    })
                    return
                  }
                  let xValue = 0
                  let yValue = 0
                  try {

                    xValue = parseFloat(x.state)
                    if (Number.isNaN(xValue)) {
                      setToast({
                        text: `Unable to parse "${x.state}"`
                        , type: "error"
                      })
                      return
                    }
                    yValue = parseFloat(y.state)
                    if (Number.isNaN(yValue)) {
                      setToast({
                        text: `Unable to parse "${y.state}"`
                        , type: "error"
                      })
                      return
                    }
                  } catch (err) {
                    setToast({
                      text: (err as Error).message,
                      type: "error"
                    })
                    return
                  }
                  await createTask({ userId, x: xValue, y: yValue })

                  setLoading(false)




                }}>Add</Button>
              </Grid.Container>
            </Fieldset.Footer>
          </Fieldset>


        </Display >
      </Grid.Container>

    </Page >

  )
}

export default Home
