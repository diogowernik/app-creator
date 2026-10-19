import type { ComponentProps } from "react";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppHeader } from "@/components/AppHeader";
import { AppNavigation } from "@/components/AppNavigation";
import { AppShell } from "@/components/shell/AppShell";
import { HomeIcon } from "@/components/icons/NavigationIcons";
import { appConfig } from "@/config/app";
import { render } from "./render";

const route = vi.hoisted(() => ({ pathname: "/" }));
const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
  useRouter: () => router,
}));
// Model Link's navigation callback, including clicks that must not navigate.
vi.mock("next/link", async () => {
  const { forwardRef } = await import("react");
  return {
    default: forwardRef<HTMLAnchorElement, ComponentProps<"a"> & { onNavigate?: () => void }>(
      function Link({ onNavigate, onClick, ...props }, ref) {
        return <a {...props} ref={ref} onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            onNavigate?.();
          }
          event.preventDefault();
        }} />;
      },
    ),
  };
});

let resize: (width: number) => void;
const originalNavigation = appConfig.navigation;
const originalShell = structuredClone(appConfig.shell);
afterEach(() => {
  appConfig.navigation = originalNavigation;
  appConfig.shell = structuredClone(originalShell);
  vi.unstubAllGlobals();
});
beforeEach(() => {
  localStorage.clear();
  route.pathname = "/";
  router.replace.mockClear();
  router.refresh.mockClear();
  appConfig.navigation = [
    { label: "Início", href: "/", icon: HomeIcon },
    { label: "Projetos", href: "/projects", icon: HomeIcon, activePaths: ["/archive"] },
    { label: "Ajuda", href: "/help" },
  ];
  let width = 1600;
  const subscriptions = new Set<() => void>();
  window.matchMedia = (query) => ({
    get matches() {
      const minimum = Number(query.match(/min-width:\s*([\d.]+)/)?.[1] ?? 0);
      const maximum = Number(query.match(/max-width:\s*([\d.]+)/)?.[1] ?? Infinity);
      return width >= minimum && width <= maximum;
    },
    media: query,
    addEventListener: (_type: string, listener: () => void) => subscriptions.add(listener),
    removeEventListener: (_type: string, listener: () => void) => subscriptions.delete(listener),
  }) as unknown as MediaQueryList;
  resize = (value) => {
    width = value;
    act(() => subscriptions.forEach((callback) => callback()));
  };
});

function Workspace({ panels = false }: { panels?: boolean }) {
  return (
    <AppShell
      header={<AppHeader />}
      navigation={<AppNavigation variant="sidebar" />}
      left={panels ? <p>Filtros do produto</p> : undefined}
      right={panels ? <p>Detalhes do produto</p> : undefined}
      leftDefaultOpen={panels ? true : undefined}
      rightDefaultOpen={panels ? true : undefined}
    >
      <textarea aria-label="Rascunho" defaultValue="Texto não salvo" />
    </AppShell>
  );
}

it("uses the same links, icons and active route in the header and sidebar", async () => {
  route.pathname = "/projects/42";
  render(<Workspace />);
  const header = screen.getByRole("navigation", { name: "Navegação principal" });
  expect(within(header).getAllByRole("link").map((link) => link.getAttribute("href")))
    .toEqual(["/", "/projects", "/help"]);
  expect(within(header).getByRole("link", { name: "Projetos" })).toHaveAttribute("aria-current", "page");
  expect(within(header).getByRole("link", { name: "Projetos" }).querySelector("svg")).not.toBeNull();
  expect(screen.queryByRole("button", { name: "Mostrar navegação" })).not.toBeInTheDocument();

  resize(1200);
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Mostrar navegação" }));
  const sidebar = screen.getByRole("navigation", { name: "Navegação principal" });
  expect(within(sidebar).getAllByRole("link").map((link) => link.getAttribute("href")))
    .toEqual(["/", "/projects", "/help"]);
  expect(within(sidebar).getByRole("link", { name: "Projetos" })).toHaveAttribute("aria-current", "page");
  expect(within(sidebar).getByRole("link", { name: "Projetos" }).querySelector("svg")).not.toBeNull();
  expect(within(sidebar).getByRole("link", { name: "Ajuda" }).querySelector("svg")).toBeNull();
  expect(screen.getByLabelText("Rascunho")).toHaveValue("Texto não salvo");
});

it("matches route segments and aliases without activating similar route names", () => {
  route.pathname = "/archive";
  const view = render(<Workspace />);
  expect(screen.getByRole("link", { name: "Projetos" })).toHaveAttribute("aria-current", "page");
  route.pathname = "/projects-other";
  view.rerender(<Workspace />);
  expect(screen.getByRole("link", { name: "Projetos" })).not.toHaveAttribute("aria-current");
  expect(screen.getByRole("link", { name: "Início" })).not.toHaveAttribute("aria-current");
});

