[![wercker status](https://app.wercker.com/status/7abb18ad3bd562265fdde6cd5edfc93b/m/master "wercker status")](https://app.wercker.com/project/byKey/7abb18ad3bd562265fdde6cd5edfc93b)

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
