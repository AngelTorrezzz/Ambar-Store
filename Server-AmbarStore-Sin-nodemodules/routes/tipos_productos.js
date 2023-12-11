"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
class Tipos_ProductosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Seguridad
        this.router.get('/seguridad', auth_1.validarToken, productosController.list); //validarToken es un middleware que se ejecuta antes de usuariosController.seguridad
        //CRUD
        this.router.get('/', productosController.list);
        this.router.get('/:id', productosController.listOne);
        this.router.post('/create', productosController.create);
        this.router.put('/update/:id', productosController.update);
        this.router.delete('/delete/:id', productosController.delete);
        //Servicios
    }
}
const tipos_productosRoutes = new Tipos_ProductosRoutes();
exports.default = tipos_productosRoutes.router;
