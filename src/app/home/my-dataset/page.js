"use client";

import QuestionsContainer from "@/components/Containers/QuestionsContainer";
import config from "@/config/config";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function MyQueriesPage() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const { setContextStatus, setQueryStatus } = useContext(GlobalContext);
	useEffect(() => {
		if (!isAuthenticated) {
			router.push(config.logoutRedirect);
		}
	}, [isAuthenticated]);

	return (
		<Container maxWidth="md">
			<Box className="py-5">
				<QuestionsContainer
					title="My Queries"
					isPersonal={true}
					onEdit={(id) => {
						router.push("/home/review?id=" + id);
					}}
				/>
			</Box>
		</Container>
	);
}
