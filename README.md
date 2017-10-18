# Nibble 2
App for buying foods &amp; drinks at the office (Windows Edition)
![Nibble shop](http://i.imgur.com/1ItEFrd.png "Main shop view")

## Requirements
- [Node 6](https://nodejs.org/en/)
- A server running the REST API [backend](https://github.com/dotKom/onlineweb4/tree/develop/apps/shop) (not needed for dummy testing)
- The `Nibble2` folder placed in documents.

## Setup
- start bash or cmd and cd to nibble2
- run: `npm install`
- copy and paste constants.example.js to constants.js and fill in fields in app/src/common/constants.js
- run: `npm run start` to build and run webpack webserver and start Electron.
- App is hosted on port 8080, and a Electron window opens.

## Make Nibble start on boot

- create a shortcut to `startNibble.bat` and put it in the `C:\Users\[YOUR_USERNAME]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` folder.