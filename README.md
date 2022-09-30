# GraphQL Application

## Installation

1. `Clone repository`
```js 
git clone https://github.com/arturguimaraes/graphql-json-query.git 
```
2. `Go to directory`
```js 
cd graphql-json-query
```
3. `Install required libraries`
```js 
npm i
```
4. `Start project on http://localhost:4000 and test it with Apollo Studio Sandbox` 
```js 
npm start
```
![graphql-json-query](https://github.com/arturguimaraes/graphql-json-query/blob/main/src/assets/img/print.png?raw=true)

## Introduction

A GraphQL API that takes a chat message string in GraphQL query format as input, and returns a JSON object containing information about its contents as described below.

1. Mentions - A way to mention a user. Always starts with an '@' and ends when hitting a non-word character.
2. Emoticons - Consider 'custom' emoticons which are alphanumeric strings, no longer than 15 characters, contained in parenthesis.
3. Links - Any URLs contained in the message, along with the page's title.

## Example 1
### Input
```js
{
  records(message: "@chris you around?") {
    mentions
  }
}
```
### Response
```js
{
  "data": {
    "records": {
      "mentions": [
        "chris"
      ]
    }
  }
}
```
## Example 2
### Input
```js
{
  records(message: "Good morning! (megusta) (coffee)") {
    emoticons
  }
}
```
### Response
```js
{
  "data": {
    "records": {
      "emoticons": [
        "coffee",
        "megusta"
      ]
    }
  }
}
```
## Example 3
### Input
```js
{
  records(message: "Olympics are starting soon; http://www.nbcolympics.com") {
    mentions, 
    links {
        url,
        title
    }
  }
}
```
### Response
```js
{
  "data": {
    "records": {
      "mentions": [],
      "links": [
        {
          "url": "http://www.nbcolympics.com",
          "title": "Beijing 2022 Olympic Winter Games"
        }
      ]
    }
  }
}
```
## Example 4
### Input
```js
{
  records(message: "@bob @john (success) such a cool feature; https://www.apollographql.com/") {
    mentions, 
    emoticons,
    links {
        url,
        title
    }
  }
}
```
### Response
```js
{
  "data": {
    "records": {
      "mentions": [
        "bob",
        "john"
      ],
      "emoticons": [
        "success"
      ],
      "links": [
        {
          "url": "https://www.apollographql.com/",
          "title": "Supergraph: unify APIs, microservices, & databases in a composable graph"
        }
      ]
    }
  }
}
```