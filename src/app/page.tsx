import { HomePage } from '@/components/home-page';
import { unstable_after as after } from 'next/server';


export default async function Home() {
	return (
		<main>
			<HomePage />
		</main>
	);
}
