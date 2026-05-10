import { describe, expect, it } from "vitest";

import {
  initialVerificationStatus,
  isProfilePubliclyVisible,
  isProfileTypeSlug,
  isVerificationStatus,
  PROFILE_TYPES,
  VERIFICATION_STATUSES,
  getProfileType,
  type ProfileTypeSlug,
} from "./profiles";

describe("PROFILE_TYPES", () => {
  it("contains exactly 5 profile types per D020 / roadmap row 77", () => {
    expect(PROFILE_TYPES).toHaveLength(5);
  });

  it("includes all 5 documented types", () => {
    const slugs = PROFILE_TYPES.map((p) => p.slug);
    expect(slugs).toEqual([
      "entrepreneur",
      "organisation",
      "government",
      "partner",
      "admin",
    ] satisfies ProfileTypeSlug[]);
  });

  it("every slug is URL-safe + every label populated", () => {
    for (const t of PROFILE_TYPES) {
      expect(t.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(t.fr.length).toBeGreaterThan(0);
      expect(t.en.length).toBeGreaterThan(0);
      expect(t.description.length).toBeGreaterThan(0);
    }
  });

  it("entrepreneur + admin skip manual verification; organisation + government + partner require it", () => {
    expect(getProfileType("entrepreneur")?.requiresManualVerification).toBe(false);
    expect(getProfileType("admin")?.requiresManualVerification).toBe(false);
    expect(getProfileType("organisation")?.requiresManualVerification).toBe(true);
    expect(getProfileType("government")?.requiresManualVerification).toBe(true);
    expect(getProfileType("partner")?.requiresManualVerification).toBe(true);
  });

  it("entrepreneur min age + parental-consent window match D020", async () => {
    const { ENTREPRENEUR_MIN_AGE, PARENTAL_CONSENT_MAX_AGE } = await import("./profiles");
    expect(ENTREPRENEUR_MIN_AGE).toBe(15);
    expect(PARENTAL_CONSENT_MAX_AGE).toBe(17);
  });
});

describe("isProfileTypeSlug", () => {
  it("returns true for known slugs", () => {
    expect(isProfileTypeSlug("entrepreneur")).toBe(true);
    expect(isProfileTypeSlug("admin")).toBe(true);
  });

  it("returns false for unknown slugs", () => {
    expect(isProfileTypeSlug("user")).toBe(false);
    expect(isProfileTypeSlug("")).toBe(false);
  });
});

describe("VERIFICATION_STATUSES", () => {
  it("matches the DB CHECK constraint set exactly", () => {
    expect(VERIFICATION_STATUSES).toEqual(["pending", "verified", "rejected", "auto_verified"]);
  });
});

describe("isVerificationStatus", () => {
  it("accepts the 4 documented statuses", () => {
    for (const s of VERIFICATION_STATUSES) {
      expect(isVerificationStatus(s)).toBe(true);
    }
  });

  it("rejects unknown statuses", () => {
    expect(isVerificationStatus("approved")).toBe(false);
    expect(isVerificationStatus("")).toBe(false);
  });
});

describe("isProfilePubliclyVisible", () => {
  it("returns true only for verified + auto_verified", () => {
    expect(isProfilePubliclyVisible("verified")).toBe(true);
    expect(isProfilePubliclyVisible("auto_verified")).toBe(true);
    expect(isProfilePubliclyVisible("pending")).toBe(false);
    expect(isProfilePubliclyVisible("rejected")).toBe(false);
  });
});

describe("initialVerificationStatus", () => {
  it("returns auto_verified for entrepreneur + admin (no manual queue)", () => {
    expect(initialVerificationStatus("entrepreneur")).toBe("auto_verified");
    expect(initialVerificationStatus("admin")).toBe("auto_verified");
  });

  it("returns pending for organisation + government + partner", () => {
    expect(initialVerificationStatus("organisation")).toBe("pending");
    expect(initialVerificationStatus("government")).toBe("pending");
    expect(initialVerificationStatus("partner")).toBe("pending");
  });
});
