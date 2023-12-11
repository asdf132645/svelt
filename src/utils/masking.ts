export const maskingEmail = (email: string) => {
	const mask = '*'.repeat(Math.max(email.split('@')[0].length - 1, 0));

	return (email[0] || '') + mask + email.slice(mask.length + 1, email.length);
};
