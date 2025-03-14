const StepIndicator = ({ currentStep, totalSteps }) => (
	<div className="flex items-center space-x-2">
		{[...Array(totalSteps)].map((_, index) => (
			<div
				key={index}
				className={`w-2 h-2 rounded-full ${
					index + 1 === currentStep ? "bg-blue-500" : "bg-gray-300"
				}`}
			/>
		))}
	</div>
);

export default StepIndicator;
