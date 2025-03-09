import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAdd,
	faBell,
	faChartLine,
	faEye,
	faGears,
	faHardDrive,
	faHouse,
	faMailBulk,
	faMap,
	faPen,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
	Assessment,
	Category,
	Checklist,
	Dataset,
	Description,
	Home,
	Info,
	Lightbulb,
	List,
	Map,
	QuestionAnswer,
	QuestionMark,
} from "@mui/icons-material";
import { Grid } from "@mui/material";

// Utility function to format breadcrumb text
function formatBreadcrumbText(text) {
	return text
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
function getIcon(value) {
	// return value === "Trainer" ? faPen : value == faHouse;
	// Switch case to return the correct icon based on the value
	switch (value) {
		case "context":
			return <Description />;
		case "question":
			return <QuestionAnswer />;
		case "evaluation":
			return <Assessment />;
		case "my-dataset":
			return <Dataset />;
		case "categories":
			return <List />;
		case "answer":
			return <Lightbulb />;
		case "review":
			return <Checklist />;
		default:
			return <Home />;
	}
}
export default function Breadcrumb() {
	const pathname = usePathname();
	const router = useRouter();

	const handleClick = (event, to) => {
		event.preventDefault();
		router.push(to); // Navigate to the clicked breadcrumb's link
	};

	const pathnames = pathname.split("/").filter((x) => x);

	const breadcrumbs = [
		// pathnames.length === 0 ? (
		// 	<Typography key="1" className="flex items-center gap-2">
		// 		<FontAwesomeIcon icon={faHouse} className="text-black" />
		// 		Home
		// 	</Typography>
		// ) : (
		// 	<Link
		// 		underline="hover"
		// 		key="1"
		// 		color="inherit"
		// 		href="/"
		// 		onClick={(event) => handleClick(event, "/")}
		// 		className="flex items-center gap-2"
		// 	>
		// 		<FontAwesomeIcon icon={faHouse} />
		// 		Home
		// 	</Link>
		// ),
		...pathnames.map((value, index) => {
			const last = index === pathnames.length - 1;
			const to = `/${pathnames.slice(0, index + 1).join("/")}`;
			const formattedValue = formatBreadcrumbText(value);

			return last ? (
				<Typography
					key={index + 2}
					className="flex items-center gap-2 text-black"
				>
					{getIcon(value)}
					{formattedValue}
				</Typography>
			) : (
				<Link
					underline="hover"
					key={index + 2}
					href={to}
					onClick={(event) => handleClick(event, to)}
					className="flex items-center gap-2"
					color="inherit"
				>
					{getIcon(value)}
					{formattedValue}
				</Link>
			);
		}),
	];

	return (
		<Breadcrumbs
			separator={<NavigateNextIcon fontSize="small" />}
			aria-label="breadcrumb"
		>
			{breadcrumbs}
		</Breadcrumbs>
	);
}
