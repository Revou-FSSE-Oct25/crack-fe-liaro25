import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    logout: jest.fn(),
  }),
}));

describe("Navbar", () => {
  it("renders public navigation links", () => {
    render(<Navbar />);

    expect(screen.getByText(/About/i)).toBeInTheDocument();

    expect(screen.getByText(/Menu/i)).toBeInTheDocument();

    expect(screen.getByText(/Gallery/i)).toBeInTheDocument();

    expect(screen.getByText(/Reservation/i)).toBeInTheDocument();
  });

  it("renders login and register links for guest users", () => {
    render(<Navbar />);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();

    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });
});
