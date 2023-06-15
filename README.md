# Final Project

CS465P Full Stack Web Dev

Spring 2023

Christopher Snow

## Instructions

### Running the Program

1. Starting the production environment:
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

2. Starting the development environment:
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

### Additional Information

Additional information about my program can be found in both my journal and my 
Project Presentation.

1. [Journal `Final_Project_Journal_Snow.pdf`](Final_Project_Journal_Snow.pdf) 
2. [Presentation `https://youtu.be/4Bd1iFxa6Dk`](https://youtu.be/4Bd1iFxa6Dk)


### Cookies Note

Most of my testing has occurred using Chrome and I haven't had any issues with Auth0
there. However, after moving back to the virtual machine, I noticed that on Firefox
I sometimes get logged out of my website as the authentication cookies disappear any
time the session ends. This is because Auth0 uses third party cookies, and Firefox 
appears to now quarantine these cookies by default. If you are testing in Firefox 
and run into any issues staying logged in, you can go to Settings -> Cookies and 
enable third party cookies. 






    





