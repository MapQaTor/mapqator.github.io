import Footer from "../footer";

export const metadata = {
	title: "Login",
	description: "Login page of MapQaTor",
};
export default function RootLayout({ children }) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
