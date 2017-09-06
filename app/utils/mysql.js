const mysql = require('mysql2');

//数据库连接配置选项
var options = {
    'host': 'localhost',//config.db.host,
    //'port': config.db.port,
    'database': 'ecough',
    'user': 'root',
    'password': 'root'
 /*
    'charset': config.db.charset,
    'connectionLimit': config.db.conn_limit,
    'supportBigNumbers': true,
    'bigNumberStrings': true
*/
}

//创建数据库连接池
const pool = mysql.createPool(options);

//数据库查询操作
function execQuery(sql, values, callback) {
    var errinfo;
    pool.getConnection(function(err, connection) {
        if (err) {
            errinfo = 'DB-获取数据库连接异常！';
            console.log(errinfo);
            console.log(err);
            throw errinfo;
        } else {
            var querys = connection.query(sql, values, function(err, rows) {
                release(connection);
                if (err) {
                    errinfo = 'DB-SQL语句执行错误:' + err;
                    console.log(errinfo);
                    //throw errinfo;
                    callback(err);
                } else {
                    callback(null, rows);
                }
            });
            //console.log(querys.sql);
        }
    });
}

//释放数据库连接
function release(connection) {
    try {
        connection.release(function(error) {
            if (error) {
                console.log('DB-关闭数据库连接异常！');
            }
        });
    } catch (err) {}
}

//数据库更新操作，返回影响的条目数
function execUpdate(sql, values){
    return new Promise(function(resolve, reject){
        execQuery(sql, values, function(err, result){
            if(err){
                reject(err);
            }else{
                if (result) {
                    resolve(result.affectedRows);
                } 
            }
        })
    });
}


//查询分页
exports.queryPage = function(sql, values, page, size) {
    if (page > 0) {
        page--;
    } else {
        page = 0;
    }

    return new Promise(function(resolve, reject){
        execQuery(sql + ' LIMIT ' + page * size + ',' + size, values, function(err, rresult) {
            if(err) {
               reject(err);         
            } else {
                var index = sql.toLocaleUpperCase().lastIndexOf(' FROM');
                sql = 'SELECT COUNT(*) count ' + sql.substring(index);
                execQuery(sql, values, function(err, cresult) {
                    if(err){
                        reject(err);
                    }else{
                        var pagenum = cresult[0].count / size;
                        if (cresult[0].count % size > 0) {
                            pagenum++;
                        }
                        resolve({
                            count: pagenum,
                            rows: rresult
                        });
                    }
                });
            };
        });
    });
}

//根据唯一标识(id)，得到记录
exports.getById = function(tablename, id){
    return new Promise(function(resolve, reject){
        var values = {id:id};
        var sql = 'SELECT * FROM ?? WHERE ?';
        execQuery(sql,[tablename, values], function(err, rows){
            if(err){
                reject(err);
            }else{
                if (rows && rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve(rows);
                }
            }
        })
    });
}

//查询一条记录
exports.findOne = function(sql, values) {
    return new Promise(function(resolve, reject){
        execQuery(sql, values, function(err, rows){
            if(err){
                reject(err);
            }else{
                if (rows && rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve(rows);
                }
            }
        })
    });
}

//查询记录
exports.find = function(sql, values) {
    return new Promise(function(resolve, reject){
	execQuery(sql, values, function(err, rows){
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    });
}

//添加一条记录
exports.add = function(tablename, values) {
    var sql = 'INSERT INTO ?? SET ?';
    return execUpdate(sql, [tablename, values]);
}

//更新记录
exports.update = function(tablename, values, id) {
    var sql = 'UPDATE ?? SET ? WHERE ?';
    return execUpdate(sql, [tablename,
        values, id
    ]);
}

//删除记录
exports.delete = function(tablename, values) {
    var sql = 'DELETE FROM ?? WHERE ?';
    return execUpdate(sql, [tablename, values]);
}
