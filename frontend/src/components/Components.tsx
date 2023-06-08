import { useEffect, useState } from "react";
import axios from "axios";
import avatar from "@images/avatar.jpg";

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
