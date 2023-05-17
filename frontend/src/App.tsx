import {
	Button,
	SearchButton,
	Home,
	UsersList,
	Match,
	RandomProfile,
	NameSearch,
	CharSearch,
	Character,
	Title,
	Subtitle,
} from "@/Components.tsx";
import { useState } from "react";
import { Link, Route, Routes, Router, BrowserRouter, useParams } from "react-router-dom";
import reactLogo from "@images/react.svg";
import viteLogo from "/vite.svg";
//import "@css/App.css";
import "@css/header.css";
import "@css/content.css";
import "@css/footer.css";
import logo from "@images/logo.png";

// This is our first React "Component"
export function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<header>
					<div className="top">
						<div className="logo">
							<img src={logo} alt="Pears' Character Profiles Logo" />
						</div>
						<Title />
						<Subtitle />
					</div>
					<nav>
						<menu className="topmenu">
							<li>
								{" "}
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/profile">My Profile</Link>
							</li>
							<li>
								<Link to="/character/42934531">Example Profile</Link>
							</li>
							<li>
								<Link to="/randomProfile">Random Profile</Link>
							</li>
							<li>
								<Link to="/search/september-snow">Character Search</Link>
							</li>
						</menu>
					</nav>
				</header>
				<main>
					{
						//<Button />
					}
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/match" element={<Match />} />
						<Route path="/character/:idParam" element={<Character />} />
						<Route path="/randomProfile" element={<RandomProfile />} />
						<Route path="/search/:fullNameWithDash" element={<NameSearch />} />
					</Routes>
				</main>
				<footer>Copyright 2023 Pears' Character Profiles</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
