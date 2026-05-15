import "@testing-library/jest-dom";
import React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement("img", {
      ...props,
      alt: props.alt || "",
    });
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return React.createElement("a", { href }, children);
  },
}));

jest.mock("next/font/google", () => ({
  Cinzel: () => ({
    className: "mocked-font",
  }),
  Great_Vibes: () => ({
    className: "mocked-font",
  }),
}));
