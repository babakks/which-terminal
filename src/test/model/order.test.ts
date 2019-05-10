// tslint:disable: no-unused-expression

import { isOrder } from "../../model/order";
import { expect } from "chai";
import * as sinon from "sinon";

describe("isOrder()", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("should fail on incompatible argument", () => {
    it("`undefined`/`null` argument", () => {
      expect(isOrder(undefined)).to.be.false;
      expect(isOrder(null)).to.be.false;
    });

    it("primitive argument", () => {
      expect(isOrder(true)).to.be.false;
      expect(isOrder(false)).to.be.false;
      expect(isOrder("some-string")).to.be.false;
      expect(isOrder(123456)).to.be.false;
      expect(isOrder(new Date("2000-01-01"))).to.be.false;
    });

    it("object argument", () => {
      const badArgument = {
        someUnknownProperty: true
      };

      expect(isOrder(badArgument)).to.be.false;
    });

    it("incompatible array", () => {
      const badArgument = [0, 1];

      expect(isOrder(badArgument)).to.be.false;
    });
  });

  describe("should work on correct type argument", () => {
    it("empty array", () => {
      const argument: any[] = [];
      expect(isOrder(argument)).to.be.true;
    });

    it("non-empty array", () => {
      const argument = ["item1", "item2"];
      expect(isOrder(argument)).to.be.true;
    });
  });
});
