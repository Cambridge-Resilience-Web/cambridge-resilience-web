import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import nodemailer from 'nodemailer';
import prisma from '../../../prisma/client.js';

async function fetchPermissions(email) {
	const emailEncoded = encodeURIComponent(email);
	const response = await fetch(
		`http://localhost:3000/api/permissions?email=${emailEncoded}`,
	);
	const data = await response.json();
	const { editPermissions } = data;
	return editPermissions;
}

export default NextAuth({
	providers: [
		Providers.Email({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: process.env.EMAIL_SERVER_PORT,
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
			async sendVerificationRequest({
				identifier: email,
				url,
				token,
				baseUrl,
				provider,
			}) {
				const permissions = await fetchPermissions(email);
				const permission = permissions.reduce((accumulator, current) =>
					Date.parse(accumulator.createdAt) >=
					Date.parse(current.createdAt)
						? accumulator
						: current,
				);
				console.log({ lastPermission: permission });

				return new Promise((resolve, reject) => {
					const { server, from } = provider;
					// Strip protocol from URL and use domain as site name
					const site = baseUrl.replace(/^https?:\/\//, '');

					return resolve();

					// nodemailer.createTransport(server).sendMail(
					// 	{
					// 		to: email,
					// 		from,
					// 		subject: `Your invite to Cambridge Resilience Web`,
					// 		text: text({ url, site, email }),
					// 		html: html({ url, site, email }),
					// 	},
					// 	(error) => {
					// 		if (error) {
					// 			// eslint-disable-next-line no-console
					// 			console.error(
					// 				'SEND_VERIFICATION_EMAIL_ERROR',
					// 				email,
					// 				error,
					// 			);
					// 			return reject(
					// 				new Error('SEND_VERIFICATION_EMAIL_ERROR', error),
					// 			);
					// 		}
					// 		return resolve();
					// 	},
					// );
				});
			},
		}),
	],
	adapter: Adapters.Prisma.Adapter({ prisma }),
	database: process.env.DATABASE_URL,
	callbacks: {
		async session(session, token) {
			session.user.id = token.id;
			session.user.admin = token.admin;
			return session;
		},
	},
	theme: 'light',
	pages: {
		signIn: '/auth/signin',
		verifyRequest: '/auth/verify-request',
	},
});

const html = ({ url, site, email }) => {
	// Insert invisible space into domains and email address to prevent both the
	// email address and the domain from being turned into a hyperlink by email
	// clients like Outlook and Apple mail, as this is confusing because it seems
	// like they are supposed to click on their email address to sign in.
	const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;
	// const escapedSite = `${'Cambridge Re'.replace(/\./g, '&#8203;.')}`;

	const backgroundColor = '#f9f9f9';
	const textColor = '#444444';
	const mainBackgroundColor = '#ffffff';
	const buttonBackgroundColor = '#57b894';
	const buttonBorderColor = '#57b894';
	const buttonTextColor = '#ffffff';

	// Uses tables for layout and inline CSS due to email client limitations
	return `
  <body style="background: ${backgroundColor};">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tr>
		<td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  <strong>Cambridge Resilience Web</strong>
		</td>
	  </tr>
	</table>
	<table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
	<tr>
		You have been invited to manage {insert group here} on Cambridge Resilience Web, a digital mapping of organisations in Cambridge that are working to create a more resilient, more equitable and greener future for Cambridge and its residents.
	</tr>
	  <tr>
		<td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  To accept your invite, click the button below to sign in as <strong>${escapedEmail}</strong>
		</td>
	  </tr>
	  <tr>
		<td align="center" style="padding: 20px 0;">
		  <table border="0" cellspacing="0" cellpadding="0">
			<tr>
			  <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
			</tr>
		  </table>
		</td>
	  </tr>
	  <tr>
		<td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  If you're not sure why you received this invite or have any questions, please reply to this email.
		</td>
	  </tr>
	</table>
  </body>
  `;
};

// Email text body – fallback for email clients that don't render HTML
const text = ({ url, site }) => `Sign in to ${site}\n${url}\n\n`;
