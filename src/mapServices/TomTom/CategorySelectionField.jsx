import categories from "@/database/poiCategories.json";
import { Autocomplete, TextField } from "@mui/material";

const uniqueNames = new Set();
const options = categories.poiCategories
	.filter((category) => {
		if (uniqueNames.has(category.name)) {
			return false;
		} else {
			uniqueNames.add(category.name);
			return true;
		}
	})
	.map((category) => ({
		label: category.name,
		value: category.id,
	}));

export default function CategorySelectionField({ type, setType }) {
	const selectedOption =
		options.find((option) => option.value === type) || null;

	return (
		<Autocomplete
			value={selectedOption}
			onChange={(e, newValue) => setType(newValue?.value || "")}
			options={options}
			getOptionLabel={(option) => option.label}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Category"
					variant="outlined"
					size="small"
					required
					fullWidth
				/>
			)}
			isOptionEqualToValue={(option, value) =>
				option.value === value.value
			}
		/>
	);
}

export function formatCategory(type) {
	console.log("Type: ", type);
	console.log("Options: ", options);
	const selectedCategory = options.find((cat) => cat.value === type);
	console.log("Selected Category: ", selectedCategory);
	return selectedCategory ? selectedCategory.label : "";
}
