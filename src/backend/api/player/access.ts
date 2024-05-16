import {NextRequest} from "next/server";
import {getUserFromHeaders} from "@/utils/serverComponents/user";

export default function access(req: NextRequest) {
	const user = getUserFromHeaders();
	if (!user) throw(401);
}
