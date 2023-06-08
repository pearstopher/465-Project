import React from "react";

export function Title() {
	return <h1>Pears' Character Profiles</h1>;
}
export function Subtitle() {
	return <h2>By Pearstopher</h2>;
}

//Given an ID and a name, generate a link to a character page
export const Link = (props) => {
	const id = props.id;
	const name = props.name;
	return <a href={`/character/${id}`}>{name}</a>;
};
