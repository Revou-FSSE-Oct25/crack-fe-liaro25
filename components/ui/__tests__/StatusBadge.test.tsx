import { render, screen } from "@testing-library/react";
import StatusBadge from "../StatusBadge";

describe("StatusBadge", () => {
  it("renders status text correctly", () => {
    render(<StatusBadge status="pending" />);

    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it("applies correct style for confirmed status", () => {
    render(<StatusBadge status="confirmed" />);

    const badge = screen.getByText(/confirmed/i);

    expect(badge).toHaveClass("bg-[#DDF2E3]");
  });
});

it("applies completed status style", () => {
  render(<StatusBadge status="completed" />);

  expect(screen.getByText(/completed/i)).toHaveClass("bg-[#DCEFF0]");
});

it("applies cancelled status style", () => {
  render(<StatusBadge status="cancelled" />);

  expect(screen.getByText(/cancelled/i)).toHaveClass("bg-[#F8D7DA]");
});

it("applies default style for unknown status", () => {
  render(<StatusBadge status="unknown" />);

  expect(screen.getByText(/unknown/i)).toHaveClass("bg-[#F2ECE6]");
});
