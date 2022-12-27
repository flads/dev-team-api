# NestJS Boilerplate

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/flads/nestjs-boilerplate/pulls)

A starter template for NestJS projects using TypeORM, with Swagger API description and unit tests coverage.

  - List users.
  - Show user.
  - Create users.
  - Update users.
  - Delete users.

### Tech

Technologies used in this project:

* [NestJS](https://github.com/nestjs/nest) - A progressive Node.js framework.
* [TypeScript](https://github.com/microsoft/TypeScript) - TypeScript is a superset of JavaScript that compiles to clean JavaScript output.
* [TypeORM](https://github.com/typeorm/typeorm) - ORM for TypeScript and JavaScript (ES7, ES6, ES5).

* [Swagger](https://github.com/nestjs/swagger) - OpenAPI (Swagger) module for Nest framework (node.js).
* [PostgreSQL](https://github.com/postgres/postgres) - PostgreSQL is a powerful, open source object-relational database system.

And of course NestJS itself is open source with a [public repository](https://github.com/flads/nestjs-boilerplate) on GitHub.

### Installation

Clone the repository:
```sh
git clone git@github.com:flads/nestjs-boilerplate.git
```

Install the dependencies:

```sh
cd nestjs-boilerplate && npm i
```

Create your .env file:

```sh
cp .env.example .env
```

*Configure your database credentials...*

Run migrations:

```sh
npm run typeorm migration:run -- -d ormconfig.ts
```

Start the server:

```sh
npm run start:dev
```

### Swagger
Access the API description at http://127.0.0.1:3000/swagger.
![Demo](https://raw.githubusercontent.com/flads/nestjs-boilerplate/master/nestjs-boilerplate-swagger.png)

### Development

Want to contribute? Great!
Feel free!

License
----

MIT