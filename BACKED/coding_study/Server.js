const mongoclient = require("mongodb").MongoClient;
const ObjId = require('mongodb').ObjectId;
const url =
  "mongodb+srv://zzim2003:yesh23156^@cluster0.tcmrsy2.mongodb.net/?retryWrites=true&w=majority";

let mydb;
mongoclient
  .connect(url)
  .then((client) => {
    mydb = client.db("myboard");
    //mydb.collection('post').find().toArray().then(result =>{
    //    console.log(result);
    // })

    app.listen(8080, function () {
      console.log("포트 8080으로 서버 대기중 ... ");
    });
  })
  .catch((err) => {
    console.log(err);
  });

//MySQL + nodejs 접속 코드
var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yesh23156^",
  database: "myboard",
});

conn.connect();

const express = require("express");
const app = express();

//body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


// app.listen(8080, function(){
//     console.log("포트 8080으로 서버 대기중 ... ")
// });
app.get("/book", function (req, res) {
  res.send("도서 목록 관련 페이지입니다.");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get('/list',function(req, res) {
  mydb.collection('post').find().toArray().then(result => {
    //console.log(result);
    res.render('list.ejs',{ data : result });
    })
});
app.get('/enter',function(req,res){
  res.render('enter.ejs')
});

app.post('/save',function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);
  console.log(req.body.someDate);  //몽고DB
  mydb.collection('post').insertOne(
    {title : req.body.title , content:req.body.content , date : req.body.someDate}
  ).then(result => {
    console.log(result);
    console.log('데이터 추가 성공');
  })
  
//mySQL DB에 데이터 저장하기
/*  let sql = "insert into post (title,content,created) value(?,?,NOW())";
  let params = [req.body.title,req.body.content];
  conn.query(sql,params,function(err,result){
    if (err) throw err;
    console.log('데이터 추가성공');
  });
  res.send('데이터 추가성공');*/
})     


app.post("/delete",function(req,res){
  console.log(req.body._id);
  req.body._id = new ObjId(req.body._id);
  mydb.collection('post').deleteOne(req.body)
  .then(result => {
    console.log('삭제완료');
    res.status(200).send();
  })
  .catch(err =>{
    console.log(err);
    res.status(500).send();
  });
});

//'/content'요청에 대한 처리 루틴
app.get('/content/:id',function(req,res){
  console.log(req.params.id);
  req.params.id = new ObjId(req.params.id);
  mydb.collection("post").findOne({_id : req.params.id }).then((result)=>{
    console.log(result);
    res.render("content.ejs",{ data : result });
  });
});

app.get("/edit/:id",function(req,res){
  req.params.id = new ObjId(req.params.id);
  mydb.collection("post").findOne({_id:req.params.id}).then((result) => {
    console.log(result);
    res.render("edit.ejs", {data : result});
  })
});

app.post("/edit",function(req,res){
  console.log(req.body);
  req.body.id = new ObjId(req.body.id);
  mydb.collection("post").updateOne({_id : req.body.id} ,
     {$set : {title : req.body.title,
     content : req.body.content,
      date : req.body.someDate}})
  .then((result) => {
    console.log("수정완료");
    res.redirect('/list');
  }).catch((err) => {
    console.log(err);
  });
});