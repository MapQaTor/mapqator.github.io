"use client";
import { Button, Typography, Box, Fade } from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Grid, Paper, Icon, Container } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DatasetIcon from "@mui/icons-material/Dataset";
import AssessmentIcon from "@mui/icons-material/Assessment";
import config from "@/config/config";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "./footer";

export default function PageComponent() {
	const { isAuthenticated } = useAuth();
	const [baseUrl, setBaseUrl] = useState(
		process.env.REACT_APP_BASE_URL
			? process.env.REACT_APP_BASE_URL
			: process.env.NODE_ENV === "development"
			? ""
			: "https://mahirlabibdihan.github.io/mapquest"
	);
	const [showContent, setShowContent] = useState(false);
	const router = useRouter();
	useEffect(() => {
		setShowContent(true);
	}, []);

	const features = [
		{
			icon: <MapIcon fontSize="large" />,
			title: "Context Generation",
			description:
				"Generate rich, place-related contexts using our intuitive interface with Google Maps API.",
		},
		{
			icon: <QuestionAnswerIcon fontSize="large" />,
			title: "Question Creation",
			description:
				"Easily create relevant questions based on the map contexts you've generated.",
		},
		{
			icon: <DatasetIcon fontSize="large" />,
			title: "Dataset Management",
			description:
				"Organize, edit, and version your QnA datasets efficiently with our comprehensive tools.",
		},
		{
			icon: <AssessmentIcon fontSize="large" />,
			title: "Evaluation Results",
			description:
				"Showcase your model's performance using our built-in visualization tools.",
		},
	];

	console.log("url", `${process.env.REACT_APP_BASE_URL}/images/logo.png`);
	return (
		<>
			<Box
				className="bg-gradient-to-r from-blue-100 to-green-100 w-full min-h-screen flex flex-col items-center justify-center p-1"
				sx={{ overflow: "hidden", position: "relative" }}
			>
				<Fade in={showContent} timeout={1000}>
					<Box className="text-center">
						<Box className="flex flex-col md:flex-row items-center justify-center md:items-end gap-0 md:gap-5">
							<motion.img
								src={`${baseUrl}/images/logo.png`}
								alt="Google Maps Logo"
								style={{
									width: "140px",
									marginBottom: "30px",
								}}
								initial={{ y: -50, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5 }}
							/>
							<motion.div
								initial={{ y: -50, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								<div className="hidden md:flex flex-col items-start justify-center mb-16">
									<Typography
										variant="h3"
										component="div"
										sx={{
											// ml: 2,
											color: "#333",
											fontWeight: "bold",
											fontSize: "5rem",
										}}
									>
										MapQaTor
									</Typography>
									<Typography
										variant="h6"
										component="div"
										sx={{
											color: "#666",
											fontWeight: "300",
											ml: {
												xs: "2rem",
												md: "3rem",
											},
											transform: "translateY(-10px)",
										}}
										className="h-3 font-mono"
										// style={{}}
									>
										A Tool for NLP and Geo-Spatial
										Researchers
									</Typography>
								</div>
							</motion.div>

							{/* <Typography
							variant="h2"
							component="h1"
							gutterBottom
							sx={{
								fontWeight: "bold",
								color: "#333",
								mb: 5,
								textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
							}}
						>
							MapQaTor
						</Typography> */}
						</Box>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5, duration: 0.8 }}
						>
							<Typography
								sx={{
									fontSize: {
										xs: "2rem",
										md: "2.5rem",
									},
									fontWeight: "600",
									color: "#555",
									mb: 1,
									textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
								}}
							>
								Your Journey Begins Here
							</Typography>
							<Typography
								variant="h6"
								sx={{
									fontSize: {
										xs: "1rem",
										md: "1.2rem",
									},
									color: "#666",
									mb: 6,
									fontWeight: "300",
								}}
							>
								Create, Manage, and Evaluate Geo-Spatial QnA
								from Map Services
							</Typography>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								variant="contained"
								size="large"
								sx={{
									fontWeight: "bold",
									px: 4,
									py: 1,
									borderRadius: 50,
									boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
									backgroundColor: "#34A853", // Google Green
									color: "white",
									fontSize: "1.1rem",
									"&:hover": {
										backgroundColor: "#2E8B57", // Darker shade of green
									},
								}}
								onClick={() =>
									router.push(
										// isAuthenticated
										// 	?
										config.loginRedirect
										// : config.logoutRedirect
									)
								}
							>
								Start Your Adventure
							</Button>
						</motion.div>
						<Typography
							variant="body1"
							sx={{
								// position: "absolute",
								color: "#666",
								mt: 1,
								fontWeight: "400",
								"& a": {
									color: "#1a73e8",
									textDecoration: "none",
									"&:hover": {
										textDecoration: "underline",
									},
								},
								// maxWidth: "90%",
								textAlign: "center",
							}}
						>
							Or, read our{" "}
							<a
								href="https://mapqator.github.io/paper/"
								target="_blank"
								rel="noopener noreferrer"
							>
								research paper
							</a>{" "}
						</Typography>
					</Box>
				</Fade>
				{/* <div style={{ position: "absolute", bottom: 10 }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.8 }}
				>
					<Typography
						variant="body2"
						sx={{
							color: "#888",
							fontWeight: "light",
						}}
					>
						Developed by Mahir Labib Dihan
					</Typography>
				</motion.div>
			</div> */}
			</Box>
			<Footer />
		</>
	);
}
