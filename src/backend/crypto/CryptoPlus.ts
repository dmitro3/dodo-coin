'use server';

const shopId = "PPJjJrocLrv3h7LM";

export async function createPosPayment(amount: number) {
	return await fetch("https://api.cryptocloud.plus/v2/invoice/pos/create?locale=en", {
		headers: {
			"content-type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			"amount": amount,
			"shop_id": shopId,
			"currency": "USD"
		})
	})
}
