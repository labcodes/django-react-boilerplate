import React from "react";
import { render, screen } from "@testing-library/react";

import { WelcomePage } from "./index";
import { MemoryRouter } from "react-router-dom";

describe("Welcome", () => {
  it("renders without props", async () => {
    const component = render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );
    expect(component).toBeTruthy();
    expect(component.container.querySelector(".welcome__message")).toBeFalsy();
    expect(component.container).toMatchSnapshot();
  });

  it("calls fetchWelcomeMessage on mounting", async () => {
    const mockedFunc = jest.fn();
    expect(mockedFunc).not.toBeCalled();
    render(
      <MemoryRouter>
        <WelcomePage fetchWelcomeMessage={mockedFunc} />
      </MemoryRouter>
    );
    expect(mockedFunc).toBeCalled();
  });

  it("renders message if passed", async () => {
    const message = "Test message";
    render(
      <MemoryRouter>
        <WelcomePage message={message} />
      </MemoryRouter>
    );
    expect(screen.getByText(message)).toBeTruthy();
  });
});
