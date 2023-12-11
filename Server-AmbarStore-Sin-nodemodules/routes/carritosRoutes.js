"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carritosController_1 = __importDefault(require("../controllers/carritosController"));
class CarritosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Seguridad
        //this.router.get('/seguridad',validarToken,carritosController.list); //validarToken es un middleware que se ejecuta antes de usuariosController.seguridad
        //SERVICIOS Personalizados
        //Vendedor
        this.router.post('/listar_ventas_del_dia', carritosController_1.default.listarVentasDelDia); //Se muestran las ventas
        this.router.post('/crear_carrito', carritosController_1.default.crearCarrito); //Se crea un carrito
        this.router.post('/agregar_un_producto', carritosController_1.default.agregarProducto); //Se agrega un producto al carrito
        this.router.get('/mostrar_carrito/:id', carritosController_1.default.mostrarCarrito); //Se muestra el carrito
        this.router.post('/eliminar_todo_el_producto', carritosController_1.default.eliminarTodoElProducto); //Se elimina un producto del carrito
        this.router.post('/eliminar_un_producto', carritosController_1.default.eliminarProducto); //Se elimina un producto del carrito
        this.router.post('/comprar_carrito/:id', carritosController_1.default.comprarCarrito); //Se compra el carrito
        //Administrador
        this.router.post('/listar_ventas_dia', carritosController_1.default.listarVentasDia); //Se muestran las ventas
        this.router.post('/ticket_promedio_dia', carritosController_1.default.ticketPromedioDia); //Se muestra el ticket promedio del dia
        this.router.post('/listar_ventas_semana', carritosController_1.default.listarVentasSemana); //Se muestran las ventas
        this.router.post('/ticket_promedio_semana', carritosController_1.default.ticketPromedioSemana); //Se muestra el ticket promedio de la semana
        this.router.post('/listar_ventas_mes', carritosController_1.default.listarVentasMes); //Se muestran las ventas
        this.router.post('/ticket_promedio_mes', carritosController_1.default.ticketPromedioMes); //Se muestra el ticket promedio del mes
        this.router.post('/listar_ventas_anio', carritosController_1.default.listarVentasAnio); //Se muestran las ventas
        this.router.post('/ticket_promedio_anio', carritosController_1.default.ticketPromedioAnio); //Se muestra el ticket promedio del año
        this.router.get('/listar_ventas_siempre', carritosController_1.default.listarVentasSiempre); //Se muestran las ventas
        this.router.get('/ticket_promedio_siempre', carritosController_1.default.ticketPromedioSiempre); //Se muestra el ticket promedio de siempre
    }
}
const carritosRoutes = new CarritosRoutes();
exports.default = carritosRoutes.router;
