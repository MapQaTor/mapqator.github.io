import PrimaryLayout from "@/components/Layouts/PrimaryLayout";
import LeftSidebar from "@/components/LeftSidebar";
import { useAuth } from "@/contexts/AuthContext";
import GlobalContextProvider from "@/contexts/GlobalContext";
import { Box, Container, Toolbar } from "@mui/material";
export const metadata = {
	title: "Home",
	description: "Home page of MapQaTor",
};
export default function RootLayout({ children }) {
	return <PrimaryLayout>{children}</PrimaryLayout>;
}
