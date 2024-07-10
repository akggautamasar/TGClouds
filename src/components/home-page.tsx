
import Footer from "@/components/footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link"

export function HomePage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1 bg-background text-foreground">
        <div className="max-w-6xl mx-auto bg-background flex-1 text-foreground">
          <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Unlimited Cloud Storage for Everyone
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Access your files from anywhere, securely backed up and
                  protected. Powered by Telegram, our cloud storage service
                  offers unlimited storage space for all your digital needs.
                </p>
                <div>
                  <Link
                    href="/auth/login"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              <div>
                <Image
                  src="https://img.freepik.com/free-photo/cloud-computing-illustration-icon_53876-65610.jpg?w=826&t=st=1720545718~exp=1720546318~hmac=c7a207fe6dffbc74debeda5767667091f5bc1e62ae9f29f3113ae9873ea11186"
                  width={600}
                  height={400}
                  alt="Telegram Cloud"
                  className="rounded-lg"
                />
              </div>
            </div>
          </section>
        </div>

        <section className="bg-muted text-muted-foreground py-12 md:py-24 lg:py-32">
          <div className="max-w-6xl mx-auto bg-muted flex-1 text-muted-foreground">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Image
                    src="https://img.freepik.com/free-photo/3d-render-concept-online-storage-clouds_1048-4189.jpg?t=st=1720545807~exp=1720549407~hmac=c9ec7f77781ed8ba6706303cf8c084cd7d20b4a551ff5e0f6ec292d5d88cc2ac&w=740"
                    width={600}
                    height={400}
                    alt="Secure Storage"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Secure and Reliable Storage
                  </h2>
                  <p className="text-lg mb-8">
                    Your data is protected with end-to-end encryption, ensuring
                    your files are safe and secure. Our service is built on
                    Telegram&apos;s robust infrastructure, providing reliable
                    and fast access to your cloud storage.
                  </p>
                  <div>
                    <Link
                      href="/auth/login"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      prefetch={false}
                    >
                      Start Using Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


