const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost';

//Добавляем новую запись в post
addPost =  (name, title, subject, status, priority, planned, spend, date, levelPriority, callback) => {
    MongoClient.connect(url, (err, client) => {
        const db = client.db('Blog'); 
        db.collection('post').insertOne( {
            "name": name,
            "title": title,
            "subject": subject,
            "status": status,
            "priority": priority,
            "planned": planned,
            "spend": spend,
            "date": date,
            "levelPriority": levelPriority
        }, (err, result) => {
            assert.equal(err, null);
            if(err == null){
                callback(true)
            }
            else{
                callback(false)
            }
        });
    });
}

//Получаем данные из БД из таблицы post по имени пользователя
getPost = (name, callback) =>{
    MongoClient.connect(url, (err, client) => {
        const db = client.db('Blog');
        db.collection('post',(err, collection)=>{
            collection.find(
                {"name": name}
            ).toArray((err, list) => {
                callback(list)
            })
        })
    })
}

//Получаем данные о записи из БД по определенному идентификатору
getPostWithId = (id, callback) => {
    MongoClient.connect(url, (err, client) => {
        const db = client.db('Blog');
        db.collection('post').findOne({
            _id: new mongodb.ObjectID(id)
        },
        (err, result) => {
            assert.equal(err, null);
            console.log("Retrived the entry.");
            err == null ? callback(result) : callback(false);
        }
    )
    })
}

//Делаем запрос на обновление поста
updatePost = (id, title, subject, status, priority, planned, spend, levelPriority, callback) => {
    MongoClient.connect(url, (err, client) => {
            const db = client.db('Blog');
            db.collection('post').updateOne( 
                { "_id": new mongodb.ObjectID(id) },
              { $set: 
                  { "title" : title,
                    "subject" : subject,
                    "status": status,
                    "priority": priority,
                    "planned": planned,
                    "spend": spend,
                    "levelPriority": levelPriority 
                  }
              }, (err, result) => {
            assert.equal(err, null);
            console.log("Статья обновлена");
            err == null ? callback(true) : callback(false)
        });
    });
}

//Делаем запрос на удаление поста
deletePost = (id, callback) => {
    MongoClient.connect(url, (err, client) => {
        var db = client.db('Blog');
        db.collection('post').deleteOne({
            _id: new mongodb.ObjectID(id)
        },(err, result) => {
            assert.equal(err, null);
            console.log('Элемент удален', id);
            err == null ? callback(true) : callback(false)
        })
    })
}

//Экспорт модулей
module.exports = {
    addPost,
    getPost,
    getPostWithId,
    updatePost,
    deletePost
}