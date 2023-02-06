// Node.js용 더미 REST 서버

const express = require("express");
const bodyParser = require("body-parser");
// 가짜 ID 생성 위해 범용 고유 식별자(UUID, Universally Unique IDentifiers) 생성 가능한 UUID 패키지 사용
const uuidv4 = require("uuid/v4");
const findIndex = require("lodash.findindex");

const PORT = 8080;

const app = express();
let todos = []; // 실제 DB 대신 임시 배열에 저장

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/api/todos", (req, res) => {
  res.send(todos);
});

app.post("/api/todos", (req, res) => {
  const newTodo = {
    completed: false,
    ...req.body,
    id: uuidv4(),
  };

  todos.push(newTodo);

  res.status(201);
  res.send(newTodo);
});

app.patch("/api/todos/:id", (req, res) => {
  const updateIndex = findIndex(todos, (t) => t.id === req.params.id);
  const oldTodo = todos[updateIndex];

  const newTodo = {
    ...oldTodo,
    ...req.body,
  };

  todos[updateIndex] = newTodo;

  res.send(newTodo);
});

app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== req.params.id);

  res.status(204);
  res.send();
});

app.listen(PORT);
