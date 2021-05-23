const mysql = require('mysql');
const multer = require('multer');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const path = require("path");
var fun = require("./function");

const storage = multer.diskStorage({
    destination:"./upload",
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload =multer({
    storage:storage
})

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'EmployeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));

function name() {
    console.log("fbkvbbvakjfkjf");
}

// image upload
app.post("/img",upload.single('profile'),(req,res)=>{
    // fun.data.getData(mysqlConnection,1,"name","image",function (err, rows) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(rows[0].name);

    // });
    let a=req.body;
    console.log(a);
    var sql = `INSERT INTO image (name,phone, file) VALUES ('${a.name}','${a.phone}', '${req.file.filename}')`;
    mysqlConnection.query(sql,(err, rows) => {
        if (!err){
            r=JSON.stringify(rows);
            res.json(r);
        }
        else{
            res.json({
                "name":a.name,
                "file":req.file.filename
            });
        }
    })
   
    
})

//Get all employees
app.get('/employees', (req, res) => {
    name();
    mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an employees
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an employees
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an employees. if we this *upload.single('profile')* then we can access form-data from postman
// app.post('/employees',upload.single('profile'), (req, res) => {
app.post('/employees', (req, res) => {
    
    let emp = req.body;
    console.log(emp);
    
    var sql = `INSERT INTO Employee (Name, EmpCode,Salary) VALUES ('${emp.Name}', '${emp.EmpCode}','${emp.Salary}')`;
    mysqlConnection.query(sql,(err, rows) => {
        if (!err){
            r=JSON.stringify(rows);
            res.send('Inserted employee id : '+r);
        }
        else
        res.send({
            "error":"data not insert"
        });
    })
});

//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
   
    mysqlConnection.query(
      `update Employee set Name=?, EmpCode=?, Salary=? where EmpID = ?`,
      [emp.Name, emp.EmpCode, emp.Salary,emp.EmpID],
      (error, results, fields) => {
        if (error) {
            console.log(error);
        }else{
            res.send({
                "result":"Updated"
            });
        }
        
      }
    );
});
