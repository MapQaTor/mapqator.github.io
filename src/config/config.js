const config = {
	baseUrl: process.env.NEXT_APP_BASE_URL
		? process.env.NEXT_APP_BASE_URL
		: process.env.NODE_ENV === "development"
		? ""
		: "https://mahirlabibdihan.github.io/mapquest",
	drawerWidth: 270,
	topbarHeight: 64,
	loginRedirect: "/",
	logoutRedirect: "/login",
};

export default config;
