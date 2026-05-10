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

describe("SignUpSchema — entrepreneur", () => {
  it("accepts a basic entrepreneur signup (adult)", () => {
    const r = SignUpSchema.safeParse({
      email: "a@b.fr",
      password: "passpass",
      profile_type: "entrepreneur",
      display_name: "Aïssatou Diop",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.profile_type).toBe("entrepreneur");
      // is_minor and parental_consent default to false (transform of undefined)
      if (r.data.profile_type === "entrepreneur") {
        expect(r.data.is_minor).toBe(false);
        expect(r.data.parental_consent).toBe(false);
      }
    }
  });

  it("requires parental_consent when is_minor is set", () => {
    const r = SignUpSchema.safeParse({
      email: "minor@b.fr",
      password: "passpass",
      profile_type: "entrepreneur",
      display_name: "Mineur",
      is_minor: "on",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.message.includes("consentement parental"))).toBe(true);
    }
  });

  it("accepts a minor with parental_consent checked", () => {
    const r = SignUpSchema.safeParse({
      email: "minor@b.fr",
      password: "passpass",
      profile_type: "entrepreneur",
      display_name: "Mineur",
      is_minor: "on",
      parental_consent: "on",
      parent_email: "parent@b.fr",
    });
    expect(r.success).toBe(true);
  });

  it("rejects passwords shorter than 8 characters", () => {
    const r = SignUpSchema.safeParse({
      email: "a@b.fr",
      password: "1234567",
      profile_type: "entrepreneur",
      display_name: "Aïssatou",
    });
    expect(r.success).toBe(false);
  });
});

describe("SignUpSchema — organisation / government / partner", () => {
  it("requires organisation_name for organisation type", () => {
    expect(
      SignUpSchema.safeParse({
        email: "a@b.fr",
        password: "passpass",
        profile_type: "organisation",
        display_name: "Contact",
      }).success,
    ).toBe(false);

    expect(
      SignUpSchema.safeParse({
        email: "a@b.fr",
        password: "passpass",
        profile_type: "organisation",
        display_name: "Contact",
        organisation_name: "ONG ABC",
      }).success,
    ).toBe(true);
  });

  it("requires ministry_name for government type (government_role optional)", () => {
    expect(
      SignUpSchema.safeParse({
        email: "a@b.fr",
        password: "passpass",
        profile_type: "government",
        display_name: "Agent",
      }).success,
    ).toBe(false);

    expect(
      SignUpSchema.safeParse({
        email: "a@b.fr",
        password: "passpass",
        profile_type: "government",
        display_name: "Agent",
        ministry_name: "Ministère du Numérique",
      }).success,
    ).toBe(true);
  });

  it("requires partner_org_name for partner type", () => {
    expect(
      SignUpSchema.safeParse({
        email: "a@b.fr",
        password: "passpass",
        profile_type: "partner",
        display_name: "Contact partenaire",
      }).success,
    ).toBe(false);

    expect(
      SignUpSchema.safeParse({
        email: "a@b.fr",
        password: "passpass",
        profile_type: "partner",
        display_name: "Contact partenaire",
        partner_org_name: "GIZ",
      }).success,
    ).toBe(true);
  });

  it("rejects admin profile_type (admin path is not public)", () => {
    expect(
      SignUpSchema.safeParse({
        email: "a@b.fr",
        password: "passpass",
        profile_type: "admin",
        display_name: "Admin",
      }).success,
    ).toBe(false);
  });
});

describe("SignUpSchema — common", () => {
  it("requires display_name for every type", () => {
    expect(
      SignUpSchema.safeParse({
        email: "a@b.fr",
        password: "passpass",
        profile_type: "entrepreneur",
      }).success,
    ).toBe(false);
  });

  it("does not impose a max length on the password (passphrases must work)", () => {
    const r = SignUpSchema.safeParse({
      email: "a@b.fr",
      password: "correct-horse-battery-staple-extra-long-passphrase",
      profile_type: "entrepreneur",
      display_name: "Aïssatou",
    });
    expect(r.success).toBe(true);
  });
});
