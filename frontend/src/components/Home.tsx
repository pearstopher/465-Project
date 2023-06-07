import React from "react";
import { FeaturedChars, SearchButton } from "@/components/Components.tsx";

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
