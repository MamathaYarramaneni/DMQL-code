const express = require("express");
const app = express();
const port = 8080;
require("dotenv").config();
const { Pool } = require("pg");
const path = require("path");
const cors = require("cors");

let pool = new Pool();

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
// const whitelist = ["http://localhost:8080"]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }
// app.use(cors(corsOptions))
// app.options('*', cors())

// app.use(cors({
//     methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));

app.use(cors());

app.get("/", (req, res) => {
  res.send({ text: "abcd", author: "hey" });
});

app.get("/alldept", cors(), (req, res) => {
  pool.connect(async (error, client, release) => {
    let resp = await client.query(`SELECT * FROM department`);
    release();
    res.json(resp.rows);
  });
  // res.send(resp.rows);
  //   res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/alldoctors", (req, res) => {
  pool.connect(async (error, client, release) => {
    let resp = await client.query(`SELECT * FROM doctor`);
    release();
    res.json(resp.rows);
  });
  // res.send(resp.rows);
  //   res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/allpatients", (req, res) => {
  pool.connect(async (error, client, release) => {
    let resp = await client.query(`SELECT * FROM patient`);
    release();
    res.json(resp.rows);
  });
  // res.send(resp.rows);
  //   res.sendFile(path.join(__dirname, '/index.html'));
});

app.post("/alldoctors/add", express.json(), (req, res) => {
  pool.connect(async (error, client, release) => {
    // let resp = await client.query(`SELECT * FROM doctor`);
    // release();
    // res.json(resp.rows);
    const { name, phone, dept } = req.body;
    let d_id = dept;
    pool.query(
      "INSERT INTO doctor(name, phone_number, dept_id) VALUES ($1, $2, $3) RETURNING *",
      [name, phone, d_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send(`Doctor added with ID: ${results.rows[0].id}`);
      }
    );
    console.log("received", req.body);
  });
  // res.send(resp.rows);
  //   res.sendFile(path.join(__dirname, '/index.html'));
});

app.put("/alldoctors/:id/update", express.json(), (req, res) => {
  pool.connect(async (error, client, release) => {
    const { id, name, phone, dept } = req.body;
    pool.query(
      "UPDATE doctor SET name = $1, phone_number = $2, dept_id = $3 WHERE id = $4",
      [name, phone, dept, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).send(`User modified with ID: ${id}`);
      }
    );
    console.log('updated: ', id, name, phone, dept);
  });
});

app.delete("/alldoctors/:id", express.json(), (req, res) => {
  pool.connect(async (error, client, release) => {
    console.log('params: ', req.params.id);
    const id = req.params.id;
    console.log('id: ', id);

    pool.query(
      "DELETE FROM doctor WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).send(`Doctor deleted with ID: ${id}`);
      }
    );
    console.log('deleted: ', id);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
