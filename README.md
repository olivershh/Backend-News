# NC News

NC News is a simple API for news articles and comments. It has been built with Nodejs and postgres.

Check the homepage on the link below for a directory of endpoints and functionality.

## Take a look

https://nc-news-api-oliver.herokuapp.com/

## Setup Instructions

`Technical requirements`

- Node.js v18.6.0
- Postgres v14.4

`Cloning the repo`

Follow the GitHub guide on cloning the repository [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

`Setting environment variables`

After the repository has been cloned, you will need to create two .env files for your project: .env.test and .env.development. Into each, add the following:

#### .env.test

```
PGDATABASE=<database_name_here_TEST>
```

#### .env.development

```
PGDATABASE=<database_name_here>
```

note: .env files are included in .gitignore for security.

`Installing dependencies`

From your repo's directory in the command line, run the following command:

```
npm install
```

This will install all dependencies needed.

Note: all dependencies are listed in package.json and package-lock.json

`Seeding a local database`

To initialize testing and dev databases you will need to run setup.sql. A script is in place for this. Run the following command:

```
npm run setup-dbs
```

`Running tests`

Testing uses jest. A script is in place for this. Run the following command:

```
npm test
```

## Scripts

There are several additional scripts available:

```
    npm run dev             //runs app and seeds dev data using Nodemon
    npm run test-watch      //runs tests with --watch flag
```
