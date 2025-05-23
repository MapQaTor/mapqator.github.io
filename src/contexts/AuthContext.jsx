"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { isTokenValid } from "@/api/base";

const AuthContext = createContext();
export default function AuthContextProvider({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const handleStorageChange = () => {
		if (isTokenValid()) {
			setIsAuthenticated(true);
		} else {
			const token = localStorage.getItem("token");
			if (token) {
				console.log("Removing token");
				localStorage.removeItem("token");
			}
			setIsAuthenticated(false);
		}
	};
	useEffect(() => {
		handleStorageChange();
		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);
	return (
		<AuthContext.Provider value={{ isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
