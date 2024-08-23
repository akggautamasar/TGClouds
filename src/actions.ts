'use server';

import { currentUser } from '@clerk/nextjs/server';
import { and, asc, count, desc, eq, ilike } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db } from './db';
import { paymentsTable, userFiles, usersTable, sharedFilesTable } from './db/schema';
import { revalidatePath } from 'next/cache';
import { ChapaInitializePaymentRequestBody, User } from './lib/types';
import crypto from 'node:crypto';
import { PLANS } from '@/components/farmui/TGCloudPricing';

import { Resend } from 'resend';
import Email from '@/components/email';
import React from 'react';
import { env } from './env';

export async function saveTelegramCredentials({
	accessHash,
	channelId,
	channelTitle,
	session
}: {
	session: string;
	accessHash: string;
	channelId: string;
	channelTitle: string;
}) {
	if (!session) {
		throw new Error('Session is required ');
	}

	const user = await currentUser();
	if (!user) {
		throw new Error('user needs to be logged in.');
	}

	const email = user.emailAddresses?.[0]?.emailAddress;
	if (!email) {
		throw new Error('user email is not available.');
	}

	try {
		const existinguser = await getUser();

		if (!existinguser) {
			const name = user.fullName ?? `${user.firstName} ${user.lastName}`;
			const subscriptionDate = addDays(new Date(), 7).toISOString();
			const data = await db
				.insert(usersTable)
				.values({
					email,
					name,
					id: user.id,
					imageUrl: user.imageUrl,
					telegramSession: session,
					accessHash: accessHash,
					channelId: channelId,
					channelTitle: channelTitle,
					isSubscribedToPro: true,
					subscriptionDate
				})
				.returning();
			return user.id;
		}

		const result = await db
			.update(usersTable)
			.set({
				telegramSession: session,
				accessHash: accessHash,
				channelId: channelId,
				channelTitle: channelTitle
			})
			.where(eq(usersTable.email, email))
			.returning();
		return session;
	} catch (error) {
		console.error('Error while saving Telegram credentials:', error);
		throw new Error('There was an error while saving Telegram credentials.');
	}
}

export const saveUserName = async (username: string) => {
	const user = await currentUser();
	if (!user) {
		throw new Error('user needs to be logged in.');
	}

	const email = user.emailAddresses?.[0]?.emailAddress;
	if (!email) {
		throw new Error('user email is not available.');
	}

	try {
		const existinguser = await getUser();

		if (!existinguser) {
			const name = user?.fullName ?? `${user.firstName} ${user.lastName}`;
			const data = await db
				.insert(usersTable)
				.values({
					email,
					name,
					id: user.id,
					channelUsername: username
				})
				.returning();
			return data;
		}

		const result = await db
			.update(usersTable)
			.set({
				channelUsername: username
			})
			.where(eq(usersTable.email, email))
			.returning();
		return result;
	} catch (error) {
		console.error('Error while saving Telegram credentials:', error);
		throw new Error('There was an error while saving Telegram credentials.');
	}
};

export async function getUser() {
	const user = await currentUser();
	if (!user) {
		throw new Error('user needs to be logged in.');
	}

	const email = user.emailAddresses?.[0]?.emailAddress;
	if (!email) {
		throw new Error('user email is not available.');
	}

	try {
		const result = await db.query.usersTable.findFirst({
			where(fields, { eq }) {
				return eq(fields.email, email);
			}
		});

		return result;
	} catch (err) {
		console.log(err);
		if (err instanceof Error) throw new Error(err.message);
		throw new Error('There was an error while getting user');
	}
}

export async function getAllFiles(searchItem?: string, offset?: number) {
	try {
		const user = await getUser();
		if (!user || !user.id) {
			throw new Error('User not authenticated or user ID is missing');
		}

		if (searchItem) {
			const results = await db
				.select()
				.from(userFiles)
				.where(and(ilike(userFiles.fileName, `%${searchItem}%`), eq(userFiles.userId, user.id)))
				.orderBy(asc(userFiles.id))
				.limit(8)
				.offset(offset ?? 0)
				.execute();

			const total = (
				await db
					.select({ count: count() })
					.from(userFiles)
					.where(and(ilike(userFiles.fileName, `%${searchItem}%`), eq(userFiles.userId, user.id)))
					.execute()
			)[0].count;

			return [results, total];
		}

		const results = await db
			.select()
			.from(userFiles)
			.where(eq(userFiles.userId, user.id))
			.orderBy(asc(userFiles.id))
			.limit(8)
			.offset(offset ?? 0)
			.execute();

		const total = (
			await db
				.select({ count: count() })
				.from(userFiles)
				.where(eq(userFiles.userId, user.id))
				.execute()
		)[0].count;

		return [results, total];
	} catch (err) {
		if (err instanceof Error) {
			console.error('Error fetching files:', err.message);
			throw new Error('Failed to fetch files. Please try again later.');
		}
	}
}

