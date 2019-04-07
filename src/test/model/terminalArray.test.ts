// tslint:disable: no-unused-expression

import { expect } from "chai";
import { TerminalArray, isTerminalArray } from "../../model/terminalArray";
import * as terminalModule from "../../model/terminal";
import * as sinon from "sinon";

describe("isTerminalArray()", () => {
  describe("should fail on incompatible argument", () => {
    it("`undefined`/`null` argument", () => {
      expect(isTerminalArray(undefined)).to.be.false;
      expect(isTerminalArray(null)).to.be.false;
    });

    it("primitive argument", () => {
      expect(isTerminalArray(true)).to.be.false;
      expect(isTerminalArray(false)).to.be.false;
      expect(isTerminalArray("some-string")).to.be.false;
      expect(isTerminalArray(123456)).to.be.false;
      expect(isTerminalArray(new Date("2000-01-01"))).to.be.false;
    });

    it("unknown (object) argument", () => {
      const badArgument = {
        someUnknownProperty: true
      };

      expect(isTerminalArray(badArgument)).to.be.false;
    });

    it("array with `undefined`/`null` items", () => {
      expect(isTerminalArray([undefined])).to.be.false;
      expect(isTerminalArray([null])).to.be.false;
      expect(isTerminalArray([undefined, null])).to.be.false;
    });

    it("array with some incorrect-type items", () => {
      const badArgument = [
        {
          // A non-`Terminal` item.
          someUnknownProperty: true
        },
        {
          // A `Terminal` item.
          shell: "shell.exe",
          id: "0000"
        }
      ];

      expect(isTerminalArray(badArgument)).to.be.false;
    });
  });

  describe("should work on correct type argument", () => {
    it("empty array", () => {
      expect(isTerminalArray([])).to.be.true;
    });

    it("minimal argument (with only one minimal `Terminal`)", () => {
      const argument = [
        {
          id: "0000",
          shell: "shell.exe"
        }
      ];

      expect(isTerminalArray(argument)).to.be.true;
    });

    it("maximal argument (with all properties)", () => {
      const argument = [
        {
          id: "0000",
          shell: "shell.exe",
          shellArgs: ["/k", "something"],
          env: { MODE: "prod" },
          init: ["cls", "dir"],
          title: "maximal-argument",
          cwd: "c:\\"
        }
      ];

      expect(isTerminalArray(argument)).to.be.true;
    });
  });

  it("should call `isTerminal()` on argument elements, if any", () => {
    const spy = sinon.spy(terminalModule, "isTerminal");
    const argument = [
      { shell: "shell.exe", id: "0000" }, // A `Terminal` item.
      { someUnknownProperty: true } // A non-`Terminal` item.
    ];

    expect(isTerminalArray(argument)).to.be.false;
    expect(spy.calledTwice).to.be.true;
    expect(spy.firstCall.returnValue).to.be.true;
    expect(spy.secondCall.returnValue).to.be.false;

    sinon.restore();
  });
});
