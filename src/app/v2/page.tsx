const Page = () => {
	const content = getHTMLContent('home');
	return (
		<div dangerouslySetInnerHTML={{__html: content}}>

		</div>
	);
};

export default Page;
