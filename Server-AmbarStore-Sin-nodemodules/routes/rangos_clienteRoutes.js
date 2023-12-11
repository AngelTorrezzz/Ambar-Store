"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rangos_clienteController_1 = __importDefault(require("../controllers/rangos_clienteController"));
const auth_1 = require("../middleware/auth");
class Rangos_clienteRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Seguridad
        this.router.get('/seguridad', auth_1.validarToken, rangos_clienteController_1.default.list); //validarToken es un middleware que se ejecuta antes de usuariosController.seguridad
        //CRUD
        this.router.get('/', rangos_clienteController_1.default.list);
        this.router.get('/:id', rangos_clienteController_1.default.listOne);
        this.router.post('/create', rangos_clienteController_1.default.create);
        this.router.put('/update/:id', rangos_clienteController_1.default.update);
        this.router.delete('/delete/:id', rangos_clienteController_1.default.delete);
        //Servicios
    }
}
const rangos_clienteRoutes = new Rangos_clienteRoutes();
exports.default = rangos_clienteRoutes.router;
