export type State = {
	currentProfile: ProfileType;
	likeHistory: Array<ProfileType>;
	passHistory: Array<ProfileType>;
};

export type ProfileType = {
	imgUri: string;
	thumbUri: string;
	name: string;
	id: number;
};

//character response from my api
export type Char = {
	id: number;
	created_at: Date;
	updated_at: Date;
	fName: string;
	lName: string;
	desc: string;
	hidden: boolean;
	featured: boolean;
};

//character response from lodestone
//there is a lot more than this and the response may change
//for now I'm just adding things here if I'm going to try to use them!
export type CharacterResponse = {
	Character: {
		Name: string;
		Nameday: string;
		Bio: string;
		Portrait: string;
		Avatar: string;
	};
};
