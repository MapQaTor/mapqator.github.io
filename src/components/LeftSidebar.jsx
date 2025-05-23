"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
	AppBar,
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DatasetIcon from "@mui/icons-material/Dataset";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HomeIcon from "@mui/icons-material/Home";
import config from "@/config/config";
import authService from "@/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import AuthService from "@/services/authService";
import { AccountTree, Explore, Home, Login, Logout } from "@mui/icons-material";
import Breadcrumb from "./BreadCrumb";
const drawerWidth = config.drawerWidth;
function NavButton({ icon, name, to }) {
	const router = useRouter();
	const pathname = usePathname();
	return (
		<ListItem key={to} disablePadding>
			<ListItemButton
				className={`text-[1.25rem] px-4 ${
					pathname === to ? "!bg-zinc-300 " : ""
				}`}
				onClick={() => router.push(to)}
			>
				<ListItemIcon sx={{ minWidth: "0px", width: "15%" }}>
					{icon}
				</ListItemIcon>
				<ListItemText
					primary={name}
					primaryTypographyProps={{
						sx: { fontSize: "1.25rem" },
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
}

function LogoutButton() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	return (
		<ListItem key="Logout" disablePadding>
			<ListItemButton
				className={`text-[1.25rem] px-4`}
				// component={Link}
				// to="/login"
				onClick={async () => {
					if (isAuthenticated) {
						AuthService.logout();
						router.push(config.logoutRedirect);
					} else {
						router.push(config.logoutRedirect);
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: "0px", width: "15%" }}>
					{isAuthenticated ? <Logout /> : <Login />}
				</ListItemIcon>
				<ListItemText
					primary={isAuthenticated ? "Logout" : "Login"}
					primaryTypographyProps={{
						sx: { fontSize: "1.25rem" },
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
}

export default function LeftSidebar({ window }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};
	const { isAuthenticated } = useAuth();
	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};

	useEffect(() => {
		if (mobileOpen) {
			setMobileOpen(false);
		}
	}, [pathname]);

	const drawer = (
		<div>
			<Toolbar className="!px-4">
				<div
					className="text-3xl font-bold flex flex-row justify-center items-center w-full gap-2 cursor-pointer"
					onClick={() => router.push("/")}
				>
					<div className="hidden lg:flex">
						<Image
							src={`${config.baseUrl}/images/logo.png`}
							alt="MapQaTor Logo"
							width={30}
							height={30}
						/>
					</div>
					<div className="flex lg:hidden">
						<Image
							src={`${config.baseUrl}/images/logo.png`}
							alt="MapQaTor Logo"
							width={30}
							height={20}
						/>
					</div>
					MapQaTor
				</div>
			</Toolbar>
			<Divider />
			{/* {
						name: "My Evaluations",
						to: "/home/my-evaluations",
						icon: <AssessmentIcon />,
				}, */}
			<List>
				{(isAuthenticated
					? [
							{
								name: "Home",
								icon: <Home />,
								to: "/home",
							},
							{
								name: "My Dataset",
								icon: <DatasetIcon />,
								to: "/home/my-dataset",
							},
							{
								name: "Explore",
								icon: <Explore />,
								to: "/home/explore",
							},
					  ]
					: [
							{
								name: "Home",
								icon: <Home />,
								to: "/home",
							},
							{
								name: "Explore",
								icon: <Explore />,
								to: "/home/explore",
							},
					  ]
				).map(({ name, icon, to }) => (
					<NavButton icon={icon} name={name} to={to} key={to} />
				))}
			</List>
			<Divider />
			<List>
				<LogoutButton />
			</List>
			<Typography
				variant="caption"
				className="absolute left-0 bottom-0 p-2 text-center"
				width={`${drawerWidth - 16}px`}
			>
				{/* © 2024 Penguin Admin */}
				{/* {jwtDecode(getTokenFromLocalStorage()).email} */}
			</Typography>
		</div>
	);
	const container =
		window !== undefined ? () => window().document.body : undefined;
	return (
		<div
			className={`relative top-0 bottom-0 left-0 h-screen overflow-hidden`}
			style={{ width: `${drawerWidth}px` }}
		>
			<AppBar
				position="fixed"
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					ml: { md: `${drawerWidth}px` },
					display: { xs: "flex", md: "none" },

					backgroundColor: (theme) =>
						theme.palette.background.default, // Use theme's white color
				}}
			>
				<Toolbar
					className="flex flex-row justify-between items-center"
					sx={{ paddingRight: { xs: "0.25rem", md: "0.75rem" } }}
				>
					<div className="flex flex-row items-center">
						<IconButton
							// color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							sx={{
								mr: 2,
							}}
						>
							<MenuIcon />
						</IconButton>
						<Breadcrumb />
					</div>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{
					width: { md: `${drawerWidth}px` },
					flexShrink: { md: 0 },
				}}
				aria-label="mailbox folders"
			>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					ModalProps={{
						keepMounted: true,
					}}
					sx={{
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: `${drawerWidth}px`,
						},
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: `${drawerWidth}px`,
						},
						display: { xs: "none", md: "block" },
					}}
					open
					// className="hidden md:block"
				>
					{drawer}
				</Drawer>
			</Box>
		</div>
	);
}
