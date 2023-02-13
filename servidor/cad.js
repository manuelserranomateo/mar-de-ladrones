var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function Cad() {
    this.logs;
    this.usuarios = undefined;

    this.insertarLog = function (registroLog, callback) {
        insertar(this.logs, registroLog, callback);
    }

    this.obtenerLogs = function (callback) {
        obtenerTodos(this.logs, callback)
    }

    this.obtenerUsuarios = function (callback) { 
        obtenerTodos(this.usuarios, callback);
    }

    this.obtenerOCrearUsuario = function (criterio, callback) { 
        obtenerOCrear(this.usuarios, criterio, callback)
    }

    function obtenerOCrear(coleccion, criterio, callback) {
        coleccion.findOneAndUpdate(criterio, { $set: criterio }, { upsert: true }, function (err, doc) {
            if (err) { throw err; }
            else {
                console.log("Actualizado");
                callback(doc);
            }
        });
    }



    function insertar(coleccion, elemento, callback) {
        coleccion.insertOne(elemento, function (err, result) {
            if (err) {
                console.log("Error");
            }
            else {
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });

    }

    function obtenerTodos(coleccion, callback) {
        coleccion.find().toArray(function (error, col) {
            callback(col);
        });
    };

    this.conectar = function () {
        let cad = this;

        mongo.connect('xxxxxxxx',
                      // sustituir xxxxx por la clave para conectar con mongodb atlas
            { useUnifiedTopology: true }, function (err, database) {
                if (!err) {
                    console.log("Conectado a MongoDB Atlas");
                    database.db("batalla").collection("logs", function (err, col) {
                        if (err) {
                            console.log("No se puede obtener la coleccion de logs")
                        }
                        else {
                            console.log("Tenemos la colección de logs");
                            cad.logs = col;
                        }
                    });
                    database.db("batalla").collection("usuarios", function (err, col) {
                        if (err) {
                            console.log("No se puede obtener la coleccion de usuarios")
                        }
                        else {
                            console.log("Tenemos la colección de usuarios");
                            cad.usuarios = col;
                        }
                    });

                }
                else {
                    console.log("No se puedo conectar con MongoDB Atlas")
                }
            })
    }
}

module.exports.Cad = Cad;
