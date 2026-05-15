import { render, screen } from "@testing-library/react";
import MenuPreview from "../MenuPreview";

describe("MenuPreview", () => {
  it("renders menu packages", () => {
    render(<MenuPreview />);

    expect(screen.getByText(/Western Afternoon Tea Set/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Nusantara Afternoon Tea Set/i),
    ).toBeInTheDocument();
  });

  it("renders reservation buttons", () => {
    render(<MenuPreview />);

    const buttons = screen.getAllByRole("link", {
      name: /Reserve This Set/i,
    });

    expect(buttons).toHaveLength(2);
  });
});
