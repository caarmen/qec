import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RichText from "../../components/ui/RichText";

describe("RichText", () => {
  describe("plain text", () => {
    it("should render text without backticks unchanged", () => {
      const { container } = render(<RichText text="Une question sans code." />);
      expect(container.textContent).toBe("Une question sans code.");
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
    });

    it("should render empty text as empty output", () => {
      const { container } = render(<RichText text="" />);
      expect(container.textContent).toBe("");
    });
  });

  describe("code spans", () => {
    it("should render backticked text as inline code", () => {
      const { container } = render(
        <RichText text="Que fait `listFiles()` à l'arrêt ?" />,
      );
      expect(screen.getByRole("code")).toHaveTextContent("listFiles()");
      expect(container.textContent).toBe("Que fait listFiles() à l'arrêt ?");
    });

    it("should render multiple code spans", () => {
      render(<RichText text="`listFiles()` puis `deleteFiles()`" />);
      const codeElements = screen.getAllByRole("code");
      expect(codeElements).toHaveLength(2);
      expect(codeElements[0]).toHaveTextContent("listFiles()");
      expect(codeElements[1]).toHaveTextContent("deleteFiles()");
    });

    it("should render a code span at the start and end of text", () => {
      render(<RichText text="`Module` et `Factory`" />);
      expect(screen.getAllByRole("code")).toHaveLength(2);
    });
  });

  describe("unmatched backticks", () => {
    it("should render a dangling backtick as a literal character", () => {
      const { container } = render(<RichText text="Un backtick ` seul" />);
      expect(container.textContent).toBe("Un backtick ` seul");
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
    });
  });
});
