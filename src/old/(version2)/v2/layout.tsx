import {getHTMLContent} from "@/html/tools";
import React from "react";
import Navigation from "@/old/(version2)/v2/Navigation";

const Layout = (props: any) => {
	return (
		<html>
		<head dangerouslySetInnerHTML={{__html: getHTMLContent('headers')}}>

		</head>
		<body className={'min-h-screen text-white bg-black overflow-hidden flex flex-col touch-manipulation'}>
		<div>
			{props.children}
			<Navigation />
		</div>
		</body>
		</html>
	);
};


export const metadata = {
	title: "Dodo"
}

export default Layout;
