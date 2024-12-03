// // import { initailizePayment } from '@/actions';
// import { Button } from '@/components/ui/button';
// import { useFormStatus } from 'react-dom';
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle
// } from '@/components/ui/card';
// import { errorToast } from '@/lib/notify';
// import { useRouter } from 'next/navigation';
// import * as React from 'react';
// import { SVGProps, useState } from 'react';
// import { toast } from 'react-hot-toast';

// export type PLANS = 'ANNUAL' | 'MONTHLY';

// const plans = {
// 	ANNUAL: {
// 		total: '960',
// 		perMonth: 80
// 	},
// 	MONTHLY: {
// 		total: '99'
// 	}
// };

// export default function Component() {
// 	const [selectedPlan, setSelectedPlan] = useState<PLANS>('ANNUAL');
// 	const router = useRouter();

// 	return (
// 		<>
// 			<div>Select plan</div>
// 			<ComboboxDemo setValue={setSelectedPlan} value={selectedPlan} />
// 			<Card className="w-full max-w-md bg-primary text-primary-foreground">
// 				<form
// 					action={async () => {
// 						try {
// 							const data = await initailizePayment({
// 								amount: plans[selectedPlan]?.total,
// 								currency: 'ETB',
// 								plan: selectedPlan
// 							});

// 							if (data?.status == 'success') {
// 								location.assign(data.data.checkout_url);
// 								return;
// 							}
// 						} catch (err) {
// 							console.error(err);

// 							if (err instanceof Error) {
// 								errorToast(err.message ?? 'failed to process ayment');
// 							}
// 						}
// 					}}
// 				>
// 					<CardHeader className="space-y-2">
// 						{selectedPlan == 'MONTHLY' ? (
// 							<>
// 								<CardTitle className="text-3xl font-bold">Pro</CardTitle>
// 								<div className="flex items-baseline gap-2">
// 									<span className="text-5xl font-bold">99ETB</span>
// 									<span className="text-lg font-medium text-muted-foreground">/mo</span>
// 								</div>
// 							</>
// 						) : (
// 							<>
// 								<CardTitle className="text-3xl font-bold">Annual</CardTitle>
// 								<div className="flex items-baseline gap-2">
// 									<span className="text-5xl font-bold">960 ETB</span>
// 									<span className="text-lg font-medium text-muted-foreground">total</span>
// 								</div>
// 								<CardDescription>Unlimited storage for you</CardDescription>
// 								<div className="flex items-baseline gap-2"></div>
// 								<div className="flex items-baseline gap-2">
// 									<span className="text-3xl font-bold">80 ETB</span>
// 									<span className="text-lg font-medium text-muted-foreground">/mo</span>
// 								</div>
// 							</>
// 						)}
// 						<CardDescription>Unlimited storage for you</CardDescription>
// 					</CardHeader>
// 					<CardContent>
// 						<div className="grid gap-4">
// 							<div className="flex items-center gap-2">
// 								<CheckIcon className="h-5 w-5 fill-primary-foreground" />
// 								<span>Unlimited storage</span>
// 							</div>
// 							<div className="flex items-center gap-2">
// 								<CheckIcon className="h-5 w-5 fill-primary-foreground" />
// 								<span>Advanced collaboration tools</span>
// 							</div>
// 							<div className="flex items-center gap-2">
// 								<CheckIcon className="h-5 w-5 fill-primary-foreground" />
// 								<span>Dedicated support</span>
// 							</div>
// 						</div>
// 					</CardContent>
// 					<CardFooter>
// 						<SubscribeButton />
// 					</CardFooter>
// 				</form>
// 			</Card>
// 		</>
// 	);
// }

// const SubscribeButton = () => {
// 	const { pending } = useFormStatus();
// 	return (
// 		<div>
// 			<Button
// 				disabled={pending}
// 				variant="secondary"
// 				className={`w-full ${pending ? 'cursor-not-allowed' : ''}`}
// 			>
// 				{pending ? 'please wait' : 'Get Pro'}
// 			</Button>
// 		</div>
// 	);
// };

// function CheckIcon(props: SVGProps<SVGSVGElement>) {
// 	return (
// 		<svg
// 			{...props}
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="24"
// 			height="24"
// 			viewBox="0 0 24 24"
// 			fill="none"
// 			stroke="currentColor"
// 			strokeWidth="2"
// 			strokeLinecap="round"
// 			strokeLinejoin="round"
// 		>
// 			<path d="M20 6 9 17l-5-5" />
// 		</svg>
// 	);
// }

// const plansCombox = [
// 	{
// 		value: 'ANNUAL',
// 		label: 'Annual'
// 	},
// 	{
// 		value: 'MONTHLY',
// 		label: 'Monthly'
// 	}
// ];

// export function ComboboxDemo({
// 	setValue,
// 	value
// }: {
// 	value: PLANS;
// 	setValue: React.Dispatch<React.SetStateAction<PLANS>>;
// }) {
// 	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// 		setValue(event.target.value as PLANS);
// 	};

// 	return (
// 		<div className="relative">
// 			<select
// 				value={value}
// 				onChange={handleChange}
// 				className="border p-2 rounded w-[200px] appearance-none"
// 				aria-label="Select plan"
// 			>
// 				{plansCombox.map((plan) => (
// 					<option key={plan.value} value={plan.value}>
// 						{plan?.label}
// 					</option>
// 				))}
// 			</select>
// 		</div>
// 	);
// }
