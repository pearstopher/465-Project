import { useEffect, useState } from "react";
import axios from "axios";
import { getRandomProfile } from "@/InitialState.ts";
import { useParams, useNavigate } from "react-router-dom";
import { CharacterResponse } from "@/PCPTypes.ts";

export const Match = () => {
	return <div>"MATCH PAGE"</div>;
};

export const Home = () => {
	return (
		<section>
			<h3>Welcome</h3>
			<p>
				Welcome to Pears' Character Profiles. You can use this site to browse the characters I have
				created so far, and to create your own!
			</p>

			<SearchButton />

			<FeaturedChars />
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

export const Character = () => {
	const { idParam } = useParams();
	let id = parseInt(idParam);
	if (isNaN(id)) {
		id = 0;
	}

	const [charId, setCharId] = useState(id);
	const temp: CharacterResponse = {
		Character: {
			Name: "No Name",
			Nameday: "No Nameday",
			Portrait: "default image",
			Avatar: "default image",
		},
	};
	const [charInfo, setCharInfo] = useState(temp);

	useEffect(() => {
		const getCharInfo = async () => {
			const usersRes = await axios.get<CharacterResponse>(`https://xivapi.com/character/${charId}`);
			return usersRes.data;
		};

		getCharInfo().then(setCharInfo);
	}, [charId]);

	return (
		<div>
			<h3>Character Info: </h3>
			<h4>Name</h4>
			<p>{charInfo.Character.Name}</p>
			<h4>Birthday</h4>
			<p>{charInfo.Character.Nameday}</p>
			<h4>Portrait</h4>
			<img
				src={charInfo.Character.Portrait}
				alt={`Character Portrait of ${charInfo.Character.Name} from The Lodestone`}
			/>
			<p>Avatar</p>
			<img
				src={charInfo.Character.Avatar}
				alt={`Character Avatar of ${charInfo.Character.Name} from The Lodestone`}
			/>
			{
				// can look at the whole response if anything goes wrong
				//<code>{JSON.stringify(charInfo)}</code>
			}
		</div>
	);
};

export const NameSearch = () => {
	const { fullNameWithDash } = useParams();

	const extractName = (
		fullNameWithDash
	): { firstName: string; lastName: string; fullName: string } => {
		// extract the name from the url
		const fullNameArr = fullNameWithDash.split("-");

		const firstName = fullNameArr[0];
		const lastName = fullNameArr[1];

		const fullName =
			firstName.charAt(0).toUpperCase() +
			firstName.slice(1) +
			" " +
			lastName.charAt(0).toUpperCase() +
			lastName.slice(1);

		return { firstName: firstName, lastName: lastName, fullName: fullName };
	};

	const name = extractName(fullNameWithDash);

	const [fNameParam, setFNameParam] = useState(name.firstName);
	const [lNameParam, setLNameParam] = useState(name.lastName);
	const [fullNameParam, setFullNameParam] = useState(name.fullName);

	useEffect(() => {
		const name = extractName(fullNameWithDash);

		setFNameParam(name.firstName);
		setLNameParam(name.lastName);
		setFullNameParam(name.fullName);
	}, [fullNameWithDash]);

	return (
		<section>
			<SearchButton />

			<h3>Search results for {fullNameParam}:</h3>

			<CharSearch fName={fNameParam} lName={lNameParam} />
		</section>
	);
};

export function Title() {
	return <h1>Pears' Character Profiles</h1>;
}

export function Subtitle() {
	return <h2>By Pearstopher</h2>;
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
	const firstVal = "First";
	const lastVal = "Last";
	const [fName, setFName] = useState(firstVal);
	const [lName, setLName] = useState(lastVal);
	const [clicks, setClicks] = useState(0);

	const navigate = useNavigate();

	const clearFirst = (e) => {
		const val = e.target.value;
		const defaultVal = e.target.defaultValue;
		if (val === defaultVal) {
			e.target.value = "";
			if (defaultVal === firstVal) {
				setFName(defaultVal);
			} else {
				setLName(defaultVal);
			}
		}
	};

	const addFirst = (e) => {
		let val = e.target.value;
		const defaultVal = e.target.defaultValue;
		if (val === "") {
			val = defaultVal;
			e.target.value = defaultVal;
			e.target.setSelectionRange(0, 0);
		}
		if (fName === defaultVal || lName === defaultVal) {
			if (e.target.selectionStart === 1) {
				val = val.substring(0, 1);
				e.target.value = val;
			}
		}

		if (defaultVal === firstVal) {
			setFName(val);
		} else {
			setLName(val);
		}
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
			<h4>Character Search</h4>
			<input
				id={"firstName"}
				defaultValue={firstVal}
				onClick={(e) => {
					// const firstName = document.getElementById("firstName");
					clearFirst(e);
				}}
				onChange={(e) => {
					addFirst(e);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						navigate(`/search/${fName}-${lName}`);
					}
				}}
			/>
			<input
				id={"lastName"}
				defaultValue={lastVal}
				onClick={(e) => {
					// const lastName = document.getElementById("lastName");
					clearFirst(e);
				}}
				onChange={(e) => {
					addFirst(e);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						navigate(`/search/${fName}-${lName}`);
					}
				}}
			/>
			<button
				onClick={() => {
					//const firstName = document.getElementById("firstName");
					//const lastName = document.getElementById("lastName");
					//navigate(`/search/${firstName.value}-${lastName.value}`);
					navigate(`/search/${fName}-${lName}`);
				}}
			>
				Search
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

export const CharSearch = (props) => {
	const [chars, setChars] = useState([]);

	useEffect(() => {
		const getChars = async () => {
			//const usersRes = await axios.get("http://localhost:8080/users");
			const charsRes = await axios({
				method: "SEARCH",
				url: `http://localhost:8080/search/${props.fName}-${props.lName}`,
			});
			return charsRes.data;
		};

		getChars().then(setChars);
	}, [props.fName, props.lName]);

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
		<div>
			<h4>Featured Characters:</h4>
			{featuredChars ? (
				<ul>
					{featuredChars.map((char: { id: number; desc: string }) => (
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
