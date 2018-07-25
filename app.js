const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const user = require('./user');
const session = require('express-session');
const post = require('./post');

const app = express();
//Основная часть бэкенда на NodeJS. Передаем данные со стороны клиента на сервер
//Главная страница приложеиня и метод для "разбора" данных в json и создаем сессию
app.use(express.static(path.join(__dirname,"/html"))).use(session({secret: 'my-secret', resave: true, saveUninitialized: true}));

app.use(bodyParser.json());

var sessions;

//Разбиваем данные из json
//Создаем сессию авторизованного пользователя
app.post('/signin', (req, res) => {
  sessions = req.session;
  var user_name = req.body.name;
  var password = req.body.password;
  sessions.username = user_name;
  console.log(sessions);
  user.validateSignIn(user_name,password, (result) => {
    if(result){
      sessions.username = user_name;
      res.send('Success');
    }
  });
})

//Добавляем обработчик запроса из user.js
app.post('/signup', (req, res) => { //Принимаем обработанные данные
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  //Если данные введены корректно то отправляем в метод user.js для добавления записи в БД
  name && email && password ? user.signup(name, email, password) : res.send('Failure');
})

//Выход из системы
app.get('/logout', (req, res) => {
  sessions.username = null;
  res.redirect('/');
});

//Добавляем новую страницу, в случае совпадения сессии и имени то перенаправлять в Home
app.get('/home', (req, res)=>{
  if(sessions && sessions.username){
    res.sendFile(__dirname + '/html/home.html')
  } else {
    res.redirect('/');
  }
})

//Обработчик отправки данных в БД, в нашем случае добавляем новую запись
app.post('/addpost',(req, res)=>{
  var name = sessions.username;
  var title = req.body.title;
  var subject = req.body.subject;
  var status = req.body.status;
  var priority = req.body.priority;
  var planned = req.body.planned;
  var spend = req.body.spend;
  var date = req.body.date;
  var id = req.body.id;
  var levelPriority = req.body.levelPriority
console.log(id);
  if(id == '' || id == undefined){
    console.log('Запись создана')
    post.addPost(name, title, subject, status, priority, planned, spend, date, levelPriority, (result)=>{
      res.send(result)
    })
  } else {
    console.log('Запись изменена', title, subject, status, priority, planned, spend, levelPriority)
    post.updatePost(id, title, subject, status, priority, planned, spend, levelPriority, (result)=>{
      res.send(result)
    })
  }
})

//Получение данных
app.post('/getpost', (req, res) => {
  var name = sessions.username;
  post.getPost(name, (result) => {
    res.send(result)
  })
})

//Делаем запрос данных для получения информации о редактируемой статье
app.post('/getPostWithId', (req, res) => {
  var id = req.body.id;
  console.log(req.body);
  post.getPostWithId(id,(result) => {
    res.send(result)
    console.log(result)
  })
})

//Запрос на удаление поста
app.post('/deletePost', (req, res) => {
  var id = req.body.id;
  post.deletePost(id, (result) => {
    res.send(result)
  })
})


//404 ошибка
app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + '/html/404.html');
});


//Подключаемся к порту 30000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on ", port, app.settings.env);
})