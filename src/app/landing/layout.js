import Footer from "../footer";

export const metadata = {
	title: "Landing",
	description: "Landing page of MapQaTor",
};
export default function RootLayout({ children }) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
