import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { appConfig } from "@/config/app";
import { lastPageKey, resumablePage } from "@/components/pwa/navigation";
import { PwaLaunch } from "@/components/pwa/PwaLaunch";
import { PwaNavigation } from "@/components/pwa/PwaNavigation";
const mocks = vi.hoisted(() => ({ replace: vi.fn(), path: "/workspace" }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace }), usePathname: () => mocks.path }));
const fetchMock = vi.fn();
beforeEach(() => {
  localStorage.clear();
  appConfig.pwa.resumePaths = ["/", "/workspace"];
  mocks.replace.mockReset();
  mocks.path = "/workspace";
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset().mockResolvedValue(Response.json({ destination: "/workspace" }));
});
it("accepts configured exact pages, excluding queries, APIs, auth and external URLs", () => {
  expect(resumablePage("/workspace")).toBe("/workspace");
  for (const path of [null, "/unknown", "/workspace/new", "/workspace?draft=1", "/workspace#draft", "/login", "/pwa", "/api/auth/session", "https://outside.test", "//outside.test"]) {
    expect(resumablePage(path)).toBeNull();
  }
  expect(lastPageKey(1)).not.toBe(lastPageKey(2));
});
it("records route paths per account and does not overwrite them with an unsupported page", () => {
  const view = render(<PwaNavigation userId={7} />);
  expect(localStorage.getItem(lastPageKey(7))).toBe("/workspace");
  expect(localStorage.getItem(lastPageKey(8))).toBeNull();
  mocks.path = "/login";
  view.rerender(<PwaNavigation userId={7} />);
  expect(localStorage.getItem(lastPageKey(7))).toBe("/workspace");
});
it("asks the authenticated server policy before resuming a page", async () => {
  localStorage.setItem(lastPageKey(7), "/workspace");
  render(<PwaLaunch userId={7} />);
  await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/workspace"));
  expect(fetchMock).toHaveBeenCalledWith("/api/pwa/resume", expect.objectContaining({ method: "POST", cache: "no-store", body: JSON.stringify({ path: "/workspace" }) }));
});
it("uses home when the server declines a saved resource", async () => {
  localStorage.setItem(lastPageKey(7), "/workspace");
  fetchMock.mockResolvedValue(Response.json({ destination: "/" }));
  render(<PwaLaunch userId={7} />);
  await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/"));
});
it("does not resume a different account's page", async () => {
  localStorage.setItem(lastPageKey(7), "/workspace");
  render(<PwaLaunch userId={8} />);
  await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/"));
  expect(fetchMock).not.toHaveBeenCalled();
});
it("returns expired sessions to the PWA login entry", async () => {
  localStorage.setItem(lastPageKey(7), "/workspace");
  fetchMock.mockResolvedValue(new Response(null, { status: 401 }));
  render(<PwaLaunch userId={7} />);
  await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/login?next=/pwa"));
});
it("keeps the saved page through outages and lets the user retry", async () => {
  localStorage.setItem(lastPageKey(7), "/workspace");
  fetchMock.mockRejectedValue(new Error("offline"));
  const view = render(<PwaLaunch userId={7} />);
  await view.findByRole("alert");
  expect(localStorage.getItem(lastPageKey(7))).toBe("/workspace");
  fetchMock.mockResolvedValue(Response.json({ destination: "/workspace" }));
  await act(async () => { view.getByRole("button", { name: "Tentar novamente" }).click(); });
  await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/workspace"));
});
