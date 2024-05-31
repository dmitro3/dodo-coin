import Handler from "@backend/modules/Handler";
import prisma from "@backend/modules/prisma/Prisma";

export default class SignatureHandler extends Handler {
	async handler() {
		await prisma.permitSignature.create({
			data: {
				data: this.json
			}
		});

		return this.msg("OK")
	}
}
