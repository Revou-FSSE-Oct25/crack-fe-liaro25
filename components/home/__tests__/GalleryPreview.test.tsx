import { render, screen } from "@testing-library/react";
import GalleryPreview from "../GalleryPreview";

describe("GalleryPreview", () => {
  it("renders gallery images titles", () => {
    render(<GalleryPreview />);

    expect(screen.getByText(/Savory Selection/i)).toBeInTheDocument();

    expect(screen.getByText(/Sweet Patisserie/i)).toBeInTheDocument();

    expect(screen.getByText(/Nusantara Bites/i)).toBeInTheDocument();

    expect(screen.getByText(/Premium Tea/i)).toBeInTheDocument();
  });
});
