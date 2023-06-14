import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "@/components/AuthCallback.tsx";
import { useNavigate } from "react-router-dom";
import { Char } from "@/PCPTypes.ts";
import avatar from "@images/avatar.jpg";
import { Link } from "@/components/Components.tsx";

export const CreateOrUpdateChar = () => {
	const [hasChar, setHasChar] = useState([]);

	const [hasCharMessage, setHasCharMessage] = useState("Checking if you have a character...");

	useEffect(() => {
		const getHasChar = async () => {
			try {
				const charRes = await axios.get(`http://localhost:8080/hasCharacters`, {
					headers: {
						Authorization: `Bearer ${getCookie("access_token")}`,
					},
				});
				// console.log(charRes.data);
				if (charRes.data.exists) {
					setHasCharMessage(`You have a character.`);
				} else {
					setHasCharMessage(`You do not have a character.`);
				}
				//return the character IDS if it exists or empty array if it does not
				return charRes.data.exists ? charRes.data.ids : [];
			} catch (e) {
				setHasCharMessage(`Error determining if character exists. Error message: ${e.message}.`);
				console.log(e);
				return e;
			}
		};
		getHasChar().then(setHasChar);
	}, []);

	return (
		<>
			<div>{hasCharMessage}</div>
			{hasChar.length !== 0 ? (
				<>
					<h4>Update Character</h4>

					{hasChar.map((char: { id: number }) => (
						<UpdateChar key={char.id} id={char.id} />
					))}
				</>
			) : (
				<>
					<h4>Create New Character</h4>
					<AddChar />
				</>
			)}
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
				hidden: updateCharHidden,
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
				//console.log(usersRes.data);
				setUpdateCharDesc(usersRes.data.desc);
				setUpdateCharHidden(usersRes.data.hidden);
				setUpdateCharMessage(`Character Information Received Successfully`);
				return usersRes.data;
			} catch (e) {
				setUpdateCharMessage(
					`Error Retrieving Character Information. Error message: ${e.message}.`
				);
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
					defaultValue={
						//@ts-ignore
						updateCharInfo.fName
					}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setFormSubmit(true);
							formSubmitFn();
						}
					}}
				/>
				<label htmlFor={"updateCharFirstName"} className={"hidden"}>
					{
						//@ts-ignore
						updateCharInfo.fName
					}
				</label>

				<input
					type={"text"}
					id={"updateCharLastName"}
					//@ts-ignore
					defaultValue={updateCharInfo.lName}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setFormSubmit(true);
							formSubmitFn();
						}
					}}
				/>
				<label htmlFor={"updateCharLastName"} className={"hidden"}>
					{
						//@ts-ignore
						updateCharInfo.lName
					}
				</label>

				<textarea
					id={"updateCharDesc"}
					defaultValue={updateCharDesc}
					onChange={(e) => {
						setUpdateCharDesc(e.target.value);
					}}
				/>
				<label htmlFor={"addCharDesc"} className={"hidden"}>
					{
						//@ts-ignore
						updateCharInfo.desc
					}
				</label>

				<input
					type={"checkbox"}
					id={"updateCharHidden"}
					checked={!updateCharHidden}
					onChange={(e) => {
						setUpdateCharHidden(!e.target.checked);
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
