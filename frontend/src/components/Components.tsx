import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Char, CharacterResponse } from "@/PCPTypes.ts";
import avatar from "@images/avatar.jpg";
import portrait from "@images/portrait.jpg";
import { useCookies } from "react-cookie";
import { getCookie } from "@/components/AuthCallback.tsx";

// login and logout buttons
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function Title() {
	return <h1>Pears' Character Profiles</h1>;
}

export function Subtitle() {
	return <h2>By Pearstopher</h2>;
}

export const Link = (props) => {
	const id = props.id;
	const name = props.name;
	return <a href={`/character/${id}`}>{name}</a>;
};

// 1) Make a place to store the users list result
// 2) Make the actual request to backend and store result
// 3) Show the list of users formatted nicely in our webpage

/*
 ** Hooks—functions starting with `use`—can only be called at the top level of your components
 * or [your own Hooks.](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks)**
 * You can’t call Hooks inside conditions, loops, or other nested functions. Hooks are functions,
 * but it’s helpful to think of them as unconditional declarations about your component’s needs.
 * You “use” React features at the top of your component similar to how you “import” modules
 * at the top of your file.
 */

export const UsersList = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const getUsers = async () => {
			const usersRes = await axios.get("http://localhost:8080/users");
			return usersRes.data;
		};

		getUsers().then(setUsers);
	}, []);

	return (
		<div>
			<h2>Users:</h2>
			{users ? (
				<ul>
					{users.map((user: { email: string; name: string }) => (
						<li key={user.email}>
							{" "}
							{user.name} - {user.email}{" "}
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
};

export const FeaturedChars = (props) => {
	const [featuredChars, setFeaturedChars] = useState([]);

	useEffect(() => {
		const getFeaturedChars = async () => {
			const charsRes = await axios({
				method: "GET",
				url: `http://localhost:8080/featured/`,
			});
			return charsRes.data;
		};

		getFeaturedChars().then(setFeaturedChars);
	}, []);

	return (
		<div id={"featuredChars"}>
			<h4>Featured Characters:</h4>
			{featuredChars ? (
				<ul>
					{featuredChars.map(
						(char: { id: number; fName: string; lName: string; avatar: string }) => (
							<li key={char.id}>
								{" "}
								<img
									src={char.avatar ? char.avatar : avatar}
									alt={"Avatar image of character's face."}
								/>
								<Link id={char.id} name={`${char.fName} ${char.lName}`} />
								<div id={"id"}>{`ID: ${char.id}`}</div>
							</li>
						)
					)}
				</ul>
			) : null}
		</div>
	);
};
