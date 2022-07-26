import type {NextPage} from "next";

const Home: NextPage = () => {
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

        <div className="grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-gray-700">Full name</span>
            <input type="text" className="mt-1 block w-full" placeholder=""/>
          </label>
          <label className="block">
            <span className="text-gray-700">Email address</span>
            <input type="email" className="mt-1 block w-full" placeholder="john@example.com"/>
          </label>
          <label className="block">
            <span className="text-gray-700">When is your event?</span>
            <input type="date" className="mt-1 block w-full"/>
          </label>
          <label className="block">
            <span className="text-gray-700">What type of event is it?</span>
            <select className="block w-full mt-1">
              <option>Corporate event</option>
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Other</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Additional details</span>
            <textarea className="mt-1 block w-full" rows={3}></textarea>
          </label>
          <div className="block">
            <div className="mt-2">
              <div>
                <label className="inline-flex items-center">
                  <input type="checkbox"/>
                  <span className="ml-2">Email me news and special offers</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <button>Submit</button>
          </div>
        </div>

        <hr className="my-10"/>

        <pre>{`// pages/_middleware.js

export default function middleware (req, ev) {
  console.log('Edit and run at the edge!')

  return new Response({
    ip: req.ip,
    geo: req.geo, // this will spin the globe!
    ua: req.ua
  })
}`}
        </pre>
      </main>
    </>
  );
};

export default Home;