"use strict";
// Objetivo: Crear rutas iniciales
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); //Impota rutas de express
class IndexRoutes {
    constructor() {
        this.router = (0, express_1.Router)(); //Router es un objeto que permite crear rutas
        this.config(); //Ejecuta el metodo config
    }
    config() {
        this.router.get('/yo/', (req, res) => res.send('Pelon')); //Crea una ruta inicial
    }
}
const indexRoutes = new IndexRoutes(); //Instancia la clase
exports.default = indexRoutes.router; //Exporta el objeto router de la clase, la hace publica o global
