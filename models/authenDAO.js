var mysql = require('./connection').pool;

module.exports.login = function (obj, callback, next) {
    mysql.getConnection(function (err, conn) {
        if (err) {
            conn.release();
            next(err);
        }
        else conn.query("Select Username,Password from Cliente where Username=? and Password=?", [obj.Username, obj.Password], function (err, rows) {
            console.log(rows);
            console.log(obj);
            conn.release();
            if (!(rows.length === 0)) {
                callback({ code: 200, status: "Ok" },rows);
            }
            else {
                callback({ code: 401, status: "User or password incorrects" }, null);
            }
        })
    })
}

module.exports.register = function (obj, callback, next) {
    mysql.getConnection(function (err, conn) {
        if (err) {
            conn.release();
            next(err);
        }
        else conn.query('INSERT INTO Cliente(Username, Email,Password) VALUES (?,?,?)', [obj.Username, obj.Email, obj.Password], function (err, rows) {
            conn.release();
            if (!(rows.length === 0)) {
                callback(rows,{ code: 200, status: "Ok" });
            }
            else {
                callback({ code: 500, status: "Unable to register" }, null);
            }
        })
    })
}

module.exports.authentication = function (callback, next) {
    mysql.getConnection(function (err, conn) {
        if (err) {
            conn.release();
            next(err);
        }
        else conn.query("SELECT Username,Nome,Liga,Desporto FROM Cliente,Cliente_has_Pacote,Pacote where Cliente_idCliente = idCliente and Pacote_idPacote = idPacote", function (err, rows) {
            conn.release();
            if (!(rows.length === 0)) {
                callback(rows,{ code: 200, status: "Ok" });
            }
            else {
                callback({ code: 404, status: "User does not have a plan" }, null);
            }
        })
    })
}