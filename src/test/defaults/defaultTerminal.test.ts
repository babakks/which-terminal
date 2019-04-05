// tslint:disable: no-unused-expression

import { expect } from "chai";
import { DefaultTerminal } from "../../defaults/defaultTerminal";
import * as terminalModule from "../../model/terminal";
import * as sinon from "sinon";

describe("DefaultTerminal", () => {
  describe("from()", () => {
    describe("should check argument type compatibility with `isTerminal()`", () => {
      it("should call `isTerminal()` and throw on an incompatible argument", () => {
        const spy = sinon.spy(terminalModule, "isTerminal");
        const badArgument = {
          id: "0000",
          someUnknownProperty: true
        };

        expect(() => DefaultTerminal.from(badArgument)).to.throw(); // "Act" & "Assert"
        expect(spy.called).to.be.true;
        expect(spy.returned(false)).to.be.true;

        sinon.restore();
      });

      it("should call `isTerminal()` and proceed on a compatible argument", () => {
        const spy = sinon.spy(terminalModule, "isTerminal");
        const argument = {
          id: "0000",
          shell: "shell.exe"
        };

        expect(() => DefaultTerminal.from(argument)).to.not.throw(); // "Act" & "Assert"
        expect(spy.called).to.be.true;
        expect(spy.returned(true)).to.be.true;

        sinon.restore();
      });
    });

    describe("should fail on incompatible argument", () => {
      it("`undefined`/`null` argument", () => {
        expect(() => DefaultTerminal.from(undefined)).to.throw();
        expect(() => DefaultTerminal.from(null)).to.throw();
      });

      it("primitive argument", () => {
        expect(() => DefaultTerminal.from(true)).to.throw();
        expect(() => DefaultTerminal.from(false)).to.throw();
        expect(() => DefaultTerminal.from("some-string")).to.throw();
        expect(() => DefaultTerminal.from(123456)).to.throw();
        expect(() => DefaultTerminal.from(new Date("2000-01-01"))).to.throw();
      });

      it("unknown (object) argument", () => {
        const badArgument = {
          id: "0000",
          someUnknownProperty: true
        };

        expect(() => DefaultTerminal.from(badArgument)).to.throw();
      });
    });

    describe("should work on correct type argument", () => {
      it("minimal argument (with only `id` and `shell` properties)", () => {
        const argument = {
          id: "0000",
          shell: "shell.exe"
        };

        const value = DefaultTerminal.from(argument);

        expect(value.id).to.equal(argument.id);
        expect(value.shell).to.equal(argument.shell);
        expect(value.cwd).to.be.undefined;
        expect(value.env).to.be.undefined;
        expect(value.init).to.be.undefined;
        expect(value.shellArgs).to.be.undefined;
        expect(value.title).to.be.undefined;
      });

      it("maximal argument (with all properties)", () => {
        const argument = {
          id: "0000",
          shell: "shell.exe",
          shellArgs: ["/k", "something"],
          env: { MODE: "prod" },
          init: ["cls", "dir"],
          title: "maximal-argument",
          cwd: "c:\\"
        };

        const value = DefaultTerminal.from(argument);

        expect(value.id).to.equal(argument.id);
        expect(value.shell).to.equal(argument.shell);
        expect(value.cwd).to.equal(argument.cwd);
        expect(value.env).to.deep.equal(argument.env);
        expect(value.init).to.deep.equal(argument.init);
        expect(value.shellArgs).to.deep.equal(argument.shellArgs);
        expect(value.title).to.equal(argument.title);
      });
    });
  });
});
