import { describe, expect, it } from "vitest";

import { Media } from "../collections/Media";
import { Users } from "../collections/Users";

/**
 * Collection-shape smoke tests — catch a real failure: a Payload collection
 * config losing its slug, auth flag, or upload flag in a refactor would
 * silently break Payload's admin routing and Media uploads in production
 * without any TS error. These assertions encode the contract.
 */
describe("Users collection", () => {
  it('has slug "users" (Payload uses this for the REST/GraphQL endpoint)', () => {
    expect(Users.slug).toBe("users");
  });

  it("has auth enabled (Phase 0 baseline; profile fields land in Phase 1)", () => {
    expect(Users.auth).toBe(true);
  });
});

describe("Media collection", () => {
  it('has slug "media"', () => {
    expect(Media.slug).toBe("media");
  });

  it("has upload enabled (otherwise the admin shows no upload UI)", () => {
    expect(Media.upload).toBe(true);
  });

  it("has a required alt field (required for accessibility on all CMS-managed images)", () => {
    const altField = Media.fields?.find(
      (field): field is typeof field & { name: string } => "name" in field && field.name === "alt",
    );
    expect(altField).toBeDefined();
    expect((altField as { required?: boolean }).required).toBe(true);
  });
});
