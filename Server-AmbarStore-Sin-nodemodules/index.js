"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const usuariosRoutes_1 = __importDefault(require("./routes/usuariosRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const productosRoutes_1 = __importDefault(require("./routes/productosRoutes"));
const tipos_productosRoutes_1 = __importDefault(require("./routes/tipos_productosRoutes"));
const descuentosRoutes_1 = __importDefault(require("./routes/descuentosRoutes"));
const rangos_clienteRoutes_1 = __importDefault(require("./routes/rangos_clienteRoutes"));
const apartadosRoutes_1 = __importDefault(require("./routes/apartadosRoutes"));
const abonosRoutes_1 = __importDefault(require("./routes/abonosRoutes"));
const carritosRoutes_1 = __importDefault(require("./routes/carritosRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)(); //Se inicializa la variable app
        this.config(); //Se ejecuta la funcion config
        this.routes(); //Se ejecuta la funcion routes
        this.app.use('/documentacion', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    }
    config() {
        this.app.set('port', process.env.PORT || 3001); //Se usa el puerto 3000 o el que se le asigne
        this.app.use((0, morgan_1.default)('dev')); //Se usa morgan para ver las peticiones que se hacen al servidor
        this.app.use((0, cors_1.default)()); //Se usa cors para que angular pueda acceder al servidor
        this.app.use(express_1.default.json()); //Se usa express para que el servidor pueda entender json
        this.app.use(express_1.default.urlencoded({ extended: false })); //Se usa express para que el servidor pueda entender los datos que se le envian desde un formulario
    }
    routes() {
        this.app.use(indexRoutes_1.default); //Se usa el objeto router de la clase indexRoutes
        //CRUDS
        this.app.use('/api/usuarios', usuariosRoutes_1.default); //Se usa el objeto router de la clase usuariosRoutes
        this.app.use('/api/productos', productosRoutes_1.default); //Se usa el objeto router de la clase rolesRoutes
        this.app.use('/api/descuentos', descuentosRoutes_1.default);
        this.app.use('/api/tipos_productos', tipos_productosRoutes_1.default);
        this.app.use('/api/rangos_cliente', rangos_clienteRoutes_1.default); //Dejar al final
        this.app.use('/api/apartados', apartadosRoutes_1.default);
        this.app.use('/api/abonos', abonosRoutes_1.default);
        this.app.use('/api/carritos', carritosRoutes_1.default); //Se usa el objeto router de la clase rolesRoutes
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port')); //Muestra un mensaje en consola
        });
    }
}
//Script
const server = new Server();
server.start();
