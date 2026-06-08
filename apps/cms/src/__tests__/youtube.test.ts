import { describe, expect, it } from "vitest";

import { extractYouTubeId } from "../lib/youtube";

/**
 * YouTube ID extraction for the Videos collection. Catches a real editor
 * failure: Amadou pasted the full share URL
 * (https://www.youtube.com/watch?v=M5unlc9fGe0) into the "ID YouTube" field,
 * which validated to exactly 11 chars and rejected the URL. The collection now
 * accepts a full URL and stores the bare ID.
 */
describe("extractYouTubeId", () => {
  it("extracts the ID from the exact URL Amadou pasted", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=M5unlc9fGe0")).toBe("M5unlc9fGe0");
  });

  it("passes a bare 11-char ID straight through", () => {
    expect(extractYouTubeId("M5unlc9fGe0")).toBe("M5unlc9fGe0");
  });

  it("handles youtu.be short links", () => {
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("handles /embed/ URLs", () => {
    expect(extractYouTubeId("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
  });

  it("handles /shorts/ URLs", () => {
    expect(extractYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("ignores extra query params (timestamps, playlists)", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=M5unlc9fGe0&t=42s&list=PLabc")).toBe(
      "M5unlc9fGe0",
    );
  });

  it("trims surrounding whitespace from a pasted value", () => {
    expect(extractYouTubeId("  https://youtu.be/dQw4w9WgXcQ  ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for a non-YouTube / malformed value", () => {
    expect(extractYouTubeId("https://vimeo.com/12345")).toBeNull();
    expect(extractYouTubeId("not a video")).toBeNull();
    expect(extractYouTubeId("")).toBeNull();
  });
});
