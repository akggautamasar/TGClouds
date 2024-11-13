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
		<div className="flex items-center justify-center min-h-screen ">
			<Card className="w-full max-w-md ">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
					<CardDescription className="text-center">
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
						className="w-full"
					>
						<Mail className="mr-2 h-4 w-4" />
						Login with Google
					</Button>
					<Button variant="outline" className="w-full">
						<Github className="mr-2 h-4 w-4" />
						Login with GitHub
					</Button>
				</CardContent>
				<CardFooter className="flex flex-col items-center">
					<p className="mt-2 text-xs text-center text-muted-foreground">
						By logging in, you agree to our
						<Link href="/terms" className="underline ml-1 text-foreground hover:text-primary">
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link href="/privacy" className="underline text-foreground hover:text-primary">
							Privacy Policy
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
