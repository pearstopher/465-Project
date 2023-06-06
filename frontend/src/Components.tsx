import { useEffect, useState } from "react";
import axios from "axios";
import { getRandomProfile } from "@/InitialState.ts";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Char, CharacterResponse } from "@/PCPTypes.ts";
import avatar from "@images/avatar.jpg";
import portrait from "@images/portrait.jpg";
import { useCookies } from "react-cookie";

// login and logout buttons
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

//borrowed this function to get the cookie I set
// until I figure out where to put the useCookies to make it available everywhere
// https://stackoverflow.com/questions/51109559/get-cookie-with-react
//
function getCookie(key) {
	const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
	return b ? b.pop() : "";
}

export const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();

	return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export const LogoutButton = () => {
	const { logout } = useAuth0();

	return (
		<button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
			Log Out
		</button>
	);
};

// export const SampleProfile = () => {
// 	const { user, isAuthenticated, isLoading } = useAuth0();
//
// 	if (isLoading) {
// 		return <div>Loading ...</div>;
// 	}
//
// 	return (
// 		isAuthenticated && (
// 			<div>
// 				<img src={user.picture} alt={user.name} />
// 				<h2>{user.name}</h2>
// 				<p>{user.email}</p>
// 				<code>{JSON.stringify(user)}</code>
// 			</div>
// 		)
// 	);
// };

