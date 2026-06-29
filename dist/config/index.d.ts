import { Application } from "express";
import { Routes } from "../routes/index";
export declare class App {
    private port?;
    app: Application;
    routePrv: Routes;
    constructor(port?: number | string | undefined);
    private settings;
    private middlewares;
    private routes;
    private dbConnection;
    listen(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map