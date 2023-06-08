import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

//borrowed this function to get the cookie I set
// until I figure out where to put the useCookies to make it available everywhere
// https://stackoverflow.com/questions/51109559/get-cookie-with-react
//

export function getCookie(key) {
	const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
	return b ? b.pop() : "";
}

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
