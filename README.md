# Plinth
*noun* A heavy base supporting a statue or vase. The lower square slab at the base of a column.

This project is intended to provide a base starting point for a wide range of web application needs. The underlying concept is that a portion of many applications is identicle from application to application depending on the technology and hosting services being used. As such, this project's aim is to provide a strong starting point that includes much of that common code for specific technologies and services.

## Features ##
### API or Server-Side logic ###
`./api/*`

This provides a lightweight pattern on top of express for expressing routes associated with Controllers, interfacing with Entities, and interacting with a Data Access Layer.

Built in Database access (will) includes:
* MySQL
* Redis
* RethinkDB

Initial routes and controllers (will be) in place for `/user/` with methods for:
* Create, Read, and Update operations (update is limited to self).
* Password Reset
* Get Session
* Login
* Logout

An additional set of routes will be available that expresses socket based connections for a chat server.

### MySQL Database Project ###
This project will express a database project.

### Static File Server ###
This is intended only for local development, and should not be considered for production uses. 

### React Front-End ###
`./ui/*`

Being build ... .sad face :(

### Scss Front-End Framework ###
```
./ui/style/mixins/*
./ui/style/utils/*
```

This provides all the basic tooling for a standard grid system as well as some good ideas for code organization for rules that are commonly used together as in the case of complex typography.

### Server-Side Rendering with ejs ###
Intended to provide a way to serve complete views for rapid consumption on the client side when a Single Page Application is inappropriate for one reason or another. A good example of this is when SEO is highly important.

### Static Artifact Pipeline ###
Using a webpack process, this is designed to build out configured Single Page Applications as modules that can then be uploaded to a remote file hosting solution.

### Tests ###
All code provided in fully tested with unit tests, end-to-end tests, and code quality inspection.

* Mocha
* Newman
* Selenium

### Additional Tooling ###
* Swagger API documentation

* CircleCI build process with example static file deply
* Docker container build process with repo deploy
* Code Type specific code inspection

* Development only Hot Module swapping

What this does not include that I would have liked to get in is:

- [ ] UI using Redux
- [ ] UI using React-Router
- [x] Swagger Documentation engine
- [ ] Full unit tests
- [x] Newman Tests
- [ ] Docker config
- [ ] CI process
- [ ] MySQL Database project
- [ ] Redis Session storage
- [ ] RethinkDB connection
- [ ] Webpack Hot-reload
- [x] Static module generation
- [ ] Server rendered views
- [x] Newman Testing
- [x] Scss font and theme
- [ ] Scss grid
- [ ] Scss advanced calculation
- [ ] Scss animation tooling

### Local Run
`npm install` or `yarn install`

Then, after that is complete:

```
npm run build
npm start
```

Then navigate a web browser to `http://localhost:24601/`.

The incomplete set of unit tests can be run with `npm test`.
