import React from "react";
import { shallow } from "enzyme";

import { Welcome } from "./index";

describe("Welcome", () => {
  it("renders without props", async () => {
    const component = shallow(<Welcome />);
    expect(component).toBeTruthy();
    expect(component.find(".welcome__message").exists()).toBeFalsy();
  });

  it("calls fetchWelcomeMessage on mounting", async () => {
    const mockedFunc = jest.fn();
    expect(mockedFunc).not.toBeCalled();
    shallow(<Welcome fetchWelcomeMessage={mockedFunc} />);
    expect(mockedFunc).toBeCalled();
  });

  it("renders message if passed", async () => {
    const message = "Test message";
    const component = shallow(<Welcome message={message} />);

    expect(component.find(".welcome__message").exists()).toBeTruthy();
    expect(component.find(".welcome__message").text()).toEqual(message);
  });
});
