"use client";
import {
	Container,
	CssBaseline,
	useTheme,
	Box,
	Toolbar,
	Divider,
	Button,
} from "@mui/material";
import React from "react";

import { useAuth } from "@/contexts/AuthContext";
import LeftSidebar from "../LeftSidebar";
import config from "@/config/config";
import Breadcrumb from "../BreadCrumb";
import { useRouter } from "next/navigation";
import { Login } from "@mui/icons-material";

const PrimaryLayout = ({ children }) => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	return (
		<Box sx={{ display: "flex" }}>
			{/* {isAuthenticated && ( */}
			<Box
				sx={{
					width: {
						xs: "0px",
						md: `calc(${config.drawerWidth}px)`,
					},
				}}
			>
				<div className="md:hidden">
					<Toolbar />
				</div>{" "}
				<LeftSidebar />
			</Box>
			{/* )} */}

			<div className="w-full relative">
				<Box
					className="fixed z-50 flex-col"
					sx={{
						backgroundColor: "white",
						width: {
							xs: 0,
							md: isAuthenticated
								? `calc(100% - ${config.drawerWidth}px)`
								: "100%",
						},
						display: { xs: "none", md: "flex" },
					}}
				>
					<Toolbar className="flex flex-row items-center justify-between pr-3">
						<Breadcrumb />
						{!isAuthenticated && (
							<Button
								variant="contained"
								endIcon={<Login />}
								onClick={() =>
									router.push(config.logoutRedirect)
								}
							>
								Login
							</Button>
						)}
					</Toolbar>
					<Divider />
				</Box>

				<Container className="min-h-screen">
					<Toolbar />
					{children}
				</Container>
			</div>
		</Box>
	);
};

export default PrimaryLayout;
