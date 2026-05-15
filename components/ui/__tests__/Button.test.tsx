import { render, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button", () => {
  it("renders button text correctly", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<Button disabled>Submit</Button>);

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });
});
