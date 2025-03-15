import React, { useState, useEffect, useContext } from "react";
import {
	Typography,
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Pagination,
	Button,
} from "@mui/material";
import { getUserName } from "@/api/base";
import categories from "@/database/categories.json";
import QueryCard from "@/components/Cards/SingleQueryCard";
import { AppContext } from "@/contexts/AppContext";
import { convertFromSnake } from "@/services/utils";
import { Download } from "@mui/icons-material";

const itemsPerPage = 10;

export default function QuestionsContainer({ title, isPersonal, onEdit }) {
	const { queries } = useContext(AppContext);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const allCategories = ["All", ...categories];
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);

	const handlePagination = (event, value) => {
		setPage(value);
		handleListChange(value);
	};

	useEffect(() => {
		handleListChange(page);
	}, [queries]);

	useEffect(() => {
		setPage(1);
		handleListChange(1);
	}, [selectedCategory]);

	const handleListChange = (page) => {
		const start = (page - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		let newQueries;
		if (selectedCategory === "All") {
			newQueries = queries.filter(
				(item) => !isPersonal || item.username === getUserName()
			);
		} else {
			newQueries = queries.filter(
				(item) =>
					item.classification.includes(selectedCategory) &&
					(!isPersonal || item.username === getUserName())
			);
		}
		setPageCount(Math.ceil(newQueries.length / itemsPerPage));
		setData(newQueries.slice(start, end));
	};

	const handleDownload = () => {
		const filteredQueries = isPersonal
			? queries.filter((item) => item.username === getUserName())
			: queries;
		const jsonString = JSON.stringify(filteredQueries, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = href;
		link.download = "dataset.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between items-center">
				<h1 className="text-3xl md:text-4xl font-normal pb-5 mr-auto">
					{title}
				</h1>
				<Box sx={{ mb: 3, ml: "auto", display: "flex", gap: 2 }}>
					{/* <FormControl sx={{ minWidth: 200 }} size="small">
						<InputLabel id="category-select-label">
							Filter by Category
						</InputLabel>
						<Select
							labelId="category-select-label"
							id="category-select"
							value={selectedCategory}
							label="Filter by Category"
							onChange={(e) => {
								setSelectedCategory(e.target.value);
							}}
						>
							{allCategories.map((category) => (
								<MenuItem key={category} value={category}>
									{convertFromSnake(category)}
								</MenuItem>
							))}
						</Select>
					</FormControl> */}
					<Button
						variant="contained"
						onClick={handleDownload}
						startIcon={<Download />}
					>
						Download Dataset
					</Button>
				</Box>
			</div>
			{/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				Download the JSON file to evaluate the dataset using Open Source
				LLMs. Run the source code at{" "}
				<a
					href="https://github.com/mahirlabibdihan/mapquest-evaluation"
					target="_blank"
					rel="noopener noreferrer"
					className="underline text-black hover:text-blue-500"
				>
					https://github.com/mahirlabibdihan/mapquest-evaluation
				</a>{" "}
				on your own machine.
			</Typography> */}
			<div className="flex flex-col gap-5">
				{data.map((entry, index) => (
					<QueryCard
						key={entry.id}
						entry={entry}
						onEdit={onEdit}
						isPersonal={isPersonal}
						index={index}
					/>
				))}
			</div>
			<div className="flex justify-center bottom-0 left-0 right-0 pt-4">
				<Pagination
					size="medium"
					count={pageCount}
					color="primary"
					onChange={handlePagination}
					siblingCount={1}
					page={page}
				/>
			</div>
		</>
	);
}
