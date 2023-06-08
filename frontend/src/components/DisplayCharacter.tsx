import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Char, CharacterResponse } from "@/PCPTypes.ts";
import portrait from "@images/portrait.jpg";
import avatar from "@images/avatar.jpg";
import axios from "axios";

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
