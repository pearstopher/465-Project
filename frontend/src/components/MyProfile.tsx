import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { CreateOrUpdateChar } from "@/components/CreateOrUpdateChar.tsx";

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
				<CreateOrUpdateChar />
			</section>
		</>
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
