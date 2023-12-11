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
class Tipos_ProductosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM tipos_productos'); //Se hace la consulta a la base de datos
            res.json(respuesta); //Muestra el usuario
        });
    }
    //CRUD
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //Se obtiene el id de los parametros de la peticion
            const respuesta = yield database_1.default.query('SELECT * FROM tipos_productos WHERE tipos_productos.id = ?', [id]); //Se hace la consulta a la base de datos
            if (respuesta.length > 0) { //Si hay un usuario con ese id
                res.json(respuesta[0]); //Muestra el usuario
                return;
            }
            res.status(404).json({ 'mensaje': 'Tipo de Producto no encontrado' }); //Si no hay un usuario con ese id
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO tipos_productos set ?", [req.body]); //Se hace la consulta a la base de datos
            res.json(resp); //Se muestra la respuesta
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //Se obtiene el id de los parametros de la peticion
            console.log(req.params); //Se muestra el id
            const resp = yield database_1.default.query("UPDATE tipos_productos set ? WHERE tipos_productos.id = ?", [req.body, id]); //Se hace la consulta a la base de datos
            //req.body;
            res.json(resp); //Se muestra la respuesta
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //Se obtiene el id de los parametros de la peticion
            const resp = yield database_1.default.query(`DELETE FROM tipos_productos WHERE tipos_productos.id = ${id}`); //Se hace la consulta a la base de datos
            res.json(resp); //Se muestra la respuesta
        });
    }
}
const tipos_productosController = new Tipos_ProductosController(); //Se exporta la clase usuariosController
exports.default = tipos_productosController; //Se exporta la clase usuariosController
