import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Cloud, FolderTree, Lock, Play, Zap } from 'lucide-react';
import Link from 'next/link';

export function HomePage() {
	return (
		<div className="flex flex-col min-h-[100dvh]">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Secure Unlimited Storage Solution
								</h1>
								<p className="text-2xl font-semibold text-primary mt-4 mb-6">
									Storage limits got you down? We&apos;ve got your back!
								</p>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
									Our innovative Telegram-powered solution provides unlimited storage capacity,
									while ensuring the security and integrity of your data.
								</p>
							</div>
							<div className="space-x-4">
								<Button asChild>
									<Link href="/files">Get Started</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href="#features">Learn More</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
					<div className="container px-4 md:px-6">
						<h2
							id="features"
							className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12"
						>
							What We&apos;ve Got for You
						</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle>Unlimited Storage</CardTitle>
								</CardHeader>
								<CardContent>
									<Cloud className="w-12 h-12 mb-4" />
									<p>
										Store as much data as you need without any restrictions. Our solution provides
										unlimited storage capacity.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Enhanced Security</CardTitle>
								</CardHeader>
								<CardContent>
									<Lock className="w-12 h-12 mb-4" />
									<p>
										Your files are securely stored in a private Telegram channel, ensuring maximum
										data protection and privacy.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Fast Performance</CardTitle>
								</CardHeader>
								<CardContent>
									<Zap className="w-12 h-12 mb-4" />
									<p>
										Our solution is optimized for performance, ensuring that your uploads and
										downloads are completed quickly and efficiently.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Media Playback</CardTitle>
								</CardHeader>
								<CardContent>
									<Play className="w-12 h-12 mb-4" />
									<p>
										Watch your videos right here, right now. No need to download. It&apos;s like
										having a mini cinema in your pocket!
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Folder Organization</CardTitle>
								</CardHeader>
								<CardContent>
									<FolderTree className="w-12 h-12 mb-4" />
									<p>
										Keep your files neatly organized with folders. Create, manage, and navigate through
										your file structure effortlessly.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							Getting Started
						</h2>
						<ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<li className="flex flex-col items-center text-center">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
									1
								</div>
								<h3 className="mt-4 font-semibold">Sign Up</h3>
								<p className="mt-2 text-sm">
									Create an account quickly and easily on our platform.
								</p>
							</li>
							<li className="flex flex-col items-center text-center">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
									2
								</div>
								<h3 className="mt-4 font-semibold">Connect Telegram</h3>
								<p className="mt-2 text-sm">Securely link your Telegram account to our service.</p>
							</li>
							<li className="flex flex-col items-center text-center">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
									3
								</div>
								<h3 className="mt-4 font-semibold">Start Uploading</h3>
								<p className="mt-2 text-sm">Upload all your digital treasures. Go nuts!</p>
							</li>
						</ol>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							Frequently Asked Questions
						</h2>
						<Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
							<AccordionItem value="item-1">
								<AccordionTrigger>Is the storage truly unlimited?</AccordionTrigger>
								<AccordionContent>
									Yes, our service leverages Telegram&apos;s storage capabilities to provide
									unlimited storage. You can store as much data as you need without any restrictions
									or hidden fees.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger>How secure is the data storage?</AccordionTrigger>
								<AccordionContent>
									Your data is highly secure. All files are stored in a private Telegram channel
									that only you can access, ensuring maximum data protection and privacy.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-3">
								<AccordionTrigger>Do I need Telegram?</AccordionTrigger>
								<AccordionContent>
									Yep, you&apos;ll need a Telegram account. But don&apos;t sweat it, it&apos;s free
									and easy to set up. Just grab the Telegram app and you&apos;re good to go!
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-4">
								<AccordionTrigger>What can I store here?</AccordionTrigger>
								<AccordionContent>
									Anything digital! Docs, pics, videos, your secret recipe collection... If
									it&apos;s a file, we can store it. No judgment here!
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-5">
								<AccordionTrigger>Can I organize my files in folders?</AccordionTrigger>
								<AccordionContent>
									Absolutely! You can create folders to organize your files just like you would on your computer.
									Create as many folders as you need, nest them, and keep everything tidy and easy to find.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Begin?</h2>
								<p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
									Join numerous users who are already benefiting from unlimited storage. Sign up now
									to optimize your data storage solution.
								</p>
							</div>
							<Button asChild>
								<Link href="/files" className="inline-flex items-center">
									Get Started <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
