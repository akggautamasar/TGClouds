import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const dynamic = 'force-static';
export const dynamicParams = false;

export default function SupportPage() {
	return (
		<main className="flex-1">
			<section className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
								Support
							</h1>
							<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
								We&apos;re here to help. If you have any questions or issues, please don&apos;t
								hesitate to contact us.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<div className="mx-auto max-w-[600px]">
						<form className="space-y-4">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700">
									Name
								</label>
								<Input id="name" placeholder="Your name" required />
							</div>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">
									Email
								</label>
								<Input id="email" placeholder="Your email" type="email" required />
							</div>
							<div>
								<label htmlFor="message" className="block text-sm font-medium text-gray-700">
									Message
								</label>
								<Textarea id="message" placeholder="Your message" required />
							</div>
							<Button type="submit" className="w-full">
								Send Message
							</Button>
						</form>
					</div>
				</div>
			</section>
		</main>
	);
}
