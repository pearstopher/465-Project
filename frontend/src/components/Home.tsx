import React from "react";
import { FeaturedChars } from "@/components/Components.tsx";
import { SearchButton } from "@/components/Search.tsx";

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
