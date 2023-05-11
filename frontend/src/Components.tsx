import { useEffect, useState } from "react";
import axios from "axios";
import { getRandomProfile } from "@/InitialState.ts";

export const Match = () => {
	return <div>"MATCH PAGE"</div>;
};

export const Home = () => {
	return (
		<section>
			<Title />
			<Subtitle />
		</section>
	);
};

export const RandomProfile = () => {
	return (
		<div>
			<Image />
		</div>
	);
};

export function Title() {
	return <h3>section title</h3>;
}

export function Subtitle() {
	return <h4>section subtitle</h4>;
}

export function Image() {
	const profile = getRandomProfile();
	return <img src={profile.imgUri} alt={"alt"} />;
}

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
export const Button = () => {
	const [clicks, setClicks] = useState(0);

	return (
		<button
			onClick={() => {
				console.log("Clicked!");
				setClicks(clicks + 1);
			}}
		>
			Clicks: {clicks}
		</button>
	);
};

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
