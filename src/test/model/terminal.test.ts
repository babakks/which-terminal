// tslint:disable: no-unused-expression

import { expect } from "chai";
import { Terminal, isTerminal } from "../../model/terminal";

describe("isTerminal()", () => {
  describe("should fail on incompatible argument", () => {
    it("`undefined`/`null` argument", () => {
      expect(isTerminal(undefined)).to.be.false;
      expect(isTerminal(null)).to.be.false;
    });

    it("primitive argument", () => {
      expect(isTerminal(true)).to.be.false;
      expect(isTerminal(false)).to.be.false;
      expect(isTerminal("some-string")).to.be.false;
      expect(isTerminal(123456)).to.be.false;
      expect(isTerminal(new Date("2000-01-01"))).to.be.false;
    });

    it("unknown (object) argument", () => {
      const badArgument = {
        id: "0000",
        someUnknownProperty: true
      };

      expect(isTerminal(badArgument)).to.be.false;
    });

    it("correct properties but incorrect types", () => {
      const badArgument = {
        id: 123,
        shell: ["item 0", "item 1"]
      };

      expect(isTerminal(badArgument)).to.be.false;
    });
  });

  describe("should work on correct type argument", () => {
    it("minimal argument (with only `id` and `shell` properties)", () => {
      const argument = {
        id: "0000",
        shell: "shell.exe"
      };

      expect(isTerminal(argument)).to.be.true;
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

      expect(isTerminal(argument)).to.be.true;
    });
  });
});