export async function getFilesFromSpecificType({
	fileType,
	searchItem,
	offset
}: {
	searchItem?: string;
	fileType: string;
	offset?: number;
}) {
	try {
		const user = await getUser();
		if (!user || !user.id) {
			throw new Error('User not authenticated or user ID is missing');
		}

		if (searchItem) {
			const results = await db
				.select()
				.from(userFiles)
				.where(
					and(
						ilike(userFiles.fileName, `%${searchItem}%`),
						eq(userFiles.category, fileType),
						eq(userFiles.userId, user.id)
					)
				)
				.orderBy(asc(userFiles.id))
				.limit(8)
				.offset(offset ?? 0)
				.execute();

			const total = (
				await db
					.select({ count: count() })
					.from(userFiles)
					.where(
						and(
							ilike(userFiles.fileName, `%${searchItem}%`),
							eq(userFiles.category, fileType),
							eq(userFiles.userId, user.id)
						)
					)
					.execute()
			)[0].count;

			return [results, total];
		}

		const results = await db
			.select()
			.from(userFiles)
			.where(and(eq(userFiles.category, fileType), eq(userFiles.userId, user.id)))
			.orderBy(asc(userFiles.id))
			.limit(8)
			.offset(offset ?? 0)
			.execute();

		const total = (
			await db
				.select({ count: count() })
				.from(userFiles)
				.where(and(eq(userFiles.category, fileType), eq(userFiles.userId, user.id)))
				.execute()
		)[0].count;

		return [results, total];
	} catch (err) {
		if (err instanceof Error) {
			console.error('Error fetching files:', err.message);
			throw new Error('Failed to fetch files. Please try again later.');
		}
	}
}

export async function uploadFile(file: {
	fileName: string;
	mimeType: string;
	size: bigint;
	url: string;
	fileTelegramId: number;
}) {
	try {
		const user = await getUser();
		if (!user || !user.id) {
			throw new Error('User not authenticated or user ID is missing');
		}

		const result = await db
			.insert(userFiles)
			.values({
				id: await generateId(),
				userId: user.id,
				fileName: file.fileName,
				mimeType: file.mimeType,
				size: file.size,
				url: file.url,
				date: new Date().toDateString(),
				fileTelegramId: String(file.fileTelegramId),
				category: file?.mimeType?.split('/')[0]
			})
			.returning();
		revalidatePath('/files');
		return result;
	} catch (err) {
		if (err instanceof Error) {
			console.error('Error uploading file:', err?.message);
			throw new Error('Failed to upload file. Please try again later.');
		}
	} finally {
	}
}

export async function deleteFile(fileId: number) {
	try {
		const user = await getUser();
		if (!user) throw new Error('you need to be logged to delete files');
		const deletedFile = await db
			.delete(userFiles)
			.where(and(eq(userFiles.userId, user.id), eq(userFiles.id, Number(fileId))))
			.returning();
		return deletedFile;
	} catch (err) {
		if (err instanceof Error) {
			throw new Error(err.message);
		}
	}
}

async function generateId() {
	const result = await db.select().from(userFiles).orderBy(desc(userFiles.id)).limit(1);

	const latestRecord = result[0];
	const newId = latestRecord ? latestRecord.id + 1 : 1;
	return newId;
}

export const useUserProtected = async () => {
	const userClerk = await currentUser();
	if (!userClerk) return redirect('/login');
	const user = await getUser();

	const hasNotDecidedToHavePrivateChannle =
		user?.hasPublicTgChannel === null || user?.hasPublicTgChannel === undefined;

	const hasNotHaveNeccessaryDetails = !user?.accessHash || !user?.channelId;

	if (hasNotDecidedToHavePrivateChannle || hasNotHaveNeccessaryDetails)
		return redirect('/connect-telegram');

	if (!user.channelUsername && (!user.channelId || !user.accessHash))
		throw new Error('There was something wrong');
	

	return user as User;
};

export const updateHasPublicChannelStatus = async (isPublic: boolean) => {
	try {
		const user = await getUser();
		if (!user)
			throw new Error('Seems lke you are not authenticated', {
				cause: 'AUTH_ERR'
			});
		await db
			.update(usersTable)
			.set({ hasPublicTgChannel: isPublic })
			.where(eq(usersTable.id, user.id))
			.returning();
		return user.id;
	} catch (err) {
		if (err instanceof Error) throw new Error(err.message);
	}
	throw new Error('There was an error while updating status');
};

function addDays(date: Date, days: number): Date {
	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() + days);
	return newDate;
}

type PeymentResult = Awaited<ReturnType<typeof db.query.paymentsTable.findFirst>>;

type UserPaymentSubscriptionResult =
	| {
			isDone: true;
			data: PeymentResult;
			status: 'success';
	  }
	| {
			isDone: false;
			status: 'failed';
			message: string;
			data?: PeymentResult;
	  };

