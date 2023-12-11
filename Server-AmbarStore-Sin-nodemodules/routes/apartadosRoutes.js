"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apartadosController_1 = __importDefault(require("../controllers/apartadosController"));
const auth_1 = require("../middleware/auth");
class ApartadosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Seguridad
        this.router.get('/seguridad', auth_1.validarToken, apartadosController_1.default.list); //validarToken es un middleware que se ejecuta antes de usuariosController.seguridad
        //CRUD
        //this.router.get('/',apartadosController.list);
        //this.router.get('/:id',apartadosController.listOne);
        this.router.post('/create', apartadosController_1.default.create);
        this.router.put('/update/:id', apartadosController_1.default.update);
        //this.router.delete('/delete/:id',apartadosController.delete);
        //SERVICIOS Personalizados
        this.router.get('/listar_liquidados', apartadosController_1.default.getLiquidados);
        this.router.get('/listar_no_liquidados', apartadosController_1.default.getNoLiquidados);
    }
}
const apartadosRoutes = new ApartadosRoutes();
exports.default = apartadosRoutes.router;
