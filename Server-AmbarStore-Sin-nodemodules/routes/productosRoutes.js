"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productosController_1 = __importDefault(require("../controllers/productosController"));
const auth_1 = require("../middleware/auth");
class ProductosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Seguridad
        this.router.get('/seguridad', auth_1.validarToken, productosController_1.default.list); //validarToken es un middleware que se ejecuta antes de usuariosController.seguridad
        //CRUD
        this.router.get('/', productosController_1.default.list);
        this.router.get('/:id', productosController_1.default.listOne);
        this.router.post('/create', productosController_1.default.create);
        this.router.put('/update/:id', productosController_1.default.update);
        this.router.delete('/delete/:id', productosController_1.default.delete);
        //Servicios Personalizados
        //this.router.get('/listar_productos_tipo',productosController.listarProductosTipo);
    }
}
const productosRoutes = new ProductosRoutes();
exports.default = productosRoutes.router;
