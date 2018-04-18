'use strict'
const serverless = require('serverless-http');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
//var db = require('./db.js');
const app = express();

const AWS = require('aws-sdk');
const USERS_TABLE = process.env.USERS_TABLE;
// const dynamoDb = new AWS.DynamoDB.DocumentClient();
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
})

//var PORT = process.env.PORT || 3000;
//var todos = [];
//var todoNextId = 1;

app.use(bodyParser.json({ strict: false }));

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=false&q=work
app.get('/todos', function(req, res) {
	res.send('Todo API TODO');
	// var query = req.query;
	// var where = {};

	// if (query.hasOwnProperty('completed') && query.completed === 'true') {
	// 	where.completed = true;
	// } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
	// 	where.completed = false;
	// }

	// if (query.hasOwnProperty('q') && query.q.length > 0) {
	// 	where.description = {
	// 		$like: '%' + query.q + '%'
	// 	};
	// }

	// db.todo.findAll({where: where}).then(function (todos) {
	// 	res.json(todos);
	// }, function (e) {
	// 	res.status(500).send();
	// });
});

// GET /todos/:id
app.get('/todos/:userId', function(req, res) {
	//var todoId = parseInt(req.params.id, 10);

	// db.todo.findById(todoId).then(function (todo) {
	// 	if (!!todo) {
	// 		res.json(todo.toJSON());
	// 	} else {
	// 		res.status(404).send();
	// 	}
	// }, function (e) {
	// 	res.status(500).send();
	// });
  console.log('Table name isssss = ' + USERS_TABLE)


	const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  }
  console.log('Table name isssss = ' + USERS_TABLE)
  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get Todo' });
    }
    if (result.Item) {
      const {userId, name} = result.Item;
      res.json({ userId, name });
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  });
});

//POST /todos
app.post('/todos', function(req, res) {
	// var body = _.pick(req.body, 'description', 'completed');

	// db.todo.create(body).then(function (todo) {
	// 	res.json(todo.toJSON());
	// }, function (e) {
	// 	res.status(400).json(e);
	// });
	const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
    res.json({ userId, name });
  });
});

// // DELETE /todos/:id
// app.delete('/todos/:id', function(req, res) {
// 	var todoId = parseInt(req.params.id, 10);
// 	var matchedTodo = _.findWhere(todos, {
// 		id: todoId
// 	});

// 	if (!matchedTodo) {
// 		res.status(404).json({
// 			"error": "no todo found with that id"
// 		});
// 	} else {
// 		todos = _.without(todos, matchedTodo);
// 		res.json(matchedTodo);
// 	}
// });

// // PUT /todos/:id
// app.put('/todos/:id', function(req, res) {
// 	var todoId = parseInt(req.params.id, 10);
// 	var matchedTodo = _.findWhere(todos, {
// 		id: todoId
// 	});
// 	var body = _.pick(req.body, 'description', 'completed');
// 	var validAttributes = {};

// 	if (!matchedTodo) {
// 		return res.status(404).send();
// 	}

// 	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
// 		validAttributes.completed = body.completed;
// 	} else if (body.hasOwnProperty('completed')) {
// 		return res.status(400).send();
// 	}

// 	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
// 		validAttributes.description = body.description;
// 	} else if (body.hasOwnProperty('description')) {
// 		return res.status(400).send();
// 	}

// 	_.extend(matchedTodo, validAttributes);
// 	res.json(matchedTodo);
// });
// db.sequelize.sync().then(function() {
// 	// app.listen(PORT, function() {
// 	// 	console.log('Express listening on port ' + PORT + '!');
// 	// });
// 	module.exports.handler = serverless(app);
// });
	module.exports.handler = serverless(app);


