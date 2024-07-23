"use client";
import React, { useState, useEffect, useContext } from "react";
import AuthService from "@/services/authService";
import {
	FormControl,
	InputLabel,
	OutlinedInput,
	Button,
	Card,
	CardContent,
	Typography,
	CssBaseline,
	Container,
	Box,
	Avatar,
	InputAdornment,
	TextField,
	Divider,
} from "@mui/material";
import Image from "next/image";
import EyeIcon from "@/components/Icons/EyeIcon";
// import { setLoading } from "@/page";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import config from "@/config.json";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useAuth } from "@/contexts/AuthContext";
import {
	DoorBackOutlined,
	DoorFrontOutlined,
	DoorSlidingOutlined,
	Lock,
	LoginOutlined,
	RemoveRedEye,
	Search,
} from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Confirmation from "@/components/Dialogs/Confirmation";

const MuiTextField = (props) => {
	return (
		<TextField
			required
			placeholder={props.placeholder}
			type="text"
			value={props.value}
			onChange={props.onChange}
			// label={props.label}
			size="small"
			fullWidth
			variant="outlined"
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<FontAwesomeIcon icon={faUser} />
					</InputAdornment>
				),
			}}
		/>
	);
};

const MuiPasswordField = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<TextField
			required
			placeholder={props.placeholder}
			type={showPassword ? "text" : "password"}
			value={props.value}
			onChange={props.onChange}
			size="small"
			fullWidth
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<FontAwesomeIcon icon={faLock} />
					</InputAdornment>
				),
				endAdornment: (
					<InputAdornment position="end">
						<EyeIcon
							isVisible={props.value.length > 0}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
					</InputAdornment>
				),
			}}
		/>
	);
};
const Login = () => {
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [loggingIn, setLoggingIn] = useState(false);
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	useEffect(() => {
		if (isAuthenticated) {
			router.push(config.loginRedirect);
		}
	}, [isAuthenticated]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!loggingIn) {
			// setLoading(true);
			setLoggingIn(true);

			const res = await AuthService.login({
				username: username,
				password: password,
			});
			if (res.success) {
				router.push(config.loginRedirect);
			} else {
				// setLoading(false);
				setLoggingIn(false);
			}
		}
	};
	const [baseUrl, setBaseUrl] = useState(
		process.env.REACT_APP_BASE_URL
			? process.env.REACT_APP_BASE_URL
			: process.env.NODE_ENV === "development"
			? ""
			: "https://mahirlabibdihan.github.io/mapquest"
	);

	return (
		<>
			<div className="bg-gradient-to-r from-blue-100 to-green-100 w-full h-screen">
				<Confirmation
					open={open}
					setOpen={setOpen}
					onConfirm={() => {
						router.push(config.loginRedirect + "#onboard");
					}}
					text="As a guest, you can explore different features of our platform. But your changes won't be saved in our database."
				/>
				<Container
					component="main"
					maxWidth="xs"
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}
				>
					<CssBaseline />
					<Box
						sx={{
							marginTop: 8,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							width: "100%",
						}}
					>
						<div
							// onClick={() => {
							// 	// setLoading(true);
							// 	navigate("/");
							// }}
							className="absolute cursor-pointer"
							style={{ transform: "translateY(-120%)" }} // Move up by 20px
						>
							<Box
								onClick={() => router.push("landing")}
								className="cursor-pointer flex-row items-end flex w-full gap-2"
							>
								<div className="flex">
									<Image
										src={`${baseUrl}/images/logo.png`}
										alt="MapQuest Logo"
										width={30}
										height={30}
									/>
								</div>

								<Typography
									variant="h4"
									component="div"
									sx={{
										// ml: 2,
										color: "#444",
										fontWeight: "bold",
									}}
								>
									MapQuest
								</Typography>
							</Box>
						</div>
						<Card
							sx={{ maxWidth: 600, width: "100%" }}
							className="rounded-lg"
							// variant="elevation"
						>
							<CardContent
								className="flex flex-col gap-3 !p-8"
								// sx={{ paddingBottom: "3rem" }}
							>
								<Typography
									variant="h5"
									component="h2"
									className="font-semibold text-center"
								>
									Sign in to your account
								</Typography>
								<form
									className="space-y-4"
									onSubmit={handleSubmit}
								>
									<MuiTextField
										label="Username"
										placeholder="username"
										onChange={(e) =>
											setUserName(e.target.value)
										}
										value={username}
									/>
									<MuiPasswordField
										label="Password"
										placeholder="••••••••"
										onChange={(e) =>
											setPassword(e.target.value)
										}
										value={password}
									/>
									<LoadingButton
										type="submit"
										className="w-full rounded-lg text-sm px-5 py-2.5 text-center font-medium"
										// onClick={handleSubmit}
										variant="contained"
										fullWidth
										loading={loggingIn}
										startIcon={<LoginOutlined />}
										loadingPosition="start"
									>
										Sign in
									</LoadingButton>
								</form>
								<Divider>
									<Typography className="text-zinc-500">
										or
									</Typography>
								</Divider>
								<Button
									type="submit"
									className="w-full rounded-lg text-sm px-5 py-2.5 text-center font-medium bg-orange-400"
									onClick={() =>
										// router.push(config.loginRedirect)
										setOpen(true)
									}
									// color="orange"
									startIcon={<RemoveRedEye />}
									variant="outlined"
									fullWidth
								>
									View as Guest
								</Button>
							</CardContent>
						</Card>
					</Box>
				</Container>
			</div>
		</>
	);
};

export default Login;
