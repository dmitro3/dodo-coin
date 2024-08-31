
import Handler from "@backend/modules/Handler";
import {sendInvite} from "@backend/api/player/send_invite/actions";

export default class UpgradeHandler extends Handler {
	async handler() {
		const user = await this.getUser();
		if (!user) throw(401);
		// await sendInvite(user);
		return {}
	}
}
