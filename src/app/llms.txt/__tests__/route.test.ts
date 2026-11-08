// @vitest-environment node
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/llms-txt", () => ({
  buildLlmsIndex: vi.fn(() => "# GIGANCHOR\n\n> Summary.\n"),
}));

import { GET } from "../route";

describe("GET /llms.txt", () => {
  it("returns the built index as plain text", async () => {
    const res = await GET();

    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    await expect(res.text()).resolves.toBe("# GIGANCHOR\n\n> Summary.\n");
  });
});
