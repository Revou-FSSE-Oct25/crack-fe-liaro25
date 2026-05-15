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
