// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";
import { appConfig } from "@/config/app";
import { POST } from "@/app/api/pwa/resume/route";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ fetchCurrentUser: vi.fn(), isSameOrigin: vi.fn() }));
vi.mock("@/server/django", () => ({ ...mocks, noStoreJson: (data: unknown, init?: ResponseInit) => Response.json(data, init) }));
beforeEach(() => {
  appConfig.pwa.resumePaths = ["/", "/workspace"];
  mocks.fetchCurrentUser.mockResolvedValue({ id: 7 });
  mocks.isSameOrigin.mockReturnValue(true);
});
const call = (path: string) => POST(new Request("http://localhost:3000/api/pwa/resume", { method: "POST", body: JSON.stringify({ path }) }));
it("requires a same-origin authenticated session", async () => {
  mocks.isSameOrigin.mockReturnValue(false);
  expect((await call("/workspace")).status).toBe(403);
  mocks.isSameOrigin.mockReturnValue(true);
  mocks.fetchCurrentUser.mockResolvedValue(null);
  expect((await call("/workspace")).status).toBe(401);
});
it("only returns destinations allowed by the server policy", async () => {
  expect(await (await call("/workspace")).json()).toEqual({ destination: "/workspace" });
  for (const path of ["https://outside.test", "//outside.test", "/api/auth/session", "/workspace?secret=1", "/unknown"]) {
    expect(await (await call(path)).json()).toEqual({ destination: "/" });
  }
});
