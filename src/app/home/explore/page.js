"use client";
import QueryCard from "@/components/Cards/SingleQueryCard";
import examples from "@/database/examples.json";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
	const router = useRouter();
	return (
		<Container maxWidth="md">
			<Box className="py-5">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<h1 className="text-3xl md:text-4xl font-normal pb-5 mr-auto">
						Example Queries
					</h1>
				</div>
				<div className="flex flex-col gap-5">
					{examples.map((query, index) => (
						<QueryCard
							key={index}
							entry={query}
							onEdit={() => router.push("/home/context#edit")}
							mode="explore"
							index={index}
						/>
					))}
				</div>
			</Box>
		</Container>
	);
}
