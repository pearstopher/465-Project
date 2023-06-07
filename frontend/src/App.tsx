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
	MyProfile,
	Callback,
	LoginButton,
	LogoutButton,
	SampleProfile,
} from "@/components/Components.tsx";
import { useState } from "react";
import { Link, Route, Routes, Router, BrowserRouter, useParams } from "react-router-dom";
import reactLogo from "@images/react.svg";
import viteLogo from "/vite.svg";
//import "@css/App.css";
import "@css/header.css";
import "@css/content.css";
import "@css/footer.css";
import logo from "@images/logo.png";
import { useCookies } from "react-cookie";
import { useAuth0 } from "@auth0/auth0-react";

// This is our first React "Component"
export function App() {
	const { user, isAuthenticated } = useAuth0();
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
								<Link to="/search">Search</Link>
							</li>
							{isAuthenticated ? (
								<>
									<li>
										<Link to="/myProfile">My Profile</Link>
									</li>
									<li>
										<LogoutButton />
									</li>
								</>
							) : (
								<li>
									<LoginButton />
								</li>
							)}
							{/*<li>*/}
							{/*	<Link to="/character/42934531">Example Profile</Link>*/}
							{/*</li>*/}
						</menu>
					</nav>
				</header>
				<main>
					{
						//<Button />
					}
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/character/:idParam" element={<Character />} />
						<Route path="/myProfile" element={<MyProfile />} />
						<Route path="/search/:fullNameWithDash?" element={<NameSearch />} />
						<Route path="/callback" element={<Callback />} />
					</Routes>
				</main>
				<footer>Copyright 2023 Pears' Character Profiles</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
