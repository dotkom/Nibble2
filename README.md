# Nibble 2

Application for buying foods &amp; drinks at the office


![Nibble shop](http://i.imgur.com/1ItEFrd.png "Main shop view")

## Requirements
- [Node.js >= 6](https://nodejs.org/en/)
- A server running the REST API [backend](https://github.com/dotKom/onlineweb4/tree/develop/apps/shop) (not needed for dummy testing)

## Setup
- Open a terminal
- Run `cd nibble2` (or where you cloned the repository to)
- Run `npm install`/`yarn` to install dependencies
- Copy and paste `constants.example.js` to `constants.js` and fill in fields in `app/src/common/constants.js`
- Run `npm run dev` to build and run a webpack development server
    (`webpack-dev-server`)
- The application will be hosted on port `8080` (`localhost:8080` if hosting on
    your own machine)

## Inserting a mock user 

_This is useful if you want to avoid having to scan a RFID tag when logging in. Here you will be logged into a test user by default upon opening the page._

Simply open up `app/src/components/App.jsx` and change the `this.state = {...}`
assignment to read as following:

```jsx
this.state = {
  user: new User(-1, 'Dev', 'User', 600),
  loginState: 1,
};
```

And at the top of the file, add:

```jsx
import { User } from 'services/user';
```

Be careful not to add this when committing! A good rule of thumb is to only `git
add` the files you want to submit, and not use `git add .`/`git commit -a`.
