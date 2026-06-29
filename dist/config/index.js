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
exports.App = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const db_1 = __importDefault(require("../database/db"));
const index_1 = require("../routes/index");
const swagger_1 = require("./swagger");
// Load environment variables from the .env file
dotenv_1.default.config();
class App {
    constructor(port) {
        this.port = port;
        this.routePrv = new index_1.Routes();
        this.app = (0, express_1.default)();
        this.settings();
        this.middlewares();
        this.routes();
        this.dbConnection(); // Call the database connection method
    }
    // Application settings
    settings() {
        this.app.set('port', this.port || process.env.PORT || 4000);
    }
    // Middleware configuration
    middlewares() {
        var _a;
        this.app.use((0, morgan_1.default)('dev'));
        // Cabeceras de seguridad (oculta X-Powered-By, etc.)
        this.app.use((0, helmet_1.default)());
        // CORS restringido: solo los orígenes definidos en CORS_ORIGIN (separados por coma).
        // Si no se define, por defecto solo el frontend local de desarrollo.
        this.app.use((0, cors_1.default)({
            origin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(",").map((o) => o.trim())) || ["http://localhost:4200"],
            credentials: true,
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    // Route configuration
    routes() {
        // Documentación interactiva de la API (Swagger UI)
        this.app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
        // Health check: permite a monitores/Docker verificar que el servidor está vivo
        this.app.get("/health", (_req, res) => {
            res.json({
                status: "ok",
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            });
        });
        this.routePrv.doctorRoutes.routes(this.app); // de las rutas se llama el public
        this.routePrv.specialtyRoutes.routes(this.app);
        this.routePrv.appointmentRoutes.routes(this.app);
        this.routePrv.patientRoutes.routes(this.app);
        this.routePrv.diagnosisRoutes.routes(this.app);
        this.routePrv.medicineRoutes.routes(this.app);
        this.routePrv.paymentRoutes.routes(this.app);
        this.routePrv.prescriptionRoutes.routes(this.app);
        this.routePrv.prescriptionDetailRoutes.routes(this.app);
        this.routePrv.procedureRoutes.routes(this.app);
        /*Autenticacion*/
        this.routePrv.userRoutes.routes(this.app);
        this.routePrv.roleRoutes.routes(this.app);
        this.routePrv.roleUserRoutes.routes(this.app);
        this.routePrv.refreshTokenRoutes.routes(this.app);
        this.routePrv.resourceRoutes.routes(this.app);
        this.routePrv.authRoutes.routes(this.app);
        this.routePrv.resourceRoleRoutes.routes(this.app);
    }
    // Method to connect and synchronize the database
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // force: false para que no se eliminen los registros
                yield db_1.default.sync({ force: false }); // Synchronize the database
                console.log("Database connected successfully");
            }
            catch (error) {
                console.error("Unable to connect to the database:", error);
            }
        });
    }
    // Start the server 
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.app.get('port'));
            console.log('Server on port', this.app.get('port'));
        });
    }
}
exports.App = App;
//# sourceMappingURL=index.js.map