it("remembers desktop opening without reopening mobile navigation or losing drafts on resize", async () => {
  resize(1200);
  const user = userEvent.setup();
  const view = render(<Workspace />);
  await user.click(screen.getByRole("button", { name: "Mostrar navegação" }));
  const editor = screen.getByLabelText("Rascunho");
  resize(1600);
  expect(screen.queryByRole("button", { name: "Recolher navegação" })).not.toBeInTheDocument();
  expect(screen.getAllByRole("navigation")).toHaveLength(1);
  resize(1200);
  expect(screen.getByRole("button", { name: "Recolher navegação" })).toHaveAttribute("aria-expanded", "true");
  resize(390);
  expect(screen.getByRole("button", { name: "Mostrar navegação" })).toHaveAttribute("aria-expanded", "false");
  await user.click(screen.getByRole("button", { name: "Mostrar navegação" }));
  await user.click(screen.getByRole("link", { name: "Projetos" }));
  await waitFor(() => expect(screen.queryByRole("button", { name: "Fechar navegação" })).not.toBeInTheDocument());
  expect(screen.getByLabelText("Rascunho")).toBe(editor);
  view.unmount();
  resize(1200);
  render(<Workspace />);
  await waitFor(() => expect(screen.getByRole("button", { name: "Recolher navegação" })).toHaveAttribute("aria-expanded", "true"));
});

it("keeps mobile navigation open for modified clicks and restores focus after Escape", async () => {
  resize(390);
  render(<Workspace />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Mostrar navegação" }));
  await user.keyboard("{Control>}");
  await user.click(screen.getByRole("link", { name: "Projetos" }));
  await user.keyboard("{/Control}");
  expect(screen.getByRole("button", { name: "Fechar navegação" })).toBeVisible();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("button", { name: "Fechar navegação" })).not.toBeInTheDocument());
  expect(screen.getByRole("button", { name: "Mostrar navegação" })).toHaveFocus();
});

it("preserves custom panels alongside the responsive main navigation", async () => {
  render(<Workspace panels />);
  expect(screen.getByText("Filtros do produto")).toBeVisible();
  expect(screen.getByText("Detalhes do produto")).toBeVisible();
  resize(1200);
  expect(screen.getByText("Filtros do produto")).toBeVisible();
  expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Recolher navegação" }));
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  expect(screen.getByText("Detalhes do produto")).toBeVisible();
});

it("defaults to header navigation on wide screens with no sidebar controls", () => {
  render(<Workspace />);
  expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Sair" })).toBeVisible();
  expect(screen.queryByRole("button", { name: /navegação|preview/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
});

it("optionally keeps the navigation toggle on wide screens without forcing the sidebar open", async () => {
  appConfig.shell.navigation.mode = "sidebar";
  render(<Workspace />);
  expect(screen.getByRole("button", { name: "Mostrar navegação" })).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Mostrar navegação" }));
  expect(screen.getAllByRole("navigation")).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Sair" })).toBeVisible();
  resize(390);
  expect(screen.getByRole("button", { name: "Mostrar navegação" })).toHaveAttribute("aria-expanded", "false");
});

it("can explicitly start the sidebar open while honoring a saved closed preference", async () => {
  appConfig.shell.navigation.mode = "sidebar";
  appConfig.shell.navigation.defaultOpen = true;
  const view = render(<Workspace />);
  expect(screen.getByRole("button", { name: "Recolher navegação" })).toHaveAttribute("aria-expanded", "true");
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Recolher navegação" }));
  view.unmount();
  render(<Workspace />);
  await waitFor(() => expect(screen.getByRole("button", { name: "Mostrar navegação" })).toHaveAttribute("aria-expanded", "false"));
});

it.each([1200, 390])("places logout only inside the sidebar at %ipx", async (width) => {
  resize(width);
  render(<Workspace />);
  expect(screen.queryByRole("button", { name: "Sair" })).not.toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Mostrar navegação" }));
  const sidebar = screen.getByRole(width === 390 ? "dialog" : "complementary", { name: "Navegação" });
  expect(within(sidebar).getByRole("button", { name: "Sair" })).toBeVisible();
  expect(screen.getAllByRole("button", { name: "Sair" })).toHaveLength(1);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ ok: true })));
  await user.click(within(sidebar).getByRole("button", { name: "Sair" }));
  await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/login"));
  expect(router.refresh).toHaveBeenCalled();
});

it("allows the right panel to be enabled independently and keeps it closed by default", async () => {
  appConfig.shell.rightPanel.defaultOpen = true;
  const view = render(<Workspace />);
  expect(screen.queryByRole("button", { name: /preview/i })).not.toBeInTheDocument();
  appConfig.shell.rightPanel.enabled = true;
  appConfig.shell.rightPanel.defaultOpen = false;
  view.rerender(<Workspace />);
  expect(screen.getByRole("button", { name: "Mostrar preview" })).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("complementary", { name: "Preview" })).not.toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Mostrar preview" }));
  expect(screen.getByRole("complementary", { name: "Preview" })).toBeVisible();
  expect(screen.queryByRole("button", { name: /navegação/i })).not.toBeInTheDocument();
});

it("allows an enabled right panel to start open explicitly", () => {
  appConfig.shell.rightPanel.enabled = true;
  appConfig.shell.rightPanel.defaultOpen = true;
  render(<Workspace />);
  expect(screen.getByRole("button", { name: "Ocultar preview" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("complementary", { name: "Preview" })).toBeVisible();
});
