import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import sequelize from "../database/db";
import { Routes } from "../routes/index";
import { swaggerSpec } from "./swagger";

// Load environment variables from the .env file
dotenv.config();

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();

    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection(); // Call the database connection method
  }

  // Application settings
  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  // Middleware configuration
  private middlewares(): void {
    this.app.use(morgan('dev'));
    // Cabeceras de seguridad (oculta X-Powered-By, etc.)
    this.app.use(helmet());
    // CORS restringido: solo los orígenes definidos en CORS_ORIGIN (separados por coma).
    // Si no se define, por defecto solo el frontend local de desarrollo.
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || ["http://localhost:4200"],
      credentials: true,
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  // Route configuration
  private routes(): void {
    // Documentación interactiva de la API (Swagger UI)
    this.app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
  private async dbConnection(): Promise<void> {
    try {
      // force: false para que no se eliminen los registros
      await sequelize.sync({ force: false   }); // Synchronize the database
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  // Start the server 
  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log('Server on port', this.app.get('port'));
  }
}