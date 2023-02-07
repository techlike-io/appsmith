import { defaultValueValidation, CurrencyInputWidgetProps } from "./index";
import _ from "lodash";
import { EMPTY_ERROR_MESSAGE } from "constants/WidgetValidation";

describe("defaultValueValidation", () => {
  let result: any;

  it("should validate defaulttext", () => {
    result = defaultValueValidation("100", {} as CurrencyInputWidgetProps, _);

    expect(result).toEqual({
      isValid: true,
      parsed: "100",
      messages: [EMPTY_ERROR_MESSAGE],
    });

    result = defaultValueValidation("test", {} as CurrencyInputWidgetProps, _);

    expect(result).toEqual({
      isValid: false,
      parsed: undefined,
      messages: [new TypeError("This value must be number")],
    });

    result = defaultValueValidation("", {} as CurrencyInputWidgetProps, _);

    expect(result).toEqual({
      isValid: true,
      parsed: undefined,
      messages: [EMPTY_ERROR_MESSAGE],
    });
  });

  it("should validate defaulttext with object value", () => {
    const value = {};
    result = defaultValueValidation(value, {} as CurrencyInputWidgetProps, _);

    expect(result).toEqual({
      isValid: false,
      parsed: JSON.stringify(value, null, 2),
      messages: [new TypeError("This value must be number")],
    });
  });
});
