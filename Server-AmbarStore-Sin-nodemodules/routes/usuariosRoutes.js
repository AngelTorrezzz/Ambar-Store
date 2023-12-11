"use strict";
// Objetivo: Definir las rutas de la entidad Usuarios
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuariosController_1 = __importDefault(require("../controllers/usuariosController"));
const auth_1 = require("../middleware/auth");
class UsuariosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Seguridad
        this.router.get('/seguridad', auth_1.validarToken, usuariosController_1.default.list); //validarToken es un middleware que se ejecuta antes de usuariosController.seguridad
        //CRUD
        //this.router.get('/',usuariosController.list);
        //this.router.get('/:id',usuariosController.listOne);
        //this.router.post('/create',usuariosController.create);
        //this.router.put('/update/:id',usuariosController.update);
        //this.router.delete('/delete/:id',usuariosController.delete);
        //SERVICIOS Personalizados
        this.router.post('/validar_usuario', usuariosController_1.default.validarUsuario);
        this.router.get('/listar_clientes', usuariosController_1.default.listarClientes);
        //Administrador
        this.router.get('/listar_cajeros', usuariosController_1.default.listarCajeros);
        this.router.post('/crear_cajero', usuariosController_1.default.crearCajero);
        //Apartados
        this.router.post('/crear_cliente', usuariosController_1.default.crearCliente);
    }
}
const usuariosRoutes = new UsuariosRoutes();
exports.default = usuariosRoutes.router;
