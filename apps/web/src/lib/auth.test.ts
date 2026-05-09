import { describe, expect, it } from "vitest";

import { SignInSchema, SignUpSchema } from "./auth";

describe("SignInSchema", () => {
  it("accepts a well-formed email + non-empty password", () => {
    expect(SignInSchema.safeParse({ email: "amadou@react.sn", password: "anything" }).success).toBe(
      true,
    );
  });

  it("rejects malformed email", () => {
    const r = SignInSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.message.includes("invalide"))).toBe(true);
    }
  });

  it("rejects empty password (no zero-character bypass)", () => {
    expect(SignInSchema.safeParse({ email: "a@b.fr", password: "" }).success).toBe(false);
  });
});

describe("SignUpSchema", () => {
  it("accepts an 8-character password", () => {
    expect(SignUpSchema.safeParse({ email: "a@b.fr", password: "12345678" }).success).toBe(true);
  });

  it("rejects passwords shorter than 8 characters", () => {
    const r = SignUpSchema.safeParse({ email: "a@b.fr", password: "1234567" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.message.includes("8 caractères"))).toBe(true);
    }
  });

  it("does not impose a max length (passphrases must work)", () => {
    const longPassphrase = "correct-horse-battery-staple-extra-long-passphrase";
    expect(SignUpSchema.safeParse({ email: "a@b.fr", password: longPassphrase }).success).toBe(
      true,
    );
  });
});
