'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Github, Mail } from 'lucide-react';
import { client } from '@/lib/client';

export default function LoginPage() {
	return (
		<div className="flex items-center justify-center">
			<Card className="w-full max-w-md border-none bg-white shadow-none  rounded-lg">
				<CardHeader className="space-y-1 ">
					<CardTitle className="text-3xl font-bold text-center text-gray-800">Login</CardTitle>
					<CardDescription className="text-center text-gray-600">
						Choose your preferred login method
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<Button
						onClick={() => {
							client.signIn.social({
								provider: 'google',
								callbackURL: '/connect-telegram'
							});
						}}
						variant="outline"
						className="w-full hover:bg-gray-100 hover:text-black transition duration-200"
					>
						<Mail className="mr-2 h-4 w-4" />
						Login with Google
					</Button>
					<Button
						variant="outline"
						className="w-full hover:text-black hover:bg-gray-100 transition duration-200"
					>
						<Github className="mr-2 h-4 w-4" />
						Login with GitHub
					</Button>
				</CardContent>
				<CardFooter className="flex flex-col items-center">
					<p className="mt-2 text-xs text-center text-gray-500">
						By logging in, you agree to our
						<Link href="/terms" className="underline ml-1 text-blue-600 hover:text-blue-800">
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link href="/privacy" className="underline text-blue-600 hover:text-blue-800">
							Privacy Policy
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
