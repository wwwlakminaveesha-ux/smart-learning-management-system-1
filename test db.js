const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'SmartLearnerDB'
});

connection.connect(err => {
    if (err) {
        console.error('Connection Error: ' + err.message);
        return;
    }
    console.log('Database ekata connect una!');

    connection.query('SELECT id, name, email, role FROM users', (err, results) => {
        if (err) {
            console.error('Query Error: ' + err.message);
        } else {
            console.log('Users list eka menna:');
            console.table(results);
        }
        connection.end();
    });
});