export const SampleProfile = () => {
	const { user, isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
	const [userMetadata, setUserMetadata] = useState(null);

	useEffect(() => {
		const getUserMetadata = async () => {
			const domain = "localhost:8080";

			try {
				const accessToken = await getAccessTokenWithPopup({
					authorizationParams: {
						audience: `http://${domain}`,
						scope: "read:current_user",
					},
				});
				console.log(accessToken);

				const userDetailsByIdUrl = `http://${domain}/api/v2/users/${user.sub}`;

				const metadataResponse = await fetch(userDetailsByIdUrl, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				const { user_metadata } = await metadataResponse.json();

				//setUserMetadata(user_metadata);
				return user_metadata;
			} catch (e) {
				console.log(e.message);
			}
		};

		//getUserMetadata().then(setUserMetadata);
	}, [getAccessTokenSilently, user?.sub]);

	return (
		isAuthenticated && (
			<div>
				<img src={user.picture} alt={user.name} />
				<h2>{user.name}</h2>
				<p>{user.email}</p>
				<h3>User Metadata</h3>
				{userMetadata ? (
					<pre>{JSON.stringify(userMetadata, null, 2)}</pre>
				) : (
					"No user metadata defined"
				)}
				<code>{JSON.stringify(user)}</code>
			</div>
		)
	);
};

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

export const Callback = () => {
	//const { hash } = useLocation();
	//const token = hash.substring(hash.indexOf("#access_token=") + 14, hash.indexOf("&"));
	const { user, isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
	const [userMetadata, setUserMetadata] = useState(null);
	const [token, setToken] = useState("");
	const [cookie, setCookie] = useCookies(["access_token"]);
	const domain = "localhost:8080";

	useEffect(() => {
		const getToken = async () => {
			try {
				//"getAccessTokenSilently"
				// The documentation said to use this, but when I tried, I get a warning that it doesn't work
				// when the domain is localhost. Since my domain is localhost, I had to replace it with this
				// alternative function.
				//
				//"getAccessTokenWithPopup"
				// This one works great! The only problem is there is an annoying popup. But once you deal with
				// the popup you get the token and everything works great. So right now I am just using this on
				// the callback page to get the token. If I were to move this to a real domain I assume that the
				// silent function would work to get me the token just like the documentation says. Anyway, that's
				// why the callback page has an annoying popup.
				const accessToken = await getAccessTokenWithPopup({
					authorizationParams: {
						audience: `http://${domain}`,
						scope: "read:current_user",
					},
				});
				console.log(accessToken);
				//this isn't important yet all I need is some date in the future
				const expires = new Date();
				expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); //a week
				setCookie("access_token", accessToken, { path: "/", expires });
				return accessToken;
			} catch (e) {
				console.log(e.message);
			}
		};

		getToken().then(setToken);
	}, [getAccessTokenSilently, user?.sub]);

	return (
		<>
			{/*<section>*/}
			{/*	<code> {token} </code>*/}
			{/*</section>*/}

			{/*<section>*/}
			{/*	<code> {getCookie("access_token")}</code>*/}
			{/*</section>*/}
			<section>
				Welcome, {user?.nickname}! You have successfully logged in.
				{domain.includes("localhost") ? (
					<>
						{" "}
						<p>
							<b>
								We are on localhost, so please use the popup to complete getting the token.
								Otherwise you won't be able to access the protected backend API. Make sure you see a
								token below.
							</b>
						</p>
						<p>{getCookie("access_token")}</p>
					</>
				) : null}
			</section>
		</>
	);
};

export const RandomProfile = () => {
	return (
		<div>
			<Image />
		</div>
	);
};

export const MyProfile = () => {
	return (
		<>
			<section>
				<h3>My Info</h3>
				<SampleProfile />
			</section>
			<section>
				<h3>My Character Profile</h3>

				<h3>Do I have a character?</h3>
				<HasChar />

				<h4>Create New Character</h4>
				<AddChar />

				<h4>Update Character</h4>
				<UpdateChar id={45151669} />
			</section>
		</>
	);
};

export const AddChar = () => {
	const firstVal = "First Name";
	const lastVal = "Last Name";
	const idVal = "Lodestone ID";
	const descVal = "Character Description";
	const hiddenVal = true;
	const [fName, setFName] = useState(firstVal);
	const [lName, setLName] = useState(lastVal);
	const [id, setId] = useState(idVal);
	const [desc, setDesc] = useState(descVal);
	const [hidden, setHidden] = useState(hiddenVal);

	const [clicks, setClicks] = useState(0);
	const [newCharInfo, setNewCharInfo] = useState([]);
	const [formSubmit, setFormSubmit] = useState(false);
	const [addCharMessage, setAddCharMessage] = useState(
		"Success / error messages will appear here."
	);

	const navigate = useNavigate();

	const clearFirst = (e) => {
		const val = e.target.value;
		const defaultVal = e.target.defaultValue;
		if (val === defaultVal) {
			e.target.value = "";
			if (defaultVal === firstVal) {
				setFName(defaultVal);
			} else if (defaultVal === lastVal) {
				setLName(defaultVal);
			} else if (defaultVal === idVal) {
				setId(defaultVal);
			} else if (defaultVal === descVal) {
				setDesc(defaultVal);
			} else if (defaultVal === hiddenVal) {
				setHidden(defaultVal);
			}
		}
	};

	const addFirst = (e) => {
		// get the default values with an exception for the checkbox (true/false but still has a DUMB value of "on")
		console.log(e.target.type);
		let val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		const defaultVal =
			e.target.type === "checkbox" ? e.target.defaultChecked : e.target.defaultValue;
		if (val === "") {
			val = defaultVal;
			e.target.value = defaultVal;
			e.target.setSelectionRange(0, 0);
		}
		if (
			fName === defaultVal ||
			lName === defaultVal ||
			id === defaultVal ||
			desc === defaultVal ||
			hidden === defaultVal
		) {
			if (e.target.selectionStart === 1) {
				val = val.substring(0, 1);
				e.target.value = val;
			}
		}

		//figure out which element we're in so I know which one to update the state of
		if (defaultVal === firstVal) {
			setFName(val);
		} else if (defaultVal === lastVal) {
			setLName(val);
		} else if (defaultVal === idVal) {
			setId(val);
		} else if (defaultVal === descVal) {
			setDesc(val);
		} else if (defaultVal === hiddenVal) {
			setHidden(val);
		}
	};

	useEffect(() => {}, [formSubmit]);

	const formSubmitFn = () => {
		const getNewCharInfo = async () => {
			// request expects:
			// const { id, fName, lName, desc, hidden } = req.body;
			const postVars = {
				id: parseInt(id),
				fName: fName,
				lName: lName,
				desc: desc,
				hidden: !hidden, //whoops this is backwards
			};
			try {
				const usersRes = await axios.post(`http://localhost:8080/character`, postVars, {
					headers: {
						Authorization: `Bearer ${getCookie("access_token")}`,
					},
				});
				console.log(usersRes.data);
				setAddCharMessage(`Character created successfully.`);
				//could navigate to the next page on success, but I don't know what the routes will be with auth
				//navigate("/myProfile");
				return usersRes.data; // why are we returning stuff just do discard it tho?
			} catch (e) {
				setAddCharMessage(
					`Error Creating Character. Error message: ${e.message}. Response: ${e.response.data.message}`
				);
				//${JSON.stringify(
				// 						postVars
				// 					)}
				console.log(e);
				return e;
			}
		};

		// this function is async and return is discarded
		// can't do anything "after" it do it in the function above
		getNewCharInfo().then(setNewCharInfo);
	};

	return (
		<div id={"addCharWrap"}>
			<h5>Enter your character information below:</h5>

			<div id={"addCharForm"}>
				<input
					type={"text"}
					id={"addCharFirstName"}
					defaultValue={firstVal}
					onClick={(e) => {
						clearFirst(e);
					}}
					onChange={(e) => {
						addFirst(e);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setFormSubmit(true);
							formSubmitFn();
						}
					}}
				/>
				<label htmlFor={"addCharFirstName"} className={"hidden"}>
					{firstVal}
				</label>

				<input
					type={"text"}
					id={"addCharLastName"}
					defaultValue={lastVal}
					onClick={(e) => {
						clearFirst(e);
					}}
					onChange={(e) => {
						addFirst(e);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setFormSubmit(true);
							formSubmitFn();
						}
					}}
				/>
				<label htmlFor={"addCharLastName"} className={"hidden"}>
					{lastVal}
				</label>

				<input
					type={"text"}
					id={"addCharID"}
					defaultValue={idVal}
					onClick={(e) => {
						clearFirst(e);
					}}
					onChange={(e) => {
						addFirst(e);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setFormSubmit(true);
							formSubmitFn();
						}
					}}
				/>
				<label htmlFor={"addCharID"} className={"hidden"}>
					{idVal}
				</label>

				<textarea
					id={"addCharDesc"}
					defaultValue={descVal}
					onClick={(e) => {
						clearFirst(e);
					}}
					onChange={(e) => {
						addFirst(e);
					}}
					//it would suck if you couldn't press Enter in a textarea tho
					/*onKeyDown={(e) => {
						if (e.key === "Enter") {
							setFormSubmit(true);
							formSubmitFn();
						}
					}}*/
				/>
				<label htmlFor={"addCharDesc"} className={"hidden"}>
					{descVal}
				</label>

				<input
					type={"checkbox"}
					id={"addCharHidden"}
					defaultChecked={hiddenVal}
					onChange={(e) => {
						addFirst(e);
					}}
				/>
				<label htmlFor={"addCharHidden"}>Allow users to search for my character by name?</label>

				<button
					className={"submit"}
					id={"addCharSubmit"}
					onClick={() => {
						setFormSubmit(true);
						formSubmitFn();
					}}
				>
					Create Character
				</button>
				<p id={"addCharInfo"}>{addCharMessage}</p>
			</div>
		</div>
	);
};

