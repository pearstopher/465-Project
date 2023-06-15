# Final Project

CS465P Full Stack Web Dev

Spring 2023

Christopher Snow

## Instructions

### Running the Program

1. Copying the program
    ```bash
    git clone git@github.com:pearstopher/465-Project.git
    cp frontend/.env.ts.example frontend/.env.ts
    cp backend/.env.example backend/.env
    ```
    Everything you need is in the .env.example files, no need to copy anything else.
    <br /><br />

2. Starting the production environment:
    ```bash
    docker compose up
    ```
    The production frontend will be located at http://localhost:88
    <br>
    This command starts the production backend and database as well.
    <br /><br />
    *Note: I added a command to seed the database into production. This
    shouldn't really be in production though, it's just there so that you can
    see a few example characters like you would in Dev.*
    <br /><br />

3. Starting the development environment:
    ```bash
    #frontend
    cd frontend && pnpm i && pnpm dev
  
    #backend
    cd ../backend && pnpm i && pnpm dev
    ```
   The development frontend will be located at http://localhost:5173

### Testing The Program

If you are going to test adding characters, here are some "random" character IDs 
that you can use:

1. `45484547` Everly After
2. `40593741` Cecilia Starbinder
3. `41939258` Hawk Estel

Or you can search for any character using the interface provided at
https://na.finalfantasyxiv.com/lodestone/character/ and grab the ID
from the character URL yourself.


### Authentication Notes *(Important!)*

#### Cookies
Most of my testing has occurred using Chrome and I haven't had any issues with Auth0
there. However, after moving back to the virtual machine, I noticed that on Firefox
even when I get logged in successfully, sometimes get logged out of my website when
I refresh the page. What is happening is that the authentication cookies disappear any
time the session ends. This is because Auth0 uses third party cookies, and Firefox 
appears to disallow third-party cookies by default. If you are testing in Firefox 
and run into any issues staying logged in, you can go to Settings -> Cookies and 
enable third party cookies. 

#### Popup

After authenticating with Auth0 on the frontend, the way to get the user's Access
Token is normally to call the function [getAccessTokenSilently()](https://auth0.github.io/auth0-react/interfaces/Auth0ContextInterface.html#getAccessTokenSilently)
which returns the user's access token. However this function specifically does not
work on localhost because that is not a trusted domain. If you try to use it on
localhost anyways, you just get an error saying that you must use the alternative
function [getAccessTokenWithPopup()](https://auth0.github.io/auth0-react/interfaces/Auth0ContextInterface.html#getAccessTokenWithPopup)
instead. So that is the function I am using since my site is running on localhost!
The annoying part about this function is that in order to get the token, the
page has to open a popup. So you will likely also have to enable popups in your 
browser as well or else the authentiation process will not be able to complete.
Thankfully this wouldn't be an issue on a live site!


### Additional Information

Additional information about my program can be found in both my journal and my
Project Presentation.

1. [Journal `Final_Project_Journal_Snow.pdf`](Final_Project_Journal_Snow.pdf)

2. [Presentation `https://youtu.be/4Bd1iFxa6Dk`](https://youtu.be/4Bd1iFxa6Dk)







    





