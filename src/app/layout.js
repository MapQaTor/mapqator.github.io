import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ToastProvider from "../contexts/ToastProvider";
import AuthContextProvider from "@/contexts/AuthContext";
import AppContextProvider from "@/contexts/AppContext";
import GoogleMapWrapper from "@/contexts/GoogleMapScript";
const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
import { GitHub, LinkedIn, Mail } from "@mui/icons-material";
import Footer from "./footer";
import GlobalContextProvider from "@/contexts/GlobalContext";
export const metadata = {
	metadataBase: new URL("https://mapqator.github.io/"),
	title: {
		template: "%s | MapQaTor",
		default: "MapQaTor",
	},
	verification: {
		google: "9pM5JfTm1_c-Tmup10c-YeYhrLtBVv_tnZJ_mbvxGWQ",
	},
	description: "A System for Efficient Annotation of Map Query Datasets",
	// openGraph: {
	// 	title: "Title webtsite",
	// 	description: "this is the desciption",
	// 	image: "url/image.png",
	// },
	keywords: [
		"mapqator",
		"mapeval",
		"mahir labib dihan",
		"mapqa",
		"mapqa dataset",
		"google maps dataset",
	],
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AppRouterCacheProvider>
					<AuthContextProvider>
						<AppContextProvider>
							<ToastProvider>
								<GoogleMapWrapper>
									<GlobalContextProvider>
										{children}
									</GlobalContextProvider>
								</GoogleMapWrapper>
							</ToastProvider>
						</AppContextProvider>
					</AuthContextProvider>
				</AppRouterCacheProvider>
				{/* <Footer /> */}
			</body>
		</html>
	);
}
