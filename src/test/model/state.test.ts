// tslint:disable: no-unused-expression

import * as orderModule from "../../model/order";
import { isState } from "../../model/state";
import { expect } from "chai";
import * as sinon from "sinon";

describe("isState()", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("should fail on incompatible argument", () => {
    it("`undefined`/`null` argument", () => {
      expect(isState(undefined)).to.be.false;
      expect(isState(null)).to.be.false;
    });

    it("primitive argument", () => {
      expect(isState(true)).to.be.false;
      expect(isState(false)).to.be.false;
      expect(isState("some-string")).to.be.false;
      expect(isState(123456)).to.be.false;
      expect(isState(new Date("2000-01-01"))).to.be.false;
    });

    it("incompatible (object) argument", () => {
      const badArgument = {
        someUnknownProperty: true
      };

      expect(isState(badArgument)).to.be.false;
    });
  });

  describe("should work on correct type argument", () => {
    it("empty array", () => {
      const argument = { order: [] };
      expect(isState(argument)).to.be.true;
    });

    it("non-empty array", () => {
      const argument = { order: ["item1", "item2"] };
      expect(isState(argument)).to.be.true;
    });
  });

  describe("should call `isOrder()` on argument's `order` field, if any", () => {
    it("incompatible argument", () => {
      const spy = sinon.spy(orderModule, "isOrder");
      const argument = {
        order: "Incompatible type"
      };

      expect(isState(argument)).to.be.false;
      expect(spy.calledWith(argument.order)).to.be.true;
      expect(spy.returned(false)).to.be.true;
    });

    it("compatible argument", () => {
      const spy = sinon.spy(orderModule, "isOrder");
      const argument = {
        order: ["item1", "item2"]
      };

      expect(isState(argument)).to.be.true;
      expect(spy.callCount).to.be.gte(1);
      expect(spy.returned(false)).to.be.false;
    });
  });
});
