import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "@/components/Components.tsx";
import axios from "axios";
import avatar from "@images/avatar.jpg";

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
