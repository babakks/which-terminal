// tslint:disable: no-unused-expression

import { expect } from "chai";
import * as sinon from "sinon";
import * as terminalArrayModule from "../../model/terminalArray";
import { isConfiguration } from "../../model/configuration";
import { ifError } from "assert";

describe("isConfiguration()", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("should fail on incompatible argument", () => {
    it("`undefined`/`null` argument", () => {
      expect(isConfiguration(undefined)).to.be.false;
      expect(isConfiguration(null)).to.be.false;
    });

    it("primitive argument", () => {
      expect(isConfiguration(true)).to.be.false;
      expect(isConfiguration(false)).to.be.false;
      expect(isConfiguration("some-string")).to.be.false;
      expect(isConfiguration(123456)).to.be.false;
      expect(isConfiguration(new Date("2000-01-01"))).to.be.false;
    });

    it("unknown (object) argument", () => {
      const badArgument = {
        someUnknownProperty: true
      };

      expect(isConfiguration(badArgument)).to.be.false;
    });

    it("correct properties but incorrect types", () => {
      const badArgument = {
        windowsTerminals: {},
        linuxTerminals: {},
        osxTerminals: {}
      };

      expect(isConfiguration(badArgument)).to.be.false;
    });
  });

  describe("should work on correct type argument", () => {
    it("minimal argument (with only empty arrays)", () => {
      const argument = {
        windowsTerminals: [],
        linuxTerminals: [],
        osxTerminals: []
      };

      expect(isConfiguration(argument)).to.be.true;
    });

    it("maximal argument (with non-empty arrays)", () => {
      const argument = {
        windowsTerminals: [
          {
            shell: "shell1",
            id: "shell1"
          }
        ],
        linuxTerminals: [
          {
            shell: "shell2",
            id: "shell2"
          }
        ],
        osxTerminals: [
          {
            shell: "shell3",
            id: "shell3"
          }
        ]
      };

      expect(isConfiguration(argument)).to.be.true;
    });
  });

  describe("should call `isTerminalArray()` on argument fields", () => {
    it("incompatible argument", () => {
      const spy = sinon.spy(terminalArrayModule, "isTerminalArray");
      const argument = {
        windowsTerminals: [], // A `TerminalArray` item.
        linuxTerminals: { field2: true }, // A `non-TerminalArray` item.
        osxTerminals: { field3: true } // A `non-TerminalArray` item.
      };

      expect(isConfiguration(argument)).to.be.false;
      expect(spy.returned(false)).to.be.true;

      /**
       * Either it's never been called with compatible argument, or at least
       * once it's returned `true`.
       */
      expect(!spy.calledWith(argument.windowsTerminals) || spy.returned(true))
        .to.be.true;

      expect(
        spy.calledWith(argument.windowsTerminals) ||
          spy.calledWith(argument.linuxTerminals) ||
          spy.calledWith(argument.osxTerminals)
      ).to.be.true;

      sinon.restore();
    });

    it("compatible argument", () => {
      const spy = sinon.spy(terminalArrayModule, "isTerminalArray");
      const argument = {
        windowsTerminals: [{ shell: "shell.exe", id: "0000" }], // A `TerminalArray` item.
        linuxTerminals: [{ shell: "bash", id: "0001" }], // A `TerminalArray` item.
        osxTerminals: [] // A `TerminalArray` item.
      };

      expect(isConfiguration(argument)).to.be.true;
      expect(spy.callCount).to.be.gte(3);
      expect(spy.returned(false)).to.be.false;

      sinon.restore();
    });
  });
});
