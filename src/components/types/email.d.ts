export type CheckEmailTypes = {
	matches: number;
	accounts: [
		{
			[email: string]: string[];
		}
	];
};
