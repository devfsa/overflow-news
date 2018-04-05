[![wercker status](https://app.wercker.com/status/75e452018a5c4de409be0b20c72de16a/s/master "wercker status")](https://app.wercker.com/project/byKey/75e452018a5c4de409be0b20c72de16a) [![Coverage Status](https://coveralls.io/repos/github/devfsa/overflow-news/badge.svg?branch=nunes%2Fadding_coverage)](https://coveralls.io/github/devfsa/overflow-news?branch=nunes%2Fadding_coverage)

# Overflow News
:books: Don't waste time searching for good dev blog posts. Get the latest news here.

## Screenshot
![First Version](assets/screenshot.png)

## Requirements
* [MongoDB](https://www.mongodb.com/)
* [Redis](https://redis.io/)
* [NodeJS](https://nodejs.org/)

## Configure
Create the `.env` file, containing the environment variable, and the fill the missing values:
```
cp .env.example .env
```

## Install
```
$ npm install
```

## Run with docker
```
$ docker-compose up --build
```

## Run locally
```
$ npm start
```

## Open the browser
```
http://localhost:8080
```
