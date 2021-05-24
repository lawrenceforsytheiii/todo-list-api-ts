# To-Do List API

A simple RESTful To-Do list API leveraging Typescript, AWS Lambda, API Gateway, DynamoDB, and Serverless

## Dependencies
- NodeJS (14 or higher)
- NPM
- AWS CLI
- Serverless CLI

## Installation
```bash
npm i
serverless dynamodb install
serverless offline start
```

#### Local Endpoints

##### Lists
`POST create list -`
[http://localhost:3000/dev/list/create](http://localhost:3000/dev/list/create)

`POST delete list and tasks -`
[http://localhost:3000/dev/list/delete](http://localhost:3000/dev/list/delete)

`POST Get list and tasks -`
[http://localhost:3000/dev/list](http://localhost:3000/dev/list)

`POST update list -`
[http://localhost:3000/dev/list/update](http://localhost:3000/dev/list/update)


##### Tasks
`POST create task -`
[http://localhost:3000/dev/task/create](http://localhost:3000/dev/task/create)

`POST delete task -`
[http://localhost:3000/dev/task/delete](http://localhost:3000/dev/task/delete)

`POST Get task -`
[http://localhost:3000/dev/task](http://localhost:3000/dev/task)

`POST update task -`
[http://localhost:3000/dev/task/update](http://localhost:3000/dev/task/update)
