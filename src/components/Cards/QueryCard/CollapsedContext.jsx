"use client";
import React, { useState } from "react";
import { Typography, Paper, Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
export default function CollapsedContext({ context }) {
	const [contextExpanded, setContextExpanded] = useState(false);

	return (
		<>
			{context.split("\n").map(
				(line, index) =>
					(contextExpanded || index < 5) && (
						<React.Fragment key={index}>
							<p
								key={index}
								className="w-full text-left"
								style={{
									whiteSpace: "pre-line",
								}}
								dangerouslySetInnerHTML={{
									__html:
										line +
										(line === "" &&
										index < context.split("\n").length - 1
											? "\n"
											: ""),
								}}
							/>
						</React.Fragment>
					)
			)}

			{context === "" && (
				<p className="text-center my-auto text-lg md:text-xl text-zinc-400">
					No context provided.
				</p>
			)}

			{context.split("\n").length > 5 && (
				<Button
					onClick={() => setContextExpanded((prev) => !prev)}
					sx={{ mt: 1, textTransform: "none" }}
				>
					<div className="flex flex-row gap-1 items-end">
						{!contextExpanded && (
							<FontAwesomeIcon icon={faEllipsis} />
						)}
						{contextExpanded ? "Show Less" : "Read More"}
					</div>
				</Button>
			)}
		</>
	);
}
