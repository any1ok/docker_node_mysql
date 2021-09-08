const path = require("path");

const Sequelize = require("sequelize");

const mybatisMapper = require("mybatis-mapper");

const envType = process.env.ENV ? process.env.ENV : "dev";

 

const sequelize = new Sequelize(
  "postgres://sp:standardpass13258@sp.cluster-cyjcdgn2yreh.us-east-1.rds.amazonaws.com:5432/sp",
  {

    dialect: "postgres",

    dialectOptions: {

      statement_timeout: 5000,

      idle_in_transaction_session_timeout: 5000

    },

    define: {},

    pool: {

      max: 60,

      min: 0,

      idle: 10000,

      acquire: 20000

    },

    logging: console.log,

 

  }

);

 

//const dbUrl = process.env.DB_URL;

//const sequelize = new Sequelize(dbUrl);

const sqlPath = path.join(__dirname, "..", ".", `/sql`);

 

mybatisMapper.createMapper([`${sqlPath}/sql.xml`, `${sqlPath}/cms.xml`, `${sqlPath}/spuser.xml`, `${sqlPath}/spcms.xml`, `${sqlPath}/spdoctor.xml`, `${sqlPath}/spbusiness.xml`]);

 

var db = async function (req, res, next) {

  req.envType = envType;

  req.sequelize = sequelize;

  req.mybatisMapper = mybatisMapper;

  next();

};

 

module.exports = db;