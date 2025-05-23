import { CheckBox } from "@mui/icons-material";
import {
	Checkbox,
	FormControl,
	Grid,
	InputLabel,
	ListItemText,
	MenuItem,
	Select,
} from "@mui/material";

const avoidMap = {
	avoidTolls: "Tolls",
	avoidMotorways: "Motorways",
	avoidFerries: "Ferries",
	avoidUnpaved: "Unpaved roads",
	avoidCarPools: "Carpools",
	avoidAlreadyUsed: "Already used roads",
};

export default function AvoidSelectionField({ form, setForm }) {
	return (
		<Grid item xs={12}>
			<FormControl fullWidth size="small">
				<InputLabel>Avoid</InputLabel>
				<Select
					// input={<OutlinedInput label="Tag" />}
					value={Object.entries(form.routeModifiers)
						.map(([key, value]) => (value ? key : null))
						.filter((x) => x)}
					onChange={(e) => {
						const newOptions = {
							...form.routeModifiers,
						};
						Object.keys(avoidMap).forEach((key) => {
							newOptions[key] = e.target.value.includes(key);
						});
						setForm((prev) => ({
							...prev,
							routeModifiers: newOptions,
						}));
					}}
					label={"Avoid"}
					multiple
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <em>Any</em>; // Custom label for empty array
						}
						return selected
							.map((value) => avoidMap[value])
							.join(", ");
					}}
				>
					{Object.keys(avoidMap).map((key) => (
						<MenuItem key={key} value={key}>
							<Checkbox checked={form.routeModifiers[key]} />
							<ListItemText primary={avoidMap[key]} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Grid>
	);
}
