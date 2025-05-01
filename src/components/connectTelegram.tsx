'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { db } from '@/db';
import { getGlobalTGCloudContext } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { saveTelegramCredentials } from '@/actions';
import { useState } from 'react';
import { EntityLike } from 'telegram/define';
import { useFormStatus } from 'react-dom';
import { getTgClient } from '@/lib/getTgClient';
import toast from 'react-hot-toast';

interface Props {
	user: NonNullable<Awaited<ReturnType<typeof db.query.usersTable.findFirst>>>;
}

export default function Component({ user }: Props) {
	const tgCloudContext = getGlobalTGCloudContext();
	const router = useRouter();
	const [selectedBot, setSelectedBot] = useState<'default' | 'custom'>('default');

	return (
		<div className="min-h-screen flex items-center">
			<Card className="w-full max-w-6xl mx-auto">
				<CardHeader>
					<CardTitle>Connect Your Telegram Channel</CardTitle>
					<CardDescription>
						Follow these steps to connect your Telegram channel with TG Cloud
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col lg:flex-row gap-6">
						<div className="flex-1 space-y-4">
							<div className="space-y-2">
								<h3 className="font-semibold">Step 1: Create and Set Up Your Channel</h3>
								<p className="text-sm text-gray-600">
									Create a private Telegram channel if you haven&apos;t already.
								</p>
							</div>
							<div className="space-y-2">
								<h3 className="font-semibold">Step 2: Choose Bot</h3>
								<RadioGroup
									defaultValue="default"
									onValueChange={(value) => setSelectedBot(value as 'default' | 'custom')}
									className="space-y-2"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="default" id="default" />
										<Label htmlFor="default">
											<a
												href="https://t.me/tgcloudet2024_bot?start=setup_tgcloud"
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-500 underline"
											>
												Use TGCloud Bot
											</a>
											<span className="block text-sm text-gray-600">
												Our default bot with standard features
											</span>
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="custom" id="custom" />
										<Label htmlFor="custom">
											Use Custom Bot
											<span className="block text-sm text-gray-600">Recommended</span>
										</Label>
									</div>
									<div>
										<div></div>
									</div>
								</RadioGroup>

								<div className="mt-4 space-y-2">
									<p className="text-sm text-gray-600">
										To use {selectedBot === 'custom' ? 'your own bot' : 'TGCloud Bot'}:
										<ol className="list-decimal ml-5 mt-2">
											{selectedBot === 'custom' && (
												<li>
													Create a new bot with{' '}
													<a
														href="https://t.me/BotFather"
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 hover:underline"
													>
														@BotFather
													</a>
												</li>
											)}
											<li>
												{selectedBot === 'custom'
													? 'Copy the bot token provided'
													: 'Add the bot as admin'}
											</li>
											<li>Add the bot to your channel as admin with posting permissions</li>
											<li>{selectedBot === 'custom' ? 'Paste the bot token below' : 'Done!'}</li>
										</ol>
									</p>
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="font-semibold">Step 3: Get Channel ID</h3>
								<p className="text-sm text-gray-600">
									1. Forward any message from your channel to{' '}
									<a
										href="https://t.me/RawDataBot"
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline"
									>
										@RawDataBot
									</a>
									<br />
									2. Look for the &quot;id&quot; field in the response (format: -100xxxxxxxxxx)
									<br />
									3. Copy and paste this ID below
								</p>
								<details className="mt-2">
									<summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
										View example response from RawDataBot
									</summary>
									<div className="mt-2">
										<pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-xs overflow-x-auto whitespace-pre text-gray-800 dark:text-gray-200">
											{`{
    "update_id": 846844456,
    "message": {
        "message_id": 3123678,
        "from": {
            "id": 5660513633,
            "is_bot": false,
            "first_name": "John Doe",
            "username": "johndoe123",
            "language_code": "en"
        },
        "chat": {
            "id": 5660513633,
            "first_name": "John Doe",
            "username": "johndoe123",
            "type": "private"
        },
        "date": 1732815925,
        "forward_origin": {
            "type": "channel",
            "chat": {
                "id": -1002254371734,  ⬅️ Copy this channel ID
                "title": "hfh",
                "type": "channel"
            },
            "message_id": 2,
            "date": 1732815917
        },
        "forward_from_chat": {
            "id": -1002254371734,
            "title": "hfh",
            "type": "channel"
        },
        "forward_from_message_id": 2,
        "forward_date": 1732815917,
        "text": "ddd"
    }
}`}
										</pre>
									</div>
								</details>
							</div>
						</div>

						<div className="flex-1 lg:border-l lg:pl-6">
							<div className="max-w-md space-y-6">
								<div>
									<h3 className="text-lg font-semibold mb-4">Enter Your Channel ID</h3>
									<form
										action={async (formData) => {
											const channelId = formData.get('channelId');
											const botToken = formData.get('botToken');

											if (!channelId) return;

											if (selectedBot === 'custom' && !botToken) {
												toast.error('Please enter your bot token');
												return;
											}
											try {
												const client =
													selectedBot === 'custom' && botToken
														? await getTgClient({
																botToken: botToken as string
															})
														: await getTgClient();

												const dialogs = await client?.getInputEntity(
													String(channelId) as EntityLike
												);
												const id = (dialogs as unknown as { channelId: string })?.channelId;
												const accessHash = (dialogs as unknown as { accessHash: string })
													?.accessHash;
												const sentMessage = await client?.sendMessage(channelId as EntityLike, {
													message:
														' Yay! You have successfully connected your Telegram channel with our platform! '
												});
												if (sentMessage?.id) {
													await saveTelegramCredentials({
														channelId: String(id) as string,
														accessHash: String(accessHash),
														session: 'this is test session',
														channelTitle: '',
														botToken: botToken as string
													});
													toast.success('Channel Connected Successfully');
													typeof window !== 'undefined' && window.location.replace('/files');
												}
											} catch (err) {
												toast.error('Failed to connect channel');
											}
										}}
										className="space-y-4"
									>
										<div className="space-y-2">
											<Label htmlFor="channelId">Channel ID</Label>
											<Input
												name="channelId"
												id="channelId"
												type="text"
												placeholder="-1001234567890"
												required
											/>
										</div>
										{selectedBot === 'custom' && (
											<div className="space-y-2">
												<label htmlFor="botToken" className="text-sm font-medium">
													Bot Token
													<span className="text-red-500">*</span>
												</label>
												<Input
													type="text"
													id="botToken"
													name="botToken"
													placeholder="Enter your bot token from @BotFather"
													className="w-full"
													required
												/>
											</div>
										)}
										<ConnectChannelButton />
									</form>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function ConnectChannelButton() {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending} type="submit" className="w-full">
			{pending ? 'please wait' : 'Connect Channel'}
		</Button>
	);
}
