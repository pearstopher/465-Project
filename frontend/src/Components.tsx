import { useEffect, useState } from "react";
import axios from "axios";
import { getRandomProfile } from "@/InitialState.ts";
import { useParams, useNavigate } from "react-router-dom";

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

export const NameSearch = () => {
	// extract the name from the url
	const { fullNameWithDash } = useParams();
	const fullNameArr = fullNameWithDash.split("-");

	const firstName = fullNameArr[0];
	const lastName = fullNameArr[1];

	const fullName =
		firstName.charAt(0).toUpperCase() +
		firstName.slice(1) +
		" " +
		lastName.charAt(0).toUpperCase() +
		lastName.slice(1);

	return (
		<section>
			<h3>Search results for {fullName}:</h3>

			<CharSearch />
		</section>
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

export const SearchButton = () => {
	const [fName, setFName] = useState("First");
	const [lName, setLName] = useState("Last");
	const [fPrev, setFPrev] = useState("");
	const [lPrev, setLPrev] = useState("");
	const [clicks, setClicks] = useState(0);

	const navigate = useNavigate();

	const clearFirst = (e) => {
		console.log(fPrev);
		const val = e.target.value;
		if (val === "First") {
			e.target.value = "";
			setFName("");
			setFPrev("First");
		}
	};

	const addFirst = (e) => {
		let val = e.target.value;
		if (val === "") {
			e.target.value = "First";
			setFName("First");
			e.target.setSelectionRange(0, 0);
		}
		if (fPrev === "First" || e.target.selectionStart === 1) {
			val = val.substring(0, 1);
			e.target.value = val;
			setFName(val);
		}
		setFPrev(val);
	};

	const clearLast = (e) => {
		const val = e.target.value;
		if (val === "Last") {
			e.target.value = "";
			setLName("");
		}
	};

	return (
		<div id={"searchForm"}>
			<input
				id={"firstName"}
				defaultValue={fName}
				onClick={(e) => {
					// const firstName = document.getElementById("firstName");
					clearFirst(e);
				}}
				onChange={(e) => {
					addFirst(e);
				}}
			/>
			<input
				id={"lastName"}
				defaultValue={"Last"}
				onClick={(e) => {
					// const lastName = document.getElementById("lastName");
					clearLast(e);
				}}
			/>
			<button
				onClick={() => {
					const firstName = document.getElementById("firstName");
					const lastName = document.getElementById("lastName");
					navigate(`/search/${firstName.value}-${lastName.value}`);
				}}
			>
				Clicks: {clicks}
			</button>
		</div>
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

export const CharSearch = (firstName: string, lastName: string) => {
	const [chars, setChars] = useState([]);

	useEffect(() => {
		const getChars = async () => {
			//const usersRes = await axios.get("http://localhost:8080/users");
			const charsRes = await axios({
				method: "SEARCH",
				url: `http://localhost:8080/search/${firstName}-${lastName}`,
			});
			return charsRes.data;
		};

		getChars().then(setChars);
	}, []);

	return (
		<div>
			<h4>Characters:</h4>
			{chars ? (
				<ul>
					{chars.map((char: { id: number; desc: string }) => (
						<li key={char.id}>
							{" "}
							{char.desc} - {char.id}{" "}
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
};
