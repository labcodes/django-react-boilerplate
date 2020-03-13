import React from "react";
import { shallow, mount } from "enzyme";

import { BrowserRouter } from "react-router-dom";
import { Welcome } from "./index";

describe("Welcome", () => {
  it("renders without props", async () => {
    expect(shallow(<Welcome />)).toBeTruthy();
  });

  it("calls fetchWelcomeMessage on mounting", async () => {
    const mockedFunc = jest.fn();
    expect(mockedFunc).not.toBeCalled();
    shallow(<Welcome fetchWelcomeMessage={mockedFunc} />);
    expect(mockedFunc).toBeCalled();
  });

  it("renders message if passed", async () => {
    const message = "Test message";
    // BrowserRouter is needed, since Welcome uses the Link component
    let component = mount(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );

    expect(component.find(".message").exists()).toBeFalsy();

    component = mount(
      <BrowserRouter>
        <Welcome message={message} />
      </BrowserRouter>
    );

    expect(component.find(".message").exists()).toBeTruthy();
    expect(component.find(".message").text()).toEqual(message);
  });
});
