# JUNELIFE Project (Competition project. No refactoring)

### server require modules install

    ## install to modules
    npm install
    npm install request-ip
    npm install ejs

### DB schema and connection fix

    ### database dir change
    cd server/databse
    ### file description
    Is connect.js <- mongoDB connection file
    IS schema.js <- mongoDB database schema file

### router description

1. login/singup router

- /user/login
- /user/singup

2. recipe router

- /recipe/diet <- recipe Step setting router
- /recipe <- recipe page router

### Start to server.js (nodemon)

    cd server

    npm i -D nodemon

    nodemon server

    ## success compile message
    server start success PORT : 8000
    database connecting successed

### start to server.js (node)

    cd server

    node server.js

    ## success compile message
    server start success PORT : 8000
    database connecting successed
