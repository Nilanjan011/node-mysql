
var methods={};
methods.getData= (mysqlConnection,id,field,table,cb) =>{
    // return "get data function  "+id;
    sql=`SELECT ${field} FROM ${table} where id=${id}`;
    mysqlConnection.query(sql, (err, rows,fields) => {
        if (!err){
            cb(err,rows);
            // console.log(rows[0].name);// get output properly 
            // return rows[0].name; // return name into index.js page
        }
        else{
            console.log(err);
        }
    })
}

exports.data=methods;