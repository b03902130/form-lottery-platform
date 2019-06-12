# Form Lottery Platform
Computer Network Lab Final Project

## Demo
0. `npm install`
1. `npm run build`
2. `npm run server`

## Develop at Localhost
0. `npm install`
1. `npm run debug`
    - Run up backend server with `--inpect`
2. `npm run start`
    - Run up frontend react server to enable responsive frontend development
    - With `window.BACKEND` varable in `src/index.js` correctly set, react can communicate with backend server


## Other Environments
#### Background Knowledge
- server will run on `HOST`:`BACKEND_PORT`
- react will run on `HOST`:`FRONTEND_PORT`

#### HOST
- modify HOST in .env
- modify the **host** part of window.BACKEND in src/index.js

#### BACKEND_PORT
- change PORT in package.json (script: server and debug)
- modify the **port** part of window.BACKEND in src/index.js

#### FRONTEND_PORT
- change PORT in package.json (script: start)
- modify FRONTEND_PORT in .env
