# Nibble 2

Application for buying foods &amp; drinks at the office


![Nibble shop](http://i.imgur.com/1ItEFrd.png "Main shop view")

## Requirements
- [Node.js >= 6](https://nodejs.org/en/)
- A server running the REST API [backend](https://github.com/dotKom/onlineweb4/tree/develop/apps/shop) (not needed for dummy testing)

## Setup
- Open a terminal
- Run `cd nibble2` (or where you cloned the repository to)
- Run `yarn` to install dependencies
- Copy and paste `constants.example.js` to `constants.js` and fill in fields in `app/src/common/constants.js`
- Run `yarn dev` to build and run a webpack development server
    (`webpack-dev-server`)
- The application will be hosted on port `8080` (`localhost:8080` if hosting on
    your own machine)

## Using a mock user for development

_This is useful if you want to avoid having to scan a RFID tag when logging in._

Open `constants.js` and make sure `MOCK` is set to `true`. Upon visiting the site now, all you have to do is hit `<Return>` to log in to the test user.