export async function subscribeToPro({
	tx_ref
}: {
	tx_ref: string;
}): Promise<UserPaymentSubscriptionResult> {
	try {
		const otherSubscriptionWithThisTxRef = await db.query.paymentsTable.findFirst({
			where(fields, { eq, and }) {
				return eq(fields.tx_ref, tx_ref);
			}
		});

		if (otherSubscriptionWithThisTxRef?.isPaymentDONE)
			return {
				isDone: false,
				data: otherSubscriptionWithThisTxRef,
				status: 'failed',
				message: 'payment already made before'
			};

		const data = await verifyPayment({ tx_ref });

		if (data.status !== 'success') throw new Error(data.message);

		const user = await getUser();
		if (!user) throw new Error('Failed to get user');

		let currentExpirationDate = user.subscriptionDate
			? new Date(user.subscriptionDate)
			: new Date();
		if (currentExpirationDate < new Date()) {
			currentExpirationDate = new Date();
		}

		const plan = otherSubscriptionWithThisTxRef?.plan;

		if (!plan)
			throw new Error('FAILED GOT GET UR PAYMENT INFORAMITON PELEASE PLACT SUPPORT CENTER');

		const newExpirationDate = addDays(
			currentExpirationDate,
			plan == 'ANNUAL' ? 365 : 30
		).toISOString();

		const result = await db
			.update(usersTable)
			.set({
				isSubscribedToPro: true,
				subscriptionDate: newExpirationDate,
				plan: plan
			})
			.where(eq(usersTable.id, user.id))
			.returning();

		await db
			.update(paymentsTable)
			.set({
				isPaymentDONE: true
			})
			.where(eq(paymentsTable.tx_ref, tx_ref))
			.returning()
			.execute();

		sendEmail(user, newExpirationDate);

		return {
			isDone: true,
			data: otherSubscriptionWithThisTxRef,
			status: 'success'
		};
	} catch (err) {
		return {
			isDone: false,
			message: 'there was an error while proccessin payment',
			status: 'failed'
		};
	}
}

async function sendEmail(user: User, expirationDate: string) {
	const resend = new Resend(env.RESEND_API_KEY);

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: user?.email!,
		subject: 'Pro Activated',
		react: React.createElement(Email, {
			expirationDate,
			userName: user?.name!
		})
	});
}

export async function initailizePayment({
	amount,
	currency,
	plan
}: {
	amount: string;
	currency: string;
	plan: PLANS;
}) {
	try {
		const user = await getUser();
		if (!user) throw new Error('user needs to be loggedin');

		const tx_ref = crypto.randomUUID();

		const body: ChapaInitializePaymentRequestBody = {
			amount,
			currency,
			email: user.email,
			first_name: user.name,
			tx_ref,
			return_url: `https://5000-kumnegerwon-tgcloudpriv-o2z4rclwa8e.ws-eu115.gitpod.io/subscribe/success/${tx_ref}`
		};

		await db
			.insert(paymentsTable)
			.values({
				id: crypto.randomUUID(),
				amount: amount,
				currency: currency,
				userId: user.id,
				tx_ref,
				isPaymentDONE: false,
				plan: plan
			})
			.returning()
			.execute();

		const resonse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
			method: 'post',
			headers: {
				Authorization: `Bearer ${env.CHAPA_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		const data = (await resonse.json()) as {
			message: string;
			status: string;
			data: {
				checkout_url: string;
			};
		};
		console.log(data);

		return data;
	} catch (err) {
		throw err;
	}
}

async function verifyPayment({ tx_ref }: { tx_ref: string }) {
	const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
		method: 'get',
		headers: {
			Authorization: `Bearer ${env.CHAPA_API_KEY}`
		}
	});
	const result = (await response.json()) as {
		message: string;
		status: string;
		data: ChapaInitializePaymentRequestBody;
	};
	return result;
}

export async function shareFile({ fileID }: { fileID: string }) {
	try {
		const user = await getUser();
		if (!user) throw new Error('you need to be sined in to share ur files');
		const newShare = await db
			.insert(sharedFilesTable)
			.values({
				id: crypto.randomUUID(),
				userId: user.id,
				fileId: fileID
			})
			.returning()
			.execute();
		return newShare;
	} catch (err) {
		console.error(err);
	}
}

export async function getSharedFiles(id: string) {
	try {
		const result = await db
			.select()
			.from(sharedFilesTable)
			.leftJoin(
				usersTable,
				and(eq(usersTable.id, sharedFilesTable.userId), eq(sharedFilesTable.id, id))
			)
			.where(and(eq(usersTable.id, sharedFilesTable.userId), eq(sharedFilesTable.id, id)));

		console.log(result);

		return result;
	} catch (err) {
		console.error(err);
	}
}
