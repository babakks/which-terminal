// tslint:disable: no-unused-expression

import { expect } from "chai";
import { DefaultTerminalArray } from "../../defaults/defaultTerminalArray";
import * as terminalArrayModule from "../../model/terminalArray";
import * as sinon from "sinon";

describe("DefaultTerminalArray", () => {
  describe("from()", () => {
    describe("should check argument type compatibility with `isTerminalArray()`", () => {
      it("should call `isTerminalArray()` and throw on an incompatible argument", () => {
        const spy = sinon.spy(terminalArrayModule, "isTerminalArray");
        const badArgument = [
          {
            id: "0000",
            someUnknownProperty: true
          }
        ];

        expect(() => DefaultTerminalArray.from(badArgument)).to.throw(); // "Act" & "Assert"
        expect(spy.called).to.be.true;
        expect(spy.returned(false)).to.be.true;

        sinon.restore();
      });

      it("should call `isTerminalArray()` and proceed on a compatible argument", () => {
        const spy = sinon.spy(terminalArrayModule, "isTerminalArray");
        const argument = [
          {
            id: "0000",
            shell: "shell.exe"
          }
        ];

        expect(() => DefaultTerminalArray.from(argument)).to.not.throw(); // "Act" & "Assert"
        expect(spy.called).to.be.true;
        expect(spy.returned(true)).to.be.true;

        sinon.restore();
      });
    });

    describe("should fail on incompatible argument", () => {
      it("`undefined`/`null` argument", () => {
        expect(() => DefaultTerminalArray.from(undefined)).to.throw();
        expect(() => DefaultTerminalArray.from(null)).to.throw();
      });

      it("primitive argument", () => {
        expect(() => DefaultTerminalArray.from(true)).to.throw();
        expect(() => DefaultTerminalArray.from(false)).to.throw();
        expect(() => DefaultTerminalArray.from("some-string")).to.throw();
        expect(() => DefaultTerminalArray.from(123456)).to.throw();
        expect(() =>
          DefaultTerminalArray.from(new Date("2000-01-01"))
        ).to.throw();
      });

      it("unknown (object) argument", () => {
        const badArgument = {
          someUnknownProperty: true
        };

        expect(() => DefaultTerminalArray.from(badArgument)).to.throw();
      });

      it("array with `undefined`/`null` items", () => {
        expect(() => DefaultTerminalArray.from([undefined])).to.throw();
        expect(() => DefaultTerminalArray.from([null])).to.throw();
        expect(() => DefaultTerminalArray.from([undefined, null])).to.throw();
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

        expect(() => DefaultTerminalArray.from(badArgument)).to.throw();
      });
    });

    describe("should work on correct type argument", () => {
      it("minimal argument (with only one minimal `Terminal`)", () => {
        const argument = [
          {
            id: "0000",
            shell: "shell.exe"
          }
        ];

        const value = DefaultTerminalArray.from(argument);

        expect(value).to.be.an("array");
        expect(value[0]).to.have.property("id", argument[0].id);
        expect(value[0]).to.have.property("shell", argument[0].shell);
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

        const value = DefaultTerminalArray.from(argument);

        expect(value).to.be.an("array");
        expect(value[0]).to.have.property("id", argument[0].id);
        expect(value[0]).to.have.property("shell", argument[0].shell);
      });
    });
  });
});
