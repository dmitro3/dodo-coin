'use server';

const shopId = "PPJjJrocLrv3h7LM";

export type POSCreationResponse = {
	status: string
	result: {
		uuid: string
		created: string
		address: string
		expiry_date: string
		side_commission: string
		side_commission_service: string
		type_payments: string
		amount: number
		amount_usd: number
		amount_in_fiat: number
		fee: number
		fee_usd: number
		service_fee: number
		service_fee_usd: number
		fiat_currency: string
		status: string
		is_email_required: boolean
		link: string
		invoice_id: any
		currency: {
			id: number
			code: string
			fullcode: string
			network: {
				code: string
				id: number
				icon: string
				fullname: string
			}
			name: string
			is_email_required: boolean
			stablecoin: boolean
			icon_base: string
			icon_network: string
			icon_qr: string
			order: number
		}
		project: {
			id: number
			name: string
			fail: string
			success: string
			logo: string
		}
		test_mode: boolean
	}
}


export async function createPosPayment(amount: number) {
	const R = await fetch("https://api.cryptocloud.plus/v2/invoice/pos/create?locale=en", {
		headers: {
			"content-type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			"amount": amount,
			"shop_id": shopId,
			"currency": "USD"
		})
	}).then(r=>r.json()).catch(console.error) as POSCreationResponse | undefined

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
	}).then(r=>r.json()).catch(console.error) as POSCreationResponse | undefined
}
