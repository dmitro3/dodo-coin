import {getHTMLContent} from "@/app/(version2)/@html/tools";


const Page = () => {
	const content = getHTMLContent('home');
	return (
		<div dangerouslySetInnerHTML={{__html: content}}>

		</div>
	);
};

export default Page;
