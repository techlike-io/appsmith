import { defaultValueValidation, PhoneInputWidgetProps } from "./index";
import _ from "lodash";
import { EMPTY_ERROR_MESSAGE } from "constants/WidgetValidation";

describe("defaultValueValidation", () => {
  let result: any;

  it("should validate defaulttext", () => {
    result = defaultValueValidation(
      "0000000000",
      {} as PhoneInputWidgetProps,
      _,
    );

    expect(result).toEqual({
      isValid: true,
      parsed: "0000000000",
      messages: [EMPTY_ERROR_MESSAGE],
    });
  });

  it("should validate defaulttext with object value", () => {
    const value = {};
    result = defaultValueValidation(value, {} as PhoneInputWidgetProps, _);

    expect(result).toEqual({
      isValid: false,
      parsed: JSON.stringify(value, null, 2),
      messages: [new TypeError("This value must be string")],
    });
  });
});
