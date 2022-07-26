import type {NextPage} from "next";
import { Line } from '@ant-design/plots';
import { Redis } from "@upstash/redis";


const redis = Redis.fromEnv();

type Prices = {
  /**
   * Timestamp with millisecond precision
   */
  ts: number
  /**
   * Bitcoin price in ISD
   */
  value: number
}[]

const Home: NextPage = ({prices}: {prices:{ts: number, value:number}[]}) => {
  return (
    <>
      <main>
        <header>
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-primary-500">next-template</span>
          </h1>

          <p className="mt-4">This is a template for a Next.js example.</p>

          <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias architecto dolores in
            nostrum odit officiis
            omnis optio quis sint suscipit. Accusantium aliquid blanditiis culpa delectus, dicta ea facilis repudiandae
            tenetur.</p>
        </header>

        <hr className="my-10"/>


        <Line 
  
          data={prices}
          padding='auto'
          xField='ts'
          yField='value'        
        />

       

      </main>
    </>
  );
};

export async function getServerSideProps() {
  const raw = await redis.zrange<string[]>("bitcoin-prices", 0, -1, { withScores: true })

    const prices: Prices = []
    while (raw.length >= 2) {
      const value = parseFloat(raw.shift()!)
      const ts = parseFloat(raw.shift()!)
      prices.push({ ts, value })
    }
    console.log({prices})

  return {
    props: {
      prices
    }
  }
}

export default Home;