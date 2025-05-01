import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Cloud, FolderTree, Lock, Play, Zap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function HomePage() {
	return (
		<div className="flex flex-col min-h-[100dvh]">
			<main className="flex-1">
				{/* <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Unlimited, Private Storage Powered by *Your* Telegram
								</h1>
								<p className="text-2xl font-semibold text-primary mt-4 mb-6">
									Say goodbye to storage limits! Store everything securely in your own Telegram channel, with **you** in complete control.
								</p>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
									Our platform empowers you to use the limitless storage of Telegram within your **private** channel. Simply add our bot as an admin – we handle the rest, **without ever accessing your files**. Your data, your ownership!
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
				</section> */}
				<section className="w-full lg:-mt-20 py-12 md:py-24 lg:py-32 xl:py-48">
					<div className="container px-4 md:px-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
							<div className="flex flex-col space-y-4 text-center md:text-left">
								<div className="space-y-2">
									<h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none">
										Unlimited, Private Storage Powered by *Your* Telegram
									</h1>
									<p className="text-lg font-semibold text-primary mt-4 mb-6">
										Say goodbye to storage limits! Store everything securely in your own Telegram
										channel, with **you** in complete control.
									</p>
									<p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
										Our platform empowers you to use the limitless storage of Telegram within your
										**private** channel. Simply add our bot as an admin – we handle the rest,
										**without ever accessing your files**. Your data, your ownership!
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
							<div className="flex justify-center items-center">
								<div className="w-full h-full min-h-[300px] rounded-md flex items-center justify-center">
									<Image
										width={500}
										style={{}}
										height={400}
										src={'/fileUpload.svg'}
										alt="file upload animation"
										priority
									/>
								</div>
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
							Key Features
						</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle>Truly Unlimited</CardTitle>
								</CardHeader>
								<CardContent>
									<Cloud className="w-12 h-12 mb-4" />
									<p>Leverage Telegram&apos;s boundless storage for all your digital needs.</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Your Private Space</CardTitle>
								</CardHeader>
								<CardContent>
									<Lock className="w-12 h-12 mb-4" />
									<p>
										Files are stored in **your own private** Telegram channel, ensuring utmost
										privacy.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Zero Access to Your Files</CardTitle>
								</CardHeader>
								<CardContent>
									<ShieldCheck className="w-12 h-12 mb-4" />
									<p>
										We facilitate the process, but **we never access or store your actual files**.
										They remain solely within your Telegram channel.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Fast & Efficient</CardTitle>
								</CardHeader>
								<CardContent>
									<Zap className="w-12 h-12 mb-4" />
									<p>Enjoy swift uploads and downloads within the Telegram ecosystem.</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Organize with Folders</CardTitle>
								</CardHeader>
								<CardContent>
									<FolderTree className="w-12 h-12 mb-4" />
									<p>
										Keep your files structured and easy to find within your Telegram channel using
										folders.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Direct Media Playback</CardTitle>
								</CardHeader>
								<CardContent>
									<Play className="w-12 h-12 mb-4" />
									<p>Play videos and view images directly from within the platform.</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							How It Works
						</h2>
						<ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<li className="flex flex-col items-center text-center">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
									1
								</div>
								<h3 className="mt-4 font-semibold">Sign Up</h3>
								<p className="mt-2 text-sm">
									Get started by creating your account on our platform.
								</p>
							</li>
							<li className="flex flex-col items-center text-center">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
									2
								</div>
								<h3 className="mt-4 font-semibold">Create Private Channel</h3>
								<p className="mt-2 text-sm">
									Set up a new private channel on Telegram for your storage.
								</p>
							</li>
							<li className="flex flex-col items-center text-center">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
									3
								</div>
								<h3 className="mt-4 font-semibold">Add Our Bot as Admin</h3>
								<p className="mt-2 text-sm">
									Invite our bot to be an administrator of your private channel.
								</p>
							</li>
							<li className="flex flex-col items-center text-center">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
									4
								</div>
								<h3 className="mt-4 font-semibold">Upload Directly to Your Telegram</h3>
								<p className="mt-2 text-sm">
									Start uploading your files through our platform – they go straight to your private
									Telegram channel.
								</p>
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
									Yes, by leveraging Telegram&apos;s storage, we offer truly unlimited storage space
									within your private channel.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger>How secure is my data?</AccordionTrigger>
								<AccordionContent>
									Your data is stored in **your own private** Telegram channel, giving you complete
									control and utilizing Telegram&apos;s security features. **We do not have access
									to your files.**
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-3">
								<AccordionTrigger>Do you access my files?</AccordionTrigger>
								<AccordionContent>
									**No, we do not access your files.** Our platform facilitates the upload process
									to your private Telegram channel, but your content remains yours and within your
									control.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-4">
								<AccordionTrigger>Do I need a Telegram account?</AccordionTrigger>
								<AccordionContent>
									Yes, a Telegram account is required as our service utilizes Telegram channels for
									storage.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-5">
								<AccordionTrigger>What types of files can I store?</AccordionTrigger>
								<AccordionContent>
									You can store almost any type of digital file within the Telegram limits.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-6">
								<AccordionTrigger>Can I organize my files?</AccordionTrigger>
								<AccordionContent>
									Yes, you can create and manage folders within your private Telegram channel to
									keep your files organized.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Ready to Own Your Unlimited Storage?
								</h2>
								<p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
									Take control of your digital life with secure, unlimited storage, where **your
									files remain yours, always.** Sign up now and experience the difference!
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