export const UpdateChar = (props) => {
	const tempChar: Char = {
		id: 0,
		created_at: "",
		updated_at: "",
		fName: "First",
		lName: "Last",
		desc: "Description",
		hidden: true,
		featured: false,
	};
	const [updateCharInfo, setUpdateCharInfo] = useState([]);
	const [updateCharDesc, setUpdateCharDesc] = useState("");
	const [updateCharHidden, setUpdateCharHidden] = useState(true); //negated later
	// won't update as tempchar even though ti does in Character function. I can't explain it so I just take the errors for now
	const [formSubmit, setFormSubmit] = useState(false);
	const [updateCharMessage, setUpdateCharMessage] = useState(
		"Success / error messages will appear here."
	);

	const formSubmitFn = () => {
		const putUpdateCharInfo = async () => {
			// request expects:
			// const { id, fName, lName, desc, hidden } = req.body;
			const postVars = {
				id: props.id,
				// fName: fName,
				// lName: lName, //can't update name right now (your name shouldn't change!?)
				desc: updateCharDesc,
				hidden: !updateCharHidden,
			};
			try {
				const usersRes = await axios.put(`http://localhost:8080/character`, postVars);
				console.log(usersRes.data);
				setUpdateCharMessage(`Character updated successfully.`);
				return usersRes.data;
			} catch (e) {
				setUpdateCharMessage(
					`Error Creating Character. Error message: ${e.message}. Response: ${JSON.stringify(
						postVars
					)}`
				);
				console.log(e);
				return e;
			}
		};

		// this function is async and return is discarded
		// can't do anything "after" it do it in the function above
		// getNewCharInfo().then(setNewCharInfo);
		putUpdateCharInfo();
	};

	useEffect(() => {
		const getUpdateCharInfo = async () => {
			try {
				const usersRes = await axios.get<Char>(`http://localhost:8080/character/${props.id}`);
				console.log(usersRes.data);
				setUpdateCharDesc(usersRes.data.desc);
				setUpdateCharHidden(usersRes.data.hidden);
				setUpdateCharMessage(`Character Information Received Successfully`);
				return usersRes.data;
			} catch (e) {
				setUpdateCharMessage(`Error Creating Character. Error message: ${e.message}.`);
				console.log(e);
				return e;
			}
		};
		getUpdateCharInfo().then(setUpdateCharInfo);
	}, []);

	return (
		<div id={"updateCharWrap"}>
			<h5>Enter your character information below:</h5>

			<div id={"updateCharForm"}>
				<input
					type={"text"}
					id={"updateCharFirstName"}
					defaultValue={updateCharInfo.fName}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setFormSubmit(true);
							formSubmitFn();
						}
					}}
				/>
				<label htmlFor={"updateCharFirstName"} className={"hidden"}>
					{updateCharInfo.fName}
				</label>

				<input
					type={"text"}
					id={"updateCharLastName"}
					defaultValue={updateCharInfo.lName}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setFormSubmit(true);
							formSubmitFn();
						}
					}}
				/>
				<label htmlFor={"updateCharLastName"} className={"hidden"}>
					{updateCharInfo.lName}
				</label>

				<textarea
					id={"updateCharDesc"}
					defaultValue={updateCharDesc}
					onChange={(e) => {
						setUpdateCharDesc(e.target.value);
					}}
				/>
				<label htmlFor={"addCharDesc"} className={"hidden"}>
					{updateCharInfo.desc}
				</label>

				<input
					type={"checkbox"}
					id={"updateCharHidden"}
					defaultChecked={!updateCharHidden}
					onChange={(e) => {
						setUpdateCharHidden(e.target.checked);
					}}
				/>
				<label htmlFor={"addCharHidden"}>Allow users to search for my character by name?</label>

				<button
					className={"submit"}
					id={"updateCharSubmit"}
					onClick={() => {
						setFormSubmit(true);
						formSubmitFn();
					}}
				>
					Update Character
				</button>
				<p id={"updateCharInfo"}>{updateCharMessage}</p>
			</div>
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
	const tempCharResponse: CharacterResponse = {
		Character: {
			Name: "No Character",
			Nameday: "No Nameday",
			Bio: "No Bio",
			Portrait: portrait,
			Avatar: avatar,
		},
	};
	const tempChar: Char = {
		id: 0,
		created_at: "",
		updated_at: "",
		fName: "First",
		lName: "Last",
		desc: "Description",
		hidden: true,
		featured: false,
	};
	const [charInfo, setCharInfo] = useState(tempChar);
	const [charInfoFromLodestone, setCharInfoFromLodestone] = useState(tempCharResponse);

	useEffect(() => {
		const getCharInfoFromLodestone = async () => {
			const usersRes = await axios.get<CharacterResponse>(`https://xivapi.com/character/${charId}`);
			return usersRes.data;
		};
		getCharInfoFromLodestone().then(setCharInfoFromLodestone);

		const getCharInfo = async () => {
			//this is the first time I've seen used the two links together!
			//I wasn't copying them but it's great we both chose /character/id
			//I mean it makes sense! I built mine first tho!
			const usersRes = await axios.get<Char>(`http://localhost:8080/character/${charId}`);
			return usersRes.data;
		};
		getCharInfo().then(setCharInfo);
	}, [charId]);

	return (
		<section>
			<h3>Character Info: </h3>
			<h4>Name</h4>
			<p>{charInfoFromLodestone.Character.Name}</p>
			<h4>Birthday</h4>
			<p>{charInfoFromLodestone.Character.Nameday}</p>
			{
				//<h4>Bio</h4>
				//<p>{charInfoFromLodestone.Character.Bio}</p>
				//in-game short bio
			}
			<h4>Bio</h4>
			<p>{charInfo.desc}</p>

			<h4>Portrait</h4>
			<img
				src={charInfoFromLodestone.Character.Portrait}
				alt={`Character Portrait of ${charInfoFromLodestone.Character.Name} from The Lodestone`}
			/>
			<p>Avatar</p>
			<img
				src={charInfoFromLodestone.Character.Avatar}
				alt={`Character Avatar of ${charInfoFromLodestone.Character.Name} from The Lodestone`}
			/>
			{
				// can look at the whole response if anything goes wrong
				//<code>{JSON.stringify(charInfo)}</code>
			}
		</section>
	);
};

export const NameSearch = () => {
	const { fullNameWithDash } = useParams();

	const extractName = (
		fullNameWithDash
	): { firstName: string; lastName: string; fullName: string } => {
		if (!fullNameWithDash) {
			return { firstName: "", lastName: "", fullName: "" };
		}
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
				type={"text"}
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
				type={"text"}
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
				className={"submit"}
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
		<div id={"searchResults"}>
			<h4>Characters:</h4>
			{chars ? (
				<ul>
					{chars.map((char: { id: number; fName: string; lName: string; avatar: string }) => (
						<li key={char.id}>
							<img
								src={char.avatar ? char.avatar : avatar}
								alt={"Avatar image of character's face."}
							/>
							<Link id={char.id} name={`${char.fName} ${char.lName}`} />
							<div id={"id"}>{`ID: ${char.id}`}</div>
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
