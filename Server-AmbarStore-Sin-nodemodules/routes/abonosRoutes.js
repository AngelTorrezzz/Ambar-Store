"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class AbonosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Seguridad
        //this.router.get('/seguridad',validarToken,abonosController.list); //validarToken es un middleware que se ejecuta antes de usuariosController.seguridad
        //SERVICIOS Personalizados
    }
}
const abonosRoutes = new AbonosRoutes();
exports.default = abonosRoutes.router;
