import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { CardSection } from "@/components/ui/CardSection";
import { useStoredToggle } from "@/hooks/useStoredToggle";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { render } from "./render";

beforeEach(() => localStorage.clear());

function DraftSection() {
  const section = useStoredToggle("draft");
  return <CardSection title="Rascunho" expanded={section.open} onToggle={section.toggle}>
    <textarea aria-label="Conteúdo" defaultValue="" />
  </CardSection>;
}

it("preserves an unsaved draft on collapse and restores the collapsed preference on reload", async () => {
  const user = userEvent.setup();
  const view = render(<DraftSection />);
  const draft = screen.getByLabelText("Conteúdo");
  await user.type(draft, "Ainda não salvo");
  await user.click(screen.getByRole("button", { name: "Rascunho" }));
  expect(screen.getByLabelText("Conteúdo")).toBe(draft);
  await user.click(screen.getByRole("button", { name: "Rascunho" }));
  expect(draft).toHaveValue("Ainda não salvo");
  await user.click(screen.getByRole("button", { name: "Rascunho" }));
  view.unmount();
  render(<DraftSection />);
  await waitFor(() => expect(screen.getByRole("button", { name: "Rascunho" })).toHaveAttribute("aria-expanded", "false"));
});

function FeedbackControls() {
  const { notify } = useFeedback();
  return <>
    <button onClick={() => notify("Copiado")}>Copiar</button>
    <button onClick={() => notify("Não foi possível salvar", "error")}>Salvar</button>
  </>;
}

it("replaces old feedback and lets the user dismiss an error", async () => {
  const user = userEvent.setup();
  render(<FeedbackControls />);
  await user.click(screen.getByRole("button", { name: "Copiar" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Copiado");
  await user.click(screen.getByRole("button", { name: "Salvar" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível salvar");
  expect(screen.queryByText("Copiado")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
});
