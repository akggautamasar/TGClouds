import React from 'react';
import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Section,
	Text,
	Heading
} from '@react-email/components';

const ProPlanActivatedEmail = ({
	userName,
	expirationDate
}: {
	userName: string;
	expirationDate: string;
}) => {
	const formattedDate = new Date(expirationDate).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return (
		<Html>
			<Head />
			<Preview>Your Pro Plan is Now Active!</Preview>
			<Body className="bg-gray-100 font-sans">
				<Container className="mx-auto p-4 bg-white rounded-md shadow-md">
					<Section className="text-center">
						<Heading className="text-2xl font-bold text-blue-600">Pro Plan Activated!</Heading>
						<Text className="text-lg text-gray-700 mt-4">Hello {userName},</Text>
						<Text className="text-lg text-gray-700 mt-2">
							We&apos;re excited to inform you that your Pro plan is now active. Enjoy all the
							exclusive features and unlimited access to our support team.
						</Text>
						<Text className="text-lg text-gray-700 mt-2">
							Your Pro plan is active until{' '}
							<span className="font-bold text-blue-600">{formattedDate}</span>.
						</Text>
						<Text className="text-lg text-gray-700 mt-4">Thank you for choosing our service!</Text>
						<Text className="text-lg text-gray-700 mt-4">
							Best regards,
							<br />
							The Team
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default ProPlanActivatedEmail;
