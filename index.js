
// import libs
const express = require("express");
const server = express();
const path = require("path");
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    extended: true,
    limit: "50mb",
});
const jsonEncoded = express.json({
    limit: "50mb",
});
const cors = require("cors");

// import config
const config = require("./configs/config.js");

// database setup
const db = require('better-sqlite3')(path.join(__dirname + "/database/db.sqlite3"));


// setup server
server.use(cors({
    origin: ["http://127.0.0.1:5500"],
}));
server.use(urlEncoded);
server.use(jsonEncoded);


// api 
server.post("/api/status/change", urlEncoded, async(req, res) =>{
    const { machine_no, change_to } = req.body ?? {};

    if(!machine_no || !change_to){
        return res.json({
            status: "FAIL",
            error: "Cant find 'machine_no' or 'change_to' query",
        });
    }

    if(isNaN(machine_no)){
        return res.json({
            status: "FAIL",
            error: "machine_no is not a number",
        });
    }

    if(isNaN(change_to) || change_to !== "0" && change_to !== "1"){
        return res.json({
            status: "FAIL",
            error: "you can use only 1 or 0 for on or off",
        });
    }

    try {
        db.prepare(`UPDATE washing_machine_${machine_no}_status SET status=?`).run(parseInt(change_to));
        return res.json({
            status: "SUCCESS",
            error: null
        });
    }
    catch(err){
        return res.json({
            status: "FAIL",
            error: err,
        });
    }
});

server.get("/api/status/check/:machine_no", async(req, res) =>{
    const { machine_no } = req.params ?? {};
    
    if(isNaN(machine_no)){
        return res.json({
            status: "FAIL",
            error: "number only",
        });
    }

    try{
        const row = db.prepare(`SELECT * FROM washing_machine_${machine_no}_status`).get();
        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                results: row,
            }
        });

    }
    catch(err){
        console.log(err);
        return res.json({
            status: "FAIL",
            error: err,
        });
    }
});

server.listen(config.server.port, () =>{
    console.log(`[Server] server started on port : ${config.server.port}`);
});