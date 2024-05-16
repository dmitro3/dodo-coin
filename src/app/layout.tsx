import {HotReloadTelegramBot} from "@/bot/main";
import * as fs from "node:fs";
import {ReactNode} from "react";

export default function RootLayout(props: {
     children: ReactNode[]
}) {
	const files = fs.readdirSync(process.cwd() + "/public/assets").filter(f =>
          f.endsWith(".js") || f.endsWith(".css")
     ).map(f => `/assets/${f}`);

	return (
		<html>
		<body>
		{props.children}
		</body>
		</html>
	);
}


HotReloadTelegramBot()
