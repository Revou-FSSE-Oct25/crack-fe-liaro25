import { render, screen } from "@testing-library/react";
import AboutPreview from "../AboutPreview";

describe("AboutPreview", () => {
  it("renders heading and CTA button", () => {
    render(<AboutPreview />);

    expect(screen.getByText(/About Whisk & Wonder/i)).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /Reserve Your Experience/i,
      }),
    ).toBeInTheDocument();
  });
});
