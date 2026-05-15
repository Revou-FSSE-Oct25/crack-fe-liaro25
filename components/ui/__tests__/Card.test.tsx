import { render, screen } from "@testing-library/react";
import Card from "../Card";

describe("Card", () => {
  it("renders card content correctly", () => {
    render(<Card>Card content</Card>);

    expect(screen.getByText("Card content")).toBeInTheDocument();
  });
});
