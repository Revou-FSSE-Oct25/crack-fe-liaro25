import { render, screen } from "@testing-library/react";
import HeroSection from "../HeroSection";

describe("HeroSection", () => {
  it("renders hero heading", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", {
        name: /Luxury Seaside Afternoon Tea/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("link", {
        name: /Reserve Your Table/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /Explore Menu/i,
      }),
    ).toBeInTheDocument();
  });
});
