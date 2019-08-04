var mysql      = require('mysql');
var connection = mysql.createConnection ({
 host: 'den1.mysql1.gear.host',
 user: 'consoletrader',
 password: 'password#',
 database: 'consoletrader',  
 multipleStatements: true
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection; 