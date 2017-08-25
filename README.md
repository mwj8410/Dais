# Plinth [![CircleCI](https://circleci.com/gh/mwj8410/Plinth/tree/development.svg?style=svg)](https://circleci.com/gh/mwj8410/Plinth/tree/development) ![Dependencies](https://david-dm.org/mwj8410/Plinth.svg)
*noun* A heavy base supporting a statue or vase. The lower square slab at the base of a column.

This project is intended to provide a basis for rapid web-service development. The underlying concept is that a portion of web-service is solving identical problems as any other web service. This is the basic reasoning behind framework offering within the web-service technology space. Those frameworks, however, do not evolve along with the solutions that utilize them, and thus, end up getting in the way of problem solving.

This project is intended to provide a base starting point for a wide range of web application needs. The underlying concept is that a portion of many applications is identical from application to application depending on the technology and hosting services being used. As such, this project's aim is to provide a strong starting point that includes much of that common code for specific technologies and services.

Very little of this project is developed within the context of this project. As other efforts utilize technology in a powerful, widely applicable, way that code is then translated into this project to ease future development with similar requirements and expectations.

It is assumed that any project using this code as a seed project will remove or refactor large sections that don't make sense for that project's needs. 

## Getting Started ##

1. Clone this repo into the folder where you wish to begin developing.
2. Then delete the `.git` folder.
3. `git init`
4. Edit `package.json`, each file in `./config/`, and this file to remove all `Plinth` identification.
5. Joy.

## Concepts ##
### Data Sources ###
At first glance, and perhaps for a while, this may seem synonymous with a database. The scope of this project does not permit a full demonstration of the difference, but leveraging this concept can greatly simplify some projects.
 
First, don't think of a database as a database. Instead, think of it as a data source.

ToDo: Complete this section

### Configuration ###


## Features ##
### API or Server-Side logic ###
`./api/*`

This provides a lightweight pattern on top of express for expressing routes associated with Controllers, interfacing with Entities, and interacting with a Data Access Layer.

Built in Database access (will) includes:
* Redis
* MongoDB

Initial routes and controllers (will be) in place for `/user/` with methods for:
* Create, Read, and Update operations (update is limited to self).
* Password Reset
* Get Session
* Login
* Logout

An additional set of routes will be available that expresses socket based connections for a chat server.

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

- [ ] Remove Static file server
- [ ] Remove All Non EJS UI
- [ ] Trim all UI requirements down to assume that a UI heavy project will provide those itself.

- [ ] Break Existing UI out into a different project
- [ ] Move this project into Phaesynthe ownership

- [x] Swagger Documentation engine
- [ ] Full unit tests
- [x] Newman Tests
- [ ] Docker config
- [ ] CI process
- [ ] Redis Session storage
- [ ] MongoDB connection
- [x] Static module generation
- [x] Server rendered views
- [x] Newman Testing

### Local Run
`npm install` or `yarn install`

Then, after that is complete:

```
npm run build
npm start
```

Then navigate a web browser to `http://localhost:24601/`.

The incomplete set of unit tests can be run with `npm test`.
