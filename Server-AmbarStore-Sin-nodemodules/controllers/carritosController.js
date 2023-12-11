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
class CarritosController {
    //SERVICIOS Personalizados
    //Vendedor
    listarVentasDelDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT carritos.monto_eventual_sin_descuento AS "total_sin_descuento", carritos.monto_eventual AS "total", carritos.fecha, carritos.hora, usuarios.nombre_usuario AS "cajero" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND carritos.fecha = ?;', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    crearCarrito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Punto de venta
            //Se debe crear un carrito con confirmado = 0, fecha en que se creo, hora en que se creo, monto_eventual = 0, costo_eventual y id del vendedor que lo creo
            //Venta online
            //Se debe crear un carrito con confirmado = 0, fecha en que se creo, hora en que se creo, monto_eventual = 0, costo_eventual y id del cliente que lo creo 
            const respuesta = yield database_1.default.query("INSERT INTO carritos set ?", [req.body]);
            res.json(respuesta); //Se muestra la respuesta
        });
    }
    agregarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //cantidad siempre es 1 y es necesario para que la consulta de INSERT INTO carritos_productos funcione
            //Cuando se listen los productos se debe verificar que haya stock suficiente para agregarlo sino deshabilitar el boton de agregar (1) al carrito
            //Como se tiene el atributo cantidad en carritos_productos se debe verificar que no exista un producto con el mismo id_producto con el mismo id_carrito si es asi se debe sumar 1 a la cantidad sino se debe crear un nuevo registro en carritos_productos con el id_carrito, id_producto y cantidad = 1
            const { id_carrito, id_producto, cantidad } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT * FROM carritos WHERE carritos.id = ?', [id_carrito]);
            if (respuesta.length > 0) { //Si hay un carrito con ese id
                const respuesta2 = yield database_1.default.query('SELECT * FROM productos WHERE productos.id = ?', [id_producto]);
                if (respuesta2.length > 0) { //Si hay un producto con ese id
                    const respuesta3 = yield database_1.default.query('SELECT * FROM carritos_productos WHERE carritos_productos.id_carrito = ? AND carritos_productos.id_producto = ?', [id_carrito, id_producto]);
                    if (respuesta3.length > 0) { //Si hay un producto con ese id en ese carrito
                        //En esta consulta se suma 1 a la cantidad de productos en el carrito para el producto con el id_producto y el id_carrito
                        const respuesta4 = yield database_1.default.query('UPDATE carritos_productos set carritos_productos.cantidad = carritos_productos.cantidad + ? WHERE carritos_productos.id_carrito = ? AND carritos_productos.id_producto = ?', [cantidad, id_carrito, id_producto]);
                        res.json({ 'mensaje': 'Producto actualizado en el carrito' }); //Se muestra la respuesta
                        return;
                    }
                    const respuesta5 = yield database_1.default.query("INSERT INTO carritos_productos set ?", [req.body]);
                    res.json({ 'mensaje': 'Producto agregado al carrito' }); //Se muestra la respuesta
                    return;
                }
                res.status(404).json({ 'mensaje': 'Producto no encontrado' }); //Si no hay un producto con ese id
                return;
            }
            res.status(404).json({ 'mensaje': 'Carrito no encontrado' }); //Si no hay un carrito con ese id
        });
    }
    mostrarCarrito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Debe listar todo el carrito con el s, descripcion, cantidad y precio subtotal por producto. Los id_carrito, id_producto sirven como referencia para eliminar o actualizar un producto del carrito
            const { id } = req.params; //Se obtiene el id de los parametros de la peticion
            const respuesta = yield database_1.default.query('SELECT * FROM carritos WHERE carritos.id = ?', [id]);
            if (respuesta.length > 0) { //Si hay un carrito con ese id
                const respuesta2 = yield database_1.default.query('SELECT productos.producto, productos.descripcion, carritos_productos.cantidad, SUM(productos.precio * carritos_productos.cantidad)AS "total_sin_descuento", descuentos.porcentaje AS "descuento", SUM((productos.precio * (100-descuentos.porcentaje)/100) * carritos_productos.cantidad)AS "total", carritos.id AS "id_carrito", productos.id AS "id_producto" FROM productos, carritos_productos, carritos, descuentos WHERE carritos_productos.id_carrito = carritos.id AND carritos_productos.id_carrito = ? AND carritos_productos.id_producto = productos.id AND productos.id_tipoDescuento = descuentos.id GROUP BY productos.producto;', [id]);
                if (respuesta2.length > 0) { //Si hay un producto con ese id en ese carrito
                    res.json(respuesta2); //Se muestra la respuesta
                    return;
                }
                res.status(404).json({ 'mensaje': 'No hay productos en el carrito' }); //Si no hay un producto con ese id
                return;
            }
            res.status(404).json({ 'mensaje': 'Carrito no encontrado' }); //Si no hay un carrito con ese id
        });
    }
    eliminarTodoElProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Debe eliminar todo el producto del carrito con el id_carrito y el id_producto en la tabla carritos_productos
            const { id_carrito, id_producto } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT * FROM carritos WHERE carritos.id = ?', [id_carrito]);
            if (respuesta.length > 0) { //Si hay un carrito con ese id
                const respuesta2 = yield database_1.default.query('SELECT * FROM productos WHERE productos.id = ?', [id_producto]);
                if (respuesta2.length > 0) { //Si hay un producto con ese id
                    const respuesta3 = yield database_1.default.query('SELECT * FROM carritos_productos WHERE carritos_productos.id_carrito = ? AND carritos_productos.id_producto = ?', [id_carrito, id_producto]);
                    if (respuesta3.length > 0) { //Si hay un producto con ese id en ese carrito
                        //En esta consulta se elimina el producto del carrito con el id_carrito y el id_producto
                        const respuesta4 = yield database_1.default.query('DELETE FROM carritos_productos WHERE carritos_productos.id_carrito = ? AND carritos_productos.id_producto = ?', [id_carrito, id_producto]);
                        res.json({ 'mensaje': 'Producto eliminado del carrito' }); //Se muestra la respuesta
                        return;
                    }
                    res.status(404).json({ 'mensaje': 'Producto no encontrado en el carrito' }); //Si no hay un producto con ese id en ese carrito
                    return;
                }
                res.status(404).json({ 'mensaje': 'Producto no encontrado' }); //Si no hay un producto con ese id
                return;
            }
            res.status(404).json({ 'mensaje': 'Carrito no encontrado' }); //Si no hay un carrito con ese id
        });
    }
    eliminarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Debe eliminar una unidad del producto del carrito con el id_carrito y el id_producto en la tabla carritos_productos
            const { id_carrito, id_producto } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT * FROM carritos WHERE carritos.id = ?', [id_carrito]);
            if (respuesta.length > 0) { //Si hay un carrito con ese id
                const respuesta2 = yield database_1.default.query('SELECT * FROM productos WHERE productos.id = ?', [id_producto]);
                if (respuesta2.length > 0) { //Si hay un producto con ese id
                    const respuesta3 = yield database_1.default.query('SELECT * FROM carritos_productos WHERE carritos_productos.id_carrito = ? AND carritos_productos.id_producto = ?', [id_carrito, id_producto]);
                    if (respuesta3.length > 0) { //Si hay un producto con ese id en ese carrito
                        //En esta consulta se elimina una unidad del producto del carrito con el id_carrito y el id_producto
                        const respuesta4 = yield database_1.default.query('UPDATE carritos_productos set carritos_productos.cantidad = carritos_productos.cantidad - 1 WHERE carritos_productos.id_carrito = ? AND carritos_productos.id_producto = ?', [id_carrito, id_producto]);
                        res.json({ 'mensaje': 'Producto eliminado del carrito' }); //Se muestra la respuesta
                        return;
                    }
                    res.status(404).json({ 'mensaje': 'Producto no encontrado en el carrito' }); //Si no hay un producto con ese id en ese carrito
                    return;
                }
                res.status(404).json({ 'mensaje': 'Producto no encontrado' }); //Si no hay un producto con ese id
                return;
            }
            res.status(404).json({ 'mensaje': 'Carrito no encontrado' }); //Si no hay un carrito con ese id
        });
    }
    comprarCarrito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //El stock de los productos se debe actualizar restando la cantidad de productos comprados a la cantidad actual de productos en el inventario y se realiza cuando se confirma la compra del carrito
            //Debe actualizar el carrito con confirmado = 1, fecha en que se compro, hora en que se compro, monto_eventual = total relativo a los precios de los productos en ese momento, costo_eventual = costo_total relativo a los costos de los productos en ese momento y id del vendedor que lo vendio(Punto de Venta) o id del cliente que lo compro(Venta online) y el stock de los productos en la tabla productos
            const { id } = req.params; //Se obtiene el id de los parametros de la peticion
            const { fecha, hora } = req.body;
            const respuesta = yield database_1.default.query('SELECT * FROM carritos WHERE carritos.id = ?', [id]);
            if (respuesta.length > 0) { //Si hay un carrito con ese id
                const respuesta2 = yield database_1.default.query('SELECT * FROM carritos_productos WHERE carritos_productos.id_carrito = ?', [id]);
                if (respuesta2.length > 0) { //Si hay un producto con ese id en ese carrito
                    //En esta consulta se obtiene una lista del stock actualizado de todos los productos en el carrito 
                    const respuesta3 = yield database_1.default.query('SELECT productos.id, productos.producto, (productos.cantidad - carritos_productos.cantidad) AS "cantidad_actualizada" FROM productos, carritos_productos WHERE productos.id = carritos_productos.id_producto;');
                    //Mientras haya elementos en la lista de productos en el carrito
                    while (respuesta3.length > 0) {
                        //En esta consulta se actualiza el stock de los productos con la cantidad_actualizada
                        const respuesta6 = yield database_1.default.query('UPDATE productos SET productos.cantidad = ? WHERE productos.id = ?;', [respuesta3[0].cantidad_actualizada, respuesta3[0].id]);
                        respuesta3.shift(); //Se elimina el primer elemento de la lista
                    }
                    //En esta consulta se obtiene el monto_eventual (relativo al precio del producto en el momento que se hizo la venta) de todos los productos en el carrito
                    const respuesta4 = yield database_1.default.query('SELECT SUM(productos.precio * carritos_productos.cantidad)AS "total_sin_descuento", SUM((productos.precio * (100-descuentos.porcentaje)/100) * carritos_productos.cantidad)AS "total" FROM productos, carritos, carritos_productos, descuentos WHERE productos.id = carritos_productos.id_producto AND carritos.id = carritos_productos.id_carrito AND carritos_productos.id_carrito = ? AND productos.id_tipoDescuento = descuentos.id;', [id]);
                    const total_sin_descuento = respuesta4[0].total_sin_descuento;
                    const total = respuesta4[0].total;
                    //En esta consulta se obtiene el costo_eventual (relativo al costo del producto en el momento que se hizo la venta) de todos los productos en el carrito
                    const respuesta5 = yield database_1.default.query('SELECT SUM(productos.costo * carritos_productos.cantidad) AS "total_costos" FROM productos, carritos, carritos_productos WHERE productos.id = carritos_productos.id_producto AND carritos.id = carritos_productos.id_carrito AND carritos_productos.id_carrito = ?;', [id]);
                    const total_costos = respuesta5[0].total_costos;
                    //En esta consulta se actualiza el carrito con confirmado = 1, fecha en que se compro, hora en que se compro, monto_eventual = total relativo a los precios de los productos en ese momento y id del vendedor que lo vendio(Punto de Venta) o id del cliente que lo compro(Venta online)
                    const respuesta6 = yield database_1.default.query('UPDATE carritos SET carritos.confirmado = 1, carritos.fecha = ?, carritos.hora = ?, carritos.monto_eventual_sin_descuento = ?, carritos.monto_eventual = ?, carritos.costo_eventual = ? WHERE carritos.id = ?;', [fecha, hora, total_sin_descuento, total, total_costos, id]);
                    res.json({ 'mensaje': 'Carrito comprado' }); //Se muestra la respuesta
                    return;
                }
                res.status(404).json({ 'mensaje': 'No hay productos en el carrito' }); //Si no hay un producto con ese id
                return;
            }
            res.status(404).json({ 'mensaje': 'Carrito no encontrado' }); //Si no hay un carrito con ese id
        });
    }
    //Administrador
    //Los peridos de tiempo se deben calcular con la fecha que se envia en la peticion
    listarVentasDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT carritos.monto_eventual_sin_descuento AS "total_sin_descuento", carritos.monto_eventual AS "total", (carritos.costo_eventual) AS "costo", (carritos.monto_eventual - carritos.costo_eventual) AS "ganancia", carritos.fecha, carritos.hora, usuarios.nombre_usuario AS "cajero" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND carritos.fecha = ?;', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    ticketPromedioDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT AVG(carritos.monto_eventual) AS "ticket_promedio" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND carritos.fecha = ?;', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    //las semanas empiezan el domingo y terminan el sabado
    listarVentasSemana(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT carritos.monto_eventual_sin_descuento AS "total_sin_descuento", carritos.monto_eventual AS "total", (carritos.costo_eventual) AS "costo", (carritos.monto_eventual - carritos.costo_eventual) AS "ganancia", carritos.fecha, carritos.hora, usuarios.nombre_usuario AS "cajero" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND YEARWEEK(carritos.fecha) = YEARWEEK(?);', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    ticketPromedioSemana(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT AVG(carritos.monto_eventual) AS "ticket_promedio" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND YEARWEEK(carritos.fecha) = YEARWEEK(?);', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    listarVentasMes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT carritos.monto_eventual_sin_descuento AS "total_sin_descuento", carritos.monto_eventual AS "total", (carritos.costo_eventual) AS "costo", (carritos.monto_eventual - carritos.costo_eventual) AS "ganancia", carritos.fecha, carritos.hora, usuarios.nombre_usuario AS "cajero" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND MONTH(carritos.fecha) = MONTH(?);', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    ticketPromedioMes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT AVG(carritos.monto_eventual) AS "ticket_promedio" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND MONTH(carritos.fecha) = MONTH(?);', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    listarVentasAnio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT carritos.monto_eventual_sin_descuento AS "total_sin_descuento", carritos.monto_eventual AS "total", (carritos.costo_eventual) AS "costo", (carritos.monto_eventual - carritos.costo_eventual) AS "ganancia", carritos.fecha, carritos.hora, usuarios.nombre_usuario AS "cajero" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND YEAR(carritos.fecha) = YEAR(?);', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    ticketPromedioAnio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.body; //Se obtienen los datos de la peticion
            const respuesta = yield database_1.default.query('SELECT AVG(carritos.monto_eventual) AS "ticket_promedio" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1 AND YEAR(carritos.fecha) = YEAR(?);', [fecha]); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    listarVentasSiempre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT carritos.monto_eventual_sin_descuento AS "total_sin_descuento", carritos.monto_eventual AS "total", (carritos.costo_eventual) AS "costo", (carritos.monto_eventual - carritos.costo_eventual) AS "ganancia", carritos.fecha, carritos.hora, usuarios.nombre_usuario AS "cajero" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1;'); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
    ticketPromedioSiempre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT AVG(carritos.monto_eventual) AS "ticket_promedio" FROM carritos, usuarios WHERE carritos.id_vendedor = usuarios.id AND carritos.confirmado = 1;'); //Se hace la consulta a la base de datos
            res.json(respuesta);
        });
    }
}
const carritosController = new CarritosController(); //Se exporta la clase usuariosController
exports.default = carritosController; //Se exporta la clase usuariosController
