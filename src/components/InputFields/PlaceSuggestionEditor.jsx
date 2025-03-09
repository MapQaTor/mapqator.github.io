import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Typography,
	TextField,
	FormControl,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	Tooltip,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function PlaceSuggestionEditor({
	index,
	placeholder,
	value,
	onChange,
	minRows,
	InputProps,
	label,
}) {
	const { query, setQuery, savedPlacesMap } = useContext(GlobalContext);
	const [isGenerating, setIsGenerating] = useState(false);
	const { context } = useContext(GlobalContext);
	const [showMentions, setShowMentions] = useState(false);
	const [mentionStartIndex, setMentionStartIndex] = useState(-1);
	const [mentionAnchorEl, setMentionAnchorEl] = useState(null);
	const [mentionSearch, setMentionSearch] = useState("");
	const [names, setNames] = useState([]);
	const [selectedMentionIndex, setSelectedMentionIndex] = useState(0); // New state for keyboard navigation
	const inputRef = useRef(null);

	useEffect(() => {
		const names = Object.values(savedPlacesMap).map(
			(place) => place.displayName?.text
		);
		setNames(names);
	}, [savedPlacesMap]);

	const handleChange = (e) => {
		const newValue = e.target.value;
		const cursorPosition = e.target.selectionStart;
		const textBeforeCursor = newValue.slice(0, cursorPosition);
		const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

		if (lastAtSymbol !== -1 && cursorPosition > lastAtSymbol) {
			const mentionText = textBeforeCursor.slice(lastAtSymbol + 1);
			setShowMentions(true);
			setMentionAnchorEl(e.target);
			setMentionSearch(mentionText);
			setMentionStartIndex(lastAtSymbol);
		} else {
			setShowMentions(false);
			setMentionSearch("");
			setMentionStartIndex(-1);
		}

		onChange(newValue);
	};

	const handleMentionSelect = (name) => {
		const currentValue = value;
		const cursorPosition = inputRef.current.selectionStart;
		const textBeforeMention = currentValue.slice(0, mentionStartIndex);
		const textAfterCursor = currentValue.slice(cursorPosition);
		const newValue = textBeforeMention + `${name}` + textAfterCursor;

		onChange(newValue);

		setShowMentions(false);
		setMentionSearch("");
		setMentionStartIndex(-1);

		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
				const newCursorPosition = mentionStartIndex + name.length;
				inputRef.current.setSelectionRange(
					newCursorPosition,
					newCursorPosition
				);
			}
		}, 0);
	};

	const handleKeyDown = (e) => {
		if (!showMentions) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedMentionIndex((prevIndex) =>
				Math.min(prevIndex + 1, filteredNames.length - 1)
			);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedMentionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
		} else if (e.key === "Enter" && showMentions) {
			e.preventDefault();
			handleMentionSelect(filteredNames[selectedMentionIndex]);
		}
	};

	const filteredNames = names?.filter((name) =>
		name?.toLowerCase().includes(mentionSearch.toLowerCase())
	);

	return (
		<div style={{ position: "relative" }} className="w-full">
			{/* <Tooltip
				title='Press "@" to get place name suggestions'
				arrow
				position={"top"}
			> */}
			<TextField
				fullWidth
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown} // Handle key down for keyboard navigation
				multiline
				required
				autoComplete="off"
				minRows={minRows || 4}
				inputRef={inputRef}
				InputProps={InputProps}
				label={label}
				helperText='Tip: Press "@" for place suggestions'
			/>
			{/* </Tooltip> */}

			{showMentions && (
				<List
					sx={{
						position: "absolute",
						zIndex: 10,
						bgcolor: "grey.200",
						border: "1px solid",
						borderColor: "divider",
						width: "100%",
						maxHeight: 200,
						overflowY: "auto",
						borderRadius: 1,
					}}
				>
					{filteredNames.map((name, index) => (
						<ListItemButton
							key={name}
							onClick={() => handleMentionSelect(name)}
							selected={index === selectedMentionIndex} // Highlight selected item
						>
							<ListItemText primary={name} />
						</ListItemButton>
					))}
				</List>
			)}
		</div>
	);
}
