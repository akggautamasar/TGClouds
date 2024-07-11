import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Component() {
  const user = await currentUser()

  if (user) return redirect('/connect-telegram')

  return (
    <section className="w-full bg-white py-20 md:py-32 lg:py-40">
      <div className="container flex flex-col-reverse items-center justify-between gap-10 px-4 md:flex-row md:gap-16">
        <div className="max-w-md space-y-6 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-5xl">
            Unlimited Storage <span className="text-red-600">for Everyone</span>
          </h1>
          <p className="md:text-xl text-muted-foreground text-lg mb-8">
            Experience the freedom of unlimited storage with our cloud platform.
            Store, share, and access your files from anywhere.
          </p>
        </div>
        <div className="w-full max-w-md">
          <SignIn forceRedirectUrl="/connect-telegram" />
        </div>
      </div>
    </section>
  );
}
