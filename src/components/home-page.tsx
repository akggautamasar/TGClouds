import Footer from '@/components/footer';
import Header from '@/components/Header';
import Link from 'next/link';

export function HomePage() {
	return (
		<div className="flex flex-col min-h-[100dvh]">
			<Header />
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container space-y-12 px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
									Introducing TGCloud
								</div>
								<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Secure and Reliable Cloud Storage
								</h1>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									TGCloud is a powerful cloud storage solution that provides a nice user experience
									to access and share files. A mobile app is coming soon.
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
							<Link
								href="/files"
								className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
								prefetch={false}
							>
								Get Started
							</Link>
							<Link
								href="#"
								className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
								prefetch={false}
							>
								Learn More
							</Link>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
						<div className="space-y-3">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Seamless File Sharing and Searching
							</h2>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								TGCloud provides a seamless experience to access, share, and search your files. You
								can easily collaborate with others and find what you need quickly.
							</p>
						</div>
						<div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
							<Link
								href="#"
								className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
								prefetch={false}
							>
								Explore File Sharing
							</Link>
							<Link
								href="#"
								className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
								prefetch={false}
							>
								Learn More
							</Link>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
						<div className="space-y-3">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Secure and Reliable Storage
							</h2>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								TGCloud is built on top of Telegram&apos;s robust infrastructure, ensuring your data
								is secure and protected. With a video player for your videos, you can access and
								watch your files directly within the app.
							</p>
						</div>
						<div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
							<Link
								href="#"
								className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
								prefetch={false}
							>
								Learn More
							</Link>
							<Link
								href="/files"
								className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
								prefetch={false}
							>
								Get Started
							</Link>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
						<div className="space-y-3">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Powerful Features
							</h2>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								TGCloud offers a wide range of features to make your cloud storage experience
								seamless and efficient.
							</p>
						</div>
						<div className="grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
							<div className="grid gap-1">
								<h3 className="text-lg font-bold">Seamless Sharing</h3>
								<p className="text-sm text-muted-foreground">
									Easily share files and folders with your team or friends with just a few clicks.
								</p>
							</div>
							<div className="grid gap-1">
								<h3 className="text-lg font-bold">Powerful Search</h3>
								<p className="text-sm text-muted-foreground">
									Find what you need quickly with TGCloud&apos;s advanced search capabilities.
								</p>
							</div>
							<div className="grid gap-1">
								<h3 className="text-lg font-bold">Mobile Access</h3>
								<p className="text-sm text-muted-foreground">
									Access your files from anywhere with the TGCloud mobile app.
								</p>
							</div>
							<div className="grid gap-1">
								<h3 className="text-lg font-bold">Video Player</h3>
								<p className="text-sm text-muted-foreground">
									Watch your videos directly within the TGCloud app.
								</p>
							</div>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 border-t">
					<div className="container px-4 md:px-6">
						<div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
							<div className="space-y-4">
								<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
									Trusted by Millions
								</div>
								<h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
									Join the TGCloud Community
								</h2>
								<Link
									href="/files"
									className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
									prefetch={false}
								>
									Get Started
								</Link>
							</div>
							<div className="flex flex-col items-start space-y-4">
								<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
									Secure and Reliable
								</div>
								<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
									TGCloud is built on top of Telegram&apos;s robust infrastructure, ensuring your
									data is always safe and accessible. With a video player and seamless sharing, you
									can trust that your files are in good hands.
								</p>
								<Link
									href="#"
									className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
									prefetch={false}
								>
									Contact Sales
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
