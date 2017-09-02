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
### Connections ###
This is the Data Access Layer as well as External Service Access Layer.

For this project, a connection is anything external to this that provides data or service. This includes databases as well as 3rd party API integrations. It should not extend to incoming webhooks.

The name of these Connections should match an entry in the `./config/connectionSources.congif.js` file. Although the name provided in this project happens to match a technology name, this should not be considered expected. Each connection can leverage a separate instance of a given technology or service. When developing these connections, the possibility of using multiple instances should be considered and, if likely, the technology should be wrapped in an accessor in `./api/Utilities/Connectors/`.

### Controllers ###
This is the primary application logic layer.

A Controller is a collection of similar logic. Although these often interact with Connections and Rest Handlers, this should not be thought to be a requirement. A controller may only exist to provide needed peer functionality required by other Controllers.

Also, the mistake of thinking of a one-to-one relationship between Connections (databases) and Controllers should be avoided. It may be that the best design to have multiple controllers that interact with one Connection if there are multiple logic sets to be done with the same data. The most obvious of these situations is business reporting on data pertinent to web-service operations.  

### Models ###
This express the application pertinent data structures.

There is still alot of work to be done on model features, but a model, although related to a database, should be considered map directly to a database structure (Mongo Schema or SQL table).

### Rest Handlers ###
Serves as the View Layer.

Handlers should be limited to interfacing the Express request and response objects with associated controllers. 

### Static ###
Expresses internal static value sets. These exists in lieu of SQL style lookup tables, and should be thought of in a similar way.

When constructing these, it is advised to consider how the values are going to be used by external systems, and structure accordingly.

### Utilities ###


## Anatomy of an HTTP Request ##
HTTP -> Express Route -> Route Security -> Rest Handler -> Controller -> Connection -> Database
HTTP <- Rest Handler <- Controller <- Connection
