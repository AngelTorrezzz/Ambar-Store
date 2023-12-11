"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipos_productosController_1 = __importDefault(require("../controllers/tipos_productosController"));
const auth_1 = require("../middleware/auth");
class Tipos_ProductosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Seguridad
        this.router.get('/seguridad', auth_1.validarToken, tipos_productosController_1.default.list); //validarToken es un middleware que se ejecuta antes de usuariosController.seguridad
        //CRUD
        this.router.get('/', tipos_productosController_1.default.list);
        this.router.get('/:id', tipos_productosController_1.default.listOne);
        this.router.post('/create', tipos_productosController_1.default.create);
        this.router.put('/update/:id', tipos_productosController_1.default.update);
        this.router.delete('/delete/:id', tipos_productosController_1.default.delete);
        //Servicios
    }
}
const tipos_productosRoutes = new Tipos_ProductosRoutes();
exports.default = tipos_productosRoutes.router;
