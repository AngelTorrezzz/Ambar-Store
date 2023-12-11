"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class UsuariosController {
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM usuarios'); //Se hace la consulta a la base de datos
            res.json(respuesta); //Muestra el usuario
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //Se obtiene el id de los parametros de la peticion
            const respuesta = yield database_1.default.query('SELECT * FROM usuarios WHERE usuarios.id = ?', [id]); //Se hace la consulta a la base de datos
            if (respuesta.length > 0) { //Si hay un usuario con ese id
                res.json(respuesta[0]); //Muestra el usuario
                return;
            }
            res.status(404).json({ 'mensaje': 'Usuario no encontrado' }); //Si no hay un usuario con ese id
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO usuarios set ?", [req.body]); //Se hace la consulta a la base de datos
            res.json(resp); //Se muestra la respuesta
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //Se obtiene el id de los parametros de la peticion
            console.log(req.params); //Se muestra el id
            const resp = yield database_1.default.query("UPDATE usuarios set ? WHERE usuarios.id = ?", [req.body, id]); //Se hace la consulta a la base de datos
            //req.body;
            res.json(resp); //Se muestra la respuesta
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //Se obtiene el id de los parametros de la peticion
            const resp = yield database_1.default.query(`DELETE FROM usuarios WHERE usuarios.id = ${id}`); //Se hace la consulta a la base de datos
            res.json(resp); //Se muestra la respuesta
        });
    }
    //SERVICIOS Personalizados
    validarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_usuario, contrasena } = req.body; //Se obtiene el usuario y la contraseña de los parametros de la peticion
            const respuesta = yield database_1.default.query('SELECT * FROM usuarios WHERE usuarios.nombre_usuario = ? AND usuarios.contrasena = ?', [nombre_usuario, contrasena]); //Se hace la consulta a la base de datos
            if (respuesta.length > 0) { //Si hay un usuario con ese id
                res.json(respuesta[0]); //Muestra el usuario
                return;
            }
            res.status(404).json({ 'mensaje': 'Usuario no encontrado' }); //Si no hay un usuario con ese id
        });
    }
    //Administrador
    listarCajeros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT usuarios.nombre_usuario, usuarios.nombres, usuarios.correo, usuarios.telefono FROM usuarios WHERE usuarios.id_tipoUsuario = 2;'); //Se hace la consulta a la base de datos
            res.json(respuesta); //Muestra el usuario
        });
    }
    crearCajero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_usuario, contrasena, nombres, correo, telefono } = req.body;
            const respuesta = yield database_1.default.query('INSERT INTO usuarios (nombre_usuario, nombres, correo, contrasena, telefono, id_tipoUsuario) VALUES (?,?,?,?,?,2);', [nombre_usuario, nombres, correo, contrasena, telefono]); //Se hace la consulta a la base de datos
            res.json(respuesta); //Muestra el usuario
        });
    }
    listarClientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT usuarios.nombre_usuario, usuarios.telefono FROM usuarios WHERE usuarios.id_tipoUsuario = 3;'); //Se hace la consulta a la base de datos
            res.json(respuesta); //Muestra el usuario
        });
    }
    //Cajero
    crearCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_usuario, telefono } = req.body;
            const respuesta = yield database_1.default.query('INSERT INTO usuarios (nombre_usuario,telefono, id_tipoUsuario) VALUES (?,?,3);', [nombre_usuario, telefono]); //Se hace la consulta a la base de datos
            res.json(respuesta); //Muestra el usuario
        });
    }
}
const usuariosController = new UsuariosController(); //Se exporta la clase usuariosController
exports.default = usuariosController; //Se exporta la clase usuariosController
