import { render, screen } from "@testing-library/react";
import Input from "../Input";

describe("Input", () => {
  it("renders input with placeholder", () => {
    render(<Input placeholder="Enter your name" />);

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<Input placeholder="Email" disabled />);

    expect(screen.getByPlaceholderText("Email")).toBeDisabled();
  });
});
