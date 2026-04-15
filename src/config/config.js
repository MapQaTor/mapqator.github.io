const config = {
	baseUrl: process.env.NEXT_APP_BASE_URL
		? process.env.NEXT_APP_BASE_URL
		: process.env.NODE_ENV === "development"
		? ""
		: "https://mapqator.github.io",
	drawerWidth: 230,
	topbarHeight: 64,
	loginRedirect: "/home",
	logoutRedirect: "/login",
};

export default config;
