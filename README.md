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
4. `Start project on http://localhost:4000`
```js 
npm start
```

## Introduction

A GraphQL API that takes a chat message string in GraphQL query format as input, and returns a JSON object containing information about its contents as described below.

1. Mentions - A way to mention a user. Always starts with an '@' and ends when hitting a non-word character.
2. Emoticons - Consider 'custom' emoticons which are alphanumeric strings, no longer than 15 characters, contained in parenthesis.
3. Links - Any URLs contained in the message, along with the page's title.

## Examples

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