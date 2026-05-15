import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders footer information", () => {
    render(<Footer />);

    expect(
      screen.getByRole("heading", {
        name: /Whisk & Wonder/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Luxury Afternoon Tea Reservation System/i),
    ).toBeInTheDocument();
  });
});
