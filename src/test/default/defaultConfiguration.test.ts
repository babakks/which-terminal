// tslint:disable: no-unused-expression

import { expect } from "chai";
import * as sinon from "sinon";
import * as configurationModule from "../../model/configuration";
import { DefaultConfiguration } from "../../default/defaultConfiguration";

describe("DefaultConfiguration", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("from()", () => {
    describe("should check argument type compatibility with `isConfiguration()`", () => {
      it("should call `isConfiguration()` and throw on an incompatible argument", () => {
        const spy = sinon.spy(configurationModule, "isConfiguration");
        const badArgument = {
          someUnknownProperty: true
        };

        expect(() => DefaultConfiguration.from(badArgument)).to.throw(); // "Act" & "Assert"
        expect(spy.called).to.be.true;
        expect(spy.returned(false)).to.be.true;

        sinon.restore();
      });

      it("should call `isConfiguration()` and proceed on a compatible argument", () => {
        const spy = sinon.spy(configurationModule, "isConfiguration");
        const argument = {
          windowsTerminals: [{ shell: "shell.exe", id: "0000" }], // A `TerminalArray` item.
          linuxTerminals: [{ shell: "bash", id: "0001" }], // A `TerminalArray` item.
          osxTerminals: [] // A `TerminalArray` item.
        };

        expect(() => DefaultConfiguration.from(argument)).to.not.throw(); // "Act" & "Assert"
        expect(spy.called).to.be.true;
        expect(spy.returned(true)).to.be.true;

        sinon.restore();
      });
    });

    describe("should fail on incompatible argument", () => {
      it("`undefined`/`null` argument", () => {
        expect(() => DefaultConfiguration.from(undefined)).to.throw();
        expect(() => DefaultConfiguration.from(null)).to.throw();
      });

      it("primitive argument", () => {
        expect(() => DefaultConfiguration.from(true)).to.throw();
        expect(() => DefaultConfiguration.from(false)).to.throw();
        expect(() => DefaultConfiguration.from("some-string")).to.throw();
        expect(() => DefaultConfiguration.from(123456)).to.throw();
        expect(() =>
          DefaultConfiguration.from(new Date("2000-01-01"))
        ).to.throw();
      });

      it("unknown (object) argument", () => {
        const badArgument = {
          someUnknownProperty: true
        };

        expect(() => DefaultConfiguration.from(badArgument)).to.throw();
      });
    });

    describe("should work on correct type argument", () => {
      it("minimal argument (with empty arrays)", () => {
        const argument = {
          windowsTerminals: [], // An empty `TerminalArray` item.
          linuxTerminals: [], // An empty `TerminalArray` item.
          osxTerminals: [] // An empty `TerminalArray` item.
        };

        const value = DefaultConfiguration.from(argument);

        expect(value.windowsTerminals).to.deep.equal(argument.windowsTerminals);
        expect(value.linuxTerminals).to.deep.equal(argument.linuxTerminals);
        expect(value.osxTerminals).to.deep.equal(argument.osxTerminals);
      });

      it("maximal argument (with non-empty arrays)", () => {
        const argument = {
          windowsTerminals: [{ shell: "shell.exe", id: "0000" }], // A `TerminalArray` item.
          linuxTerminals: [{ shell: "bash", id: "0001" }], // A `TerminalArray` item.
          osxTerminals: [{ shell: "bash", id: "0002" }] // A `TerminalArray` item.
        };

        const value = DefaultConfiguration.from(argument);

        expect(value.windowsTerminals).to.have.lengthOf(1);
        expect(value.windowsTerminals[0]).to.include.keys(
          argument.windowsTerminals[0]
        );

        expect(value.linuxTerminals).to.have.lengthOf(1);
        expect(value.linuxTerminals[0]).to.include.keys(
          argument.linuxTerminals[0]
        );

        expect(value.osxTerminals).to.have.lengthOf(1);
        expect(value.osxTerminals[0]).to.include.keys(argument.osxTerminals[0]);
      });
    });
  });
});
