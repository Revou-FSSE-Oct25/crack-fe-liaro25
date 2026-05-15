import { render, screen } from "@testing-library/react";
import ReservationCTA from "../ReservationCTA";

describe("ReservationCTA", () => {
  it("renders CTA buttons", () => {
    render(<ReservationCTA />);

    expect(
      screen.getByRole("link", {
        name: /Reserve Your Table/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /Check Reservation/i,
      }),
    ).toBeInTheDocument();
  });
});
