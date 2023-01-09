# Project 2
Project Link: https://cocktail-api-project2.herokuapp.com/ 

## Installation Instructions
* To use this project locally, fork and clone this repository. 
* Next, in your terminal, go to the locally-cloned repository and run `npm init -y` 
* Open the repo and navigate to `package.json` file and see a list of npm packages listed under `dependencies`
* Run `npm i` in the terminal to download all the required npm packages. `node_modules` should appear in the folder
* Check to see if `node_modules` and `.env` are in the `.gitignore` file before committing to the remote repository. If not, run the commands `echo node_modules >> .gitignore` and `echo .env >> .gitignore` 
* Then go to https://api-ninjas.com/ and sign up for an account. Afterwards, go to `My Account`, copy the API key, then create a variable called `API_KEY` in the `.env` and paste the API key there. Example: `API_KEY='[API key is pasted here, do not include the square brackets]'`
* Run the following commands: `sequelize db:create` then `sequelize db:migrate`
* To view the databases, run `psql` in your terminal
* Then run `nodemon` in your terminal and type in localhost:8000 in your browser


## Project description 
Tired of spending too much money at the bar? Want to save some money and potentially pick up bartending as a hobby? With this new app, you can! This app displays recipes for different cocktails and allows you to favorite cocktails you like. 

## Tech Stack:
* HTML
* Bootstrap
* CSS
* Javascript
* Axios
* Cookie Parser
* Crypto-JS
* Dotenv
* Express
* EJS
* Postgres
* Sequelize

## API 
I will be using this API https://api-ninjas.com/api/cocktail 

Sample implementation:
const url = 'https://api.api-ninjas.com/v1/cocktail?name=mezcal+mule' <br>
const config = { headers: { X-Api-Key: API_KEY}}

axios.get(url, config)

## ERDS
<img src='./imgs/ERD.png'>

## Restful Routing Chart
<img src='./imgs/restfulroutes.png'>

## Wireframes
<img src='./imgs/Home-page.png'>
<img src='./imgs/favorites.png'>

## Example Pull Request 
<img src='./imgs/example-pull.png'>

## User Stories
As a user, I want to be able to:
* view the user profile
* create a new profile
* add cocktail recipes to a favorites page
* add comments 


## MVP Goals
* Render a home page with functioning search bar/option that pulls from an API database and displays the search results 
* Render a favorites page with favorited cocktails by the user, with the option to delete from the favorites page
* Render a sign up page where new users can create new profiles
* Render a comment section 

## Stretch Goals
* Use CSS properties to make the app look more visually appealing 
* render results to a results page instead of on the home page
* add an ability for logged in users to edit and customize the recipes they favorite and only after the users favorite the recipe
* add ability to edit or delete comments 

## Approach Taken 

## Post-Project Reflections
