'use server';

export async function createPosPayment(amount: number) {
	return await fetch("https://api.cryptocloud.plus/v2/invoice/pos/create?locale=en", {
		headers: {
			"content-type": "application/json",
		},
		method: "POST",
		
	})
}
