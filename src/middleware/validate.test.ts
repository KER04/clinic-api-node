import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "./validate";

const schema = z.object({ name: z.string().min(2, "Nombre muy corto") });

function buildRes() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("validate middleware", () => {
  it("llama next() cuando el body es válido", () => {
    const req = { body: { name: "Ker" } } as Request;
    const res = buildRes();
    const next = jest.fn() as unknown as NextFunction;

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("responde 400 con errores por campo cuando el body es inválido", () => {
    const req = { body: { name: "K" } } as Request;
    const res = buildRes();
    const next = jest.fn() as unknown as NextFunction;

    validate(schema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: { name: ["Nombre muy corto"] } })
    );
  });

  it("reemplaza req.body con los datos validados (elimina campos no definidos)", () => {
    const req = { body: { name: "Ker", isAdmin: true } } as Request;
    const res = buildRes();
    const next = jest.fn() as unknown as NextFunction;

    validate(schema)(req, res, next);

    expect(req.body).toEqual({ name: "Ker" });
  });
});
