import { render, screen } from "@testing-library/react";
import FeatureStrip from "../FeatureStrip";

describe("FeatureStrip", () => {
  it("renders all feature titles", () => {
    render(<FeatureStrip />);

    expect(screen.getByText(/Ocean-View Café/i)).toBeInTheDocument();

    expect(screen.getByText(/Western & Nusantara Sets/i)).toBeInTheDocument();

    expect(screen.getByText(/Online Reservation/i)).toBeInTheDocument();

    expect(screen.getByText(/Curated Premium Menu/i)).toBeInTheDocument();
  });
});
