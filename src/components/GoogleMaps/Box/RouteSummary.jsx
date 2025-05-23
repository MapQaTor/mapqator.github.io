import { AppContext } from "@/contexts/AppContext";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useContext } from "react";

export default function RouteSummary({
	from_id,
	to_id,
	intermediates,
	optimized,
	savedPlacesMap,
}) {
	return (
		<Box className="flex flex-row w-full gap-8 justify-center">
			<Box
				className={`flex flex-col items-center ${
					optimized ? "w-1/2" : "w-full"
				}`}
			>
				<h6 className="text-base md:text-xl text-center md:font-semibold">
					{savedPlacesMap[from_id].displayName?.text}
				</h6>
				<FontAwesomeIcon icon={faArrowDown} />
				{intermediates?.length > 0 &&
					intermediates.map((intermediate, index) => (
						<>
							<h6 className="text-base md:text-xl text-center md:font-semibold">
								{savedPlacesMap[intermediate].displayName?.text}
							</h6>
							<FontAwesomeIcon icon={faArrowDown} />
						</>
					))}
				<h6 className="text-base md:text-xl text-center md:font-semibold">
					{savedPlacesMap[to_id].displayName?.text}
				</h6>
			</Box>

			{optimized && (
				<Box
					className="flex flex-col w-1/2 items-center"
					sx={{
						color: "primary.main",
					}}
				>
					<h6 className="text-base md:text-xl text-center md:font-semibold">
						{savedPlacesMap[from_id].displayName?.text}
					</h6>
					<FontAwesomeIcon icon={faArrowDown} />
					{optimized?.length > 0 &&
						optimized.map((intermediate, index) => (
							<>
								<h6 className="text-base md:text-xl text-center md:font-semibold">
									{
										savedPlacesMap[intermediate].displayName
											.text
									}
								</h6>
								<FontAwesomeIcon icon={faArrowDown} />
							</>
						))}
					<h6 className="text-base md:text-xl text-center md:font-semibold">
						{savedPlacesMap[to_id].displayName?.text}
					</h6>
				</Box>
			)}
		</Box>
	);
}
