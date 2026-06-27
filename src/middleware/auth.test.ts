import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// --- Mocks: evitan tocar la base de datos y la clave real ---
jest.mock("jsonwebtoken");
jest.mock("../config/jwt", () => ({ JWT_SECRET: "test-secret" }));
jest.mock("../models/authorization/user", () => ({
  User: { findOne: jest.fn(), findByPk: jest.fn() },
}));
jest.mock("../models/authorization/resource", () => ({
  Resource: { findAll: jest.fn() },
}));
jest.mock("../models/authorization/role", () => ({ Role: {} }));
jest.mock("../models/authorization/ResourceRole", () => ({ ResourceRole: {} }));
jest.mock("../models/authorization/RoleUser", () => ({ RoleUser: {} }));
jest.mock("../models/authorization/relation", () => ({}));

import { authMiddleware, validateAuthorization } from "./auth";
import { User } from "../models/authorization/user";
import { Resource } from "../models/authorization/resource";

const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedUser = User as unknown as { findOne: jest.Mock; findByPk: jest.Mock };
const mockedResource = Resource as unknown as { findAll: jest.Mock };

function buildReqRes(
  headers: Record<string, string> = {},
  path = "/api/test",
  method = "GET"
) {
  const req = {
    header: (h: string) => headers[h],
    baseUrl: "",
    path,
    method,
  } as unknown as Request;

  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  const next = jest.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe("authMiddleware (RBAC)", () => {
  it("responde 401 si no se envía token", async () => {
    const { req, res, next } = buildReqRes();
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responde 401 si el token expiró", async () => {
    mockedJwt.verify.mockImplementation(() => {
      const e = new Error("expired") as Error & { name: string };
      e.name = "TokenExpiredError";
      throw e;
    });
    const { req, res, next } = buildReqRes({ Authorization: "Bearer x" });
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responde 401 si el token es inválido", async () => {
    mockedJwt.verify.mockImplementation(() => {
      const e = new Error("bad") as Error & { name: string };
      e.name = "JsonWebTokenError";
      throw e;
    });
    const { req, res, next } = buildReqRes({ Authorization: "Bearer x" });
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("responde 401 si el usuario no existe o está inactivo", async () => {
    mockedJwt.verify.mockReturnValue({ id: 1 } as never);
    mockedUser.findOne.mockResolvedValue(null);
    const { req, res, next } = buildReqRes({ Authorization: "Bearer x" });
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("llama next() y setea currentUser cuando está autorizado", async () => {
    const fakeUser = { id: 1, is_active: "ACTIVE" };
    mockedJwt.verify.mockReturnValue({ id: 1 } as never);
    mockedUser.findOne.mockResolvedValue(fakeUser);
    // validateAuthorization: recurso que matchea la ruta + usuario con rol válido
    mockedResource.findAll.mockResolvedValue([{ id: 10, path: "/api/test" }]);
    mockedUser.findByPk.mockResolvedValue({ id: 1 });

    const { req, res, next } = buildReqRes({ Authorization: "Bearer x" });
    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as Request & { currentUser?: unknown }).currentUser).toBe(fakeUser);
  });

  it("responde 403 si el usuario no está autorizado para el recurso", async () => {
    mockedJwt.verify.mockReturnValue({ id: 1 } as never);
    mockedUser.findOne.mockResolvedValue({ id: 1, is_active: "ACTIVE" });
    mockedResource.findAll.mockResolvedValue([{ id: 10, path: "/api/test" }]);
    mockedUser.findByPk.mockResolvedValue(null); // no tiene rol con acceso

    const { req, res, next } = buildReqRes({ Authorization: "Bearer x" });
    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("validateAuthorization", () => {
  it("devuelve false si ningún recurso coincide con la ruta", async () => {
    mockedResource.findAll.mockResolvedValue([{ id: 1, path: "/api/otro" }]);
    const result = await validateAuthorization(1, "/api/test", "GET");
    expect(result).toBe(false);
  });

  it("devuelve true si el recurso coincide y el usuario tiene rol con acceso", async () => {
    mockedResource.findAll.mockResolvedValue([{ id: 1, path: "/api/test" }]);
    mockedUser.findByPk.mockResolvedValue({ id: 1 });
    const result = await validateAuthorization(1, "/api/test", "GET");
    expect(result).toBe(true);
  });

  it("devuelve false si el recurso coincide pero el usuario no tiene rol", async () => {
    mockedResource.findAll.mockResolvedValue([{ id: 1, path: "/api/test" }]);
    mockedUser.findByPk.mockResolvedValue(null);
    const result = await validateAuthorization(1, "/api/test", "GET");
    expect(result).toBe(false);
  });
});
