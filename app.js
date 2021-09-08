var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const db = require("./models");
var cors = require('cors');
// contact.csv파일을 읽기 위한 준비.
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const csv = fs.readFileSync("csv/contact.csv");
const records = parse(csv.toString("utf-8"));

function isNull(data, replace) {
  return data === undefined || data === "" ? replace : data;
}


// 데이터베이스 싱크하기.
db.sequelize.sync();

// contact.csv파일 읽기
/*records.forEach(async r => {
  await db.User.create({
    name: r[0],
    number: r[1]
  });
});*/

// 데이터베이스 기능 사용.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

app.listen(3000, function () {
  console.log("Start!! express server on port 3000");
});

var corsOptions = {
  origin: ["http://175.209.131.204:3000", "http://standard-pass-cms.s3-website-ap-northeast-1.amazonaws.com", "https://cms.standardpass.com", "http://61.105.196.218:3000", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// 접속시 html 파일 제공을 위해서.
app.use(express.static("public"));

// 데이터를 쉽게 주고받기 위한 기본 세팅.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 처음에 접속시 보여주는 html 파일.
/*app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/form.html");
});*/

// insert 작업시 라우팅.
app.post("/insert", async (req, res) => {
  try {
    // 공백 처리
    const title = isNull(req.body.title, null);
    const memo = isNull(req.body.memo, null);
    const name = isNull(req.body.name, null);
    const status = isNull(req.body.status, null);

    if (title == null || title == null || name == null || status == null) {
      res.status(400).json({ success: false, error: "bad parameter" });
      return;
    }
    await db.User.create({
      title: title,
      memo: memo,
      name: name,
      status: status
    });
    // check validation.
    var responseData = { success: "ok", data: req.body };
    res.json(responseData);
  } catch (e) {
    console.log(e);
  }
});

// search 작업시 라우팅
app.post("/search-all", async (req, res) => {
  try {
    // 공백 처리

    // 같은 이름을 가진 이름 리스트 찾기 => 반환값 : 배열
    const sameList = await db.User.findAll({
    });


    // 응답 데이터 만들기
    var responseData = {
      success: "ok",
      List: sameList,
    };

    // res에 실어서 전송.
    res.json(responseData);

  } catch (e) {
    console.log(e);
  }
  // check validation.
});

app.post("/search-status", async (req, res) => {
  try {
    // 공백 처리
    const status = isNull(req.body.status, null);
    if (status == null) {
      res.status(400).json({ success: false, error: "bad parameter" });
      return;
    }
    // 같은 이름을 가진 이름 리스트 찾기 => 반환값 : 배열
    const sameList = await db.User.findAll({
      where: {
        name: status
      }
    });



    // 응답 데이터 만들기
    var responseData = {
      success: "ok",
      List: sameList
    };

    // res에 실어서 전송.
    res.json(responseData);

  } catch (e) {
    console.log(e);
  }
  // check validation.
});


// 삭제 작업 라우팅
app.post("/delete", async (req, res) => {
  try {
    // 공백 처리
    const id = isNull(req.body.id, null);

    // 삭제
    await db.User.destroy({
      where: {
        id: id
      }
    });

    // 응답 데이터 만들기
    var responseData = { success: "ok" };
    // 데이터 전송
    res.json(responseData);

  } catch (e) {
    console.log(e);
  }
});

// 수정 작업 라우팅
app.post("/update", async (req, res) => {
  try {
    const title = isNull(req.body.title, null);
    const memo = isNull(req.body.memo, null);
    const name = isNull(req.body.name, null);
    const status = isNull(req.body.status, null);
    const id = isNull(req.body.id, null);
    if (title == null || title == null || name == null || status == null) {
      res.status(400).json({ success: false, error: "bad parameter" });
      return;
    }
    await db.User.update(
      { title: title, memo: memo, name: name, status: status, },
      {
        where: {
          id: id,
        }
      }
    );

    // 응답 데이터 만들기
    var responseData = { result: "ok", data: req.body };
    // 데이터 전송
    res.json(responseData);
  } catch (e) {
    console.log(e);
  }
});