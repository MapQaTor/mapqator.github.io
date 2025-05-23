"use client";

import { createContext, useEffect, useState } from "react";
import queryApi from "@/api/queryApi";
import placeApi from "@/api/placeApi";

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
	const initSavedPlacesMap = {
		1: {
			name: "Bangladesh University of Engineering and Technology",
			place_id: 1,
			formatted_address: "Polashi Bazar, Azimpur, Dhaka",
			rating: "4.5",
			geometry: {
				location: {
					lat: 40.712776,
					lng: -74.005974,
				},
			},
		},
		2: {
			name: "Labaid Hospital",
			place_id: 2,
			formatted_address: "Dhanmondi 32 Road, Dhaka",
			rating: "4.8",
			geometry: {
				location: {
					lat: 34.052235,
					lng: -118.243683,
				},
			},
		},
		ChIJNwjmp8q4VTcRxVCb9Pb8fvQ: {
			name: "Sultan's Dine (Dhanmondi Branch)",
			place_id: "ChIJNwjmp8q4VTcRxVCb9Pb8fvQ",
			formatted_address: "Polashi Bazar, Azimpur, Dhaka",
			rating: "4.5",
			geometry: {
				location: {
					lat: 23.7388632,
					lng: 90.3753979,
				},
			},
			opening_hours: {
				weekday_text: [
					"Monday: 12:00\u2009\u2013\u200910:00\u202fPM",
					"Tuesday: 12:00\u2009\u2013\u200910:00\u202fPM",
					"Wednesday: 12:00\u2009\u2013\u200910:00\u202fPM",
					"Thursday: 12:00\u2009\u2013\u200910:00\u202fPM",
					"Friday: 12:00\u2009\u2013\u200910:00\u202fPM",
					"Saturday: 12:00\u2009\u2013\u200910:00\u202fPM",
					"Sunday: 12:00\u2009\u2013\u200910:00\u202fPM",
				],
			},
			price_level: 2,
			rating: 4.3,
			user_ratings_total: 19284,
			delivery: true,
			dine_in: true,
			reservable: true,
			takeout: true,
			serves_breakfast: false,
			serves_lunch: true,
			serves_dinner: true,
			serves_brunch: true,
			wheelchair_accessible_entrance: true,
			formatted_address:
				"Green Akshay Plaza, 1st Floor, 146/G (Old), 59, New \u09b8\u09be\u09a4\u09ae\u09b8\u099c\u09bf\u09a6 \u09b8\u09a1\u09bc\u0995, \u09a2\u09be\u0995\u09be 1209, Bangladesh",
		},
	};
	const exampleQueries = [
		{
			id: 152,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 153,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "",
			context_json: {},
			context_gpt: "",
			classification: "routing",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 154,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 155,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "poi",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 156,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "poi",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 157,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 158,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 159,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 160,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 161,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 162,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 163,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "trip",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "invalid",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
	];

	const [queries, setQueries] = useState([]);

	const fetchQueries = async () => {
		// setLoading(true);
		try {
			const res = await queryApi.getNewQueries();
			if (res.success) {
				console.log("Data: ", res.data);
				setQueries(res.data);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const fetchPlaces = async () => {
		console.log("Fetching places");
		// setButtonLoading(true);
		try {
			const res = await placeApi.getPlaces();
			if (res.success) {
				// create a map for easy access
				const newSavedPlacesMap = {};
				res.data.forEach((e) => {
					newSavedPlacesMap[e.place_id] = e;
				});
				console.log("Places: ", res.data);
				setSavedPlacesMap(newSavedPlacesMap);
				// setFetched(true);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
		// setButtonLoading(false);
	};

	useEffect(() => {
		// if (process.env.NODE_ENV === "production")
		{
			fetchQueries();
			// fetchPlaces();
		}
	}, []);

	return (
		<AppContext.Provider value={{ queries, setQueries }}>
			{children}
		</AppContext.Provider>
	);
}
