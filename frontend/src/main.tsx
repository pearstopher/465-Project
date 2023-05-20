import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@css/index.css";
import { Auth0Provider } from "@auth0/auth0-react";

const rootContainer: HTMLElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootContainer).render(
	<React.StrictMode>
		<Auth0Provider
			domain="{yourDomain}"
			clientId="{yourClientId}"
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
		>
			<App />
		</Auth0Provider>
	</React.StrictMode>
);
