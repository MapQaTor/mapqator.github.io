"use client";
import React, { useState, useEffect, useContext } from "react";
import {
	Button,
	Card,
	CardContent,
	Typography,
	CssBaseline,
	Container,
	Box,
	Divider,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import config from "@/config/config";
import { useAuth } from "@/contexts/AuthContext";
import { RemoveRedEye } from "@mui/icons-material";
import Confirmation from "@/components/Dialogs/Confirmation";
import LoginForm from "@/components/Forms/LoginForm";
import { GlobalContext } from "@/contexts/GlobalContext";

const Login = () => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const { llmResults } = useContext(GlobalContext);

	const { isAuthenticated } = useAuth();

	const handleLogin = () => {
		router.push(
			config.loginRedirect +
				(Object.keys(llmResults).length > 0 ? "/evaluation" : "")
		);
	};
	useEffect(() => {
		if (isAuthenticated) {
			handleLogin();
		}
	}, [isAuthenticated]);

	return (
		<>
			<div className="bg-gradient-to-r from-blue-100 to-green-100 w-full h-screen">
				<Confirmation
					open={open}
					setOpen={setOpen}
					onConfirm={() => {
						handleLogin();
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
								onClick={() => router.push("/")}
								className="cursor-pointer flex-row items-end flex w-full gap-2"
							>
								<div className="flex">
									<Image
										src={`${config.baseUrl}/images/logo.png`}
										alt="MapQaTor Logo"
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
									MapQaTor
								</Typography>
							</Box>
						</div>
						<Card
							sx={{ maxWidth: 400, width: "100%" }}
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
								<LoginForm />
								<Divider>
									<Typography className="text-zinc-500">
										or
									</Typography>
								</Divider>
								<Button
									type="submit"
									className="w-full rounded-lg text-sm px-5 py-2.5 text-center font-medium bg-orange-400"
									onClick={
										() => handleLogin()
										// setOpen(true)
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
						<div
							// onClick={() => {
							// 	// setLoading(true);
							// 	navigate("/");
							// }}
							className="cursor-pointer text-gray-400"
							style={{ transform: "translateY(20%)" }} // Move up by 20px
						>
							Note: Registration is not available for now.
						</div>
					</Box>
				</Container>
			</div>
		</>
	);
};

export default Login;
