import { loginSchema, registerSchema } from "./auth.schema";

describe("loginSchema", () => {
  it("acepta credenciales válidas", () => {
    const r = loginSchema.safeParse({ email: "ker@test.com", password: "secret" });
    expect(r.success).toBe(true);
  });

  it("rechaza un email con formato inválido", () => {
    const r = loginSchema.safeParse({ email: "no-es-email", password: "secret" });
    expect(r.success).toBe(false);
  });

  it("rechaza una contraseña vacía", () => {
    const r = loginSchema.safeParse({ email: "ker@test.com", password: "" });
    expect(r.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("acepta un registro válido", () => {
    const r = registerSchema.safeParse({
      username: "ker",
      email: "ker@test.com",
      password: "123456",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza una contraseña de menos de 6 caracteres", () => {
    const r = registerSchema.safeParse({
      username: "ker",
      email: "ker@test.com",
      password: "123",
    });
    expect(r.success).toBe(false);
  });

  it("rechaza un username de menos de 2 caracteres", () => {
    const r = registerSchema.safeParse({
      username: "k",
      email: "ker@test.com",
      password: "123456",
    });
    expect(r.success).toBe(false);
  });

  it("elimina campos no definidos (previene asignación masiva)", () => {
    const r = registerSchema.safeParse({
      username: "ker",
      email: "ker@test.com",
      password: "123456",
      is_active: "INACTIVE",
      isAdmin: true,
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data).not.toHaveProperty("isAdmin");
    }
  });
});
