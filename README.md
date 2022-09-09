# Streamlined news API

A simple API of news articles and comments. Check the homepage on the link below for a directory of endpoints and functionality.

## Take a look

https://nc-news-api-oliver.herokuapp.com/

## Setup Instructions

`Installing dependencies`

From your repo's directory in the command line, run the following command:

```
npm install -D
```

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

`Setting environment variables`

You will need to create two .env files for your project: .env.test and .env.development. Into each, add the following:

#### .env.test

```
PGDATABASE=<nc_news_test>
```

#### .env.development

```
PGDATABASE=<nc_news_test>
```

note: .env files are included in .gitignore for security.

## Scripts

There are several additional scripts available:

```
    npm run dev             //runs app and seeds dev data using Nodemon
    npm run test-watch      //runs tests with --watch flag
```
