import { Button, Header, Home, UsersList, Match, Messages, RandomProfile } from "@/Components.tsx";
import { useState } from "react";
import { Link, Route, Routes, Router, BrowserRouter } from "react-router-dom";
import reactLogo from "@images/react.svg";
import viteLogo from "/vite.svg";
//import "@css/App.css";
import "@css/header.css";

// This is our first React "Component"
export function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<header>
					<div className="top">
						<div className="logo">
							<img src="/assets/images/logo.jpg" alt="Pears' Character Profiles Logo" />
						</div>
						<h1>Pears' Character Profiles</h1>
						<h2>H2</h2>
					</div>
					<nav>
						<menu className="topmenu">
							<li>
								{" "}
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/match">My Profile</Link>
							</li>
							<li>
								<Link to="/randomProfile">Random Profile</Link>
							</li>
						</menu>
					</nav>
				</header>

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/match" element={<Match />} />
					<Route path="/randomProfile" element={<RandomProfile />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
