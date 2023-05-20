import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@css/index.css";
import { Auth0Provider } from "@auth0/auth0-react";

const rootContainer: HTMLElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootContainer).render(
	<React.StrictMode>
		<Auth0Provider
			domain="dev-lnl6xq2bi1qytw01.us.auth0.com"
			clientId="3b6XUUqEZ5izxZXoRSr4AWdWDR8X3XDB"
			authorizationParams={{
				redirect_uri: window.location.origin + "/callback",
				//audience: "https://dev-lnl6xq2bi1qytw01.us.auth0.com/api/v2/",
				//audience: "http://localhost:8080",
				//scope: "profile read:current_user update:current_user_metadata",
			}}
		>
			<App />
		</Auth0Provider>
	</React.StrictMode>
);
