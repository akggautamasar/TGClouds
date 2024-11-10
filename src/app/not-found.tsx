import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/footer';

export default function NotFound() {
	return (
		<>
			<Header />
			<main className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)]">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
								404 - Page Not Found
							</h1>
							<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
								Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved
								or deleted.
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link href="/">Return to Home</Link>
							</Button>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
