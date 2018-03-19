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

## Roadmap [v1.0.0]
- [ ] Features
  - [ ] Ability to list all the blog posts of today
  - [ ] Ability to vote a blog post as relevant
  - [ ] Ability to rank all the relevant blog posts of today
  - [ ] Ability to upload a RSS File to insert more relevant blogs
  - [ ] Ability to insert a new RSS URL to insert a new blog

- [ ] Bugfixes
  - [ ] Fix infinity loop RSS Feed. See: [jlongster](https://jlongster.com/atom.xml)
