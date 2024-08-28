import './globals.css'

const Layout = (props: any) => {
	return (
		<html>
		<body>
		{props.children}
		</body>
		</html>
	)
};

export default Layout;
