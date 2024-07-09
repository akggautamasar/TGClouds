import { SignIn } from "@clerk/nextjs";

import Link from "next/link";

export default function Component() {
  return (
    <section className="w-full bg-white py-20 md:py-32 lg:py-40">
      <div className="container flex flex-col-reverse items-center justify-between gap-10 px-4 md:flex-row md:gap-16">
        <div className="max-w-md space-y-6 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[#00b894] sm:text-4xl md:text-5xl">
            Unlimited Storage for Your Cloud
          </h1>
          <p className="text-lg text-[#00b894]/90 md:text-xl">
            Experience the freedom of unlimited storage with our cloud platform.
            Store, share, and access your files from anywhere.
          </p>
          <div>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-[#00b894] px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-[#00a383] focus:outline-none focus:ring-2 focus:ring-[#00b894] focus:ring-offset-2 focus:ring-offset-white"
              prefetch={false}
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="w-full max-w-md">
          <SignIn fallbackRedirectUrl="/connect-telegram" />
        </div>
      </div>
    </section>
  );
}
