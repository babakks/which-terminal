// tslint:disable: no-unused-expression

import { expect } from "chai";
import { Terminal, isTerminal, isEnvironmentData } from "../../model/terminal";

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

describe("isEnvironmentData()", () => {
  describe("should fail on incompatible argument", () => {
    it("`undefined`/`null` argument", () => {
      expect(isEnvironmentData(undefined)).to.be.false;
      expect(isEnvironmentData(null)).to.be.false;
    });

    it("primitive argument", () => {
      expect(isEnvironmentData(true)).to.be.false;
      expect(isEnvironmentData(false)).to.be.false;
      expect(isEnvironmentData("some-string")).to.be.false;
      expect(isEnvironmentData(123456)).to.be.false;
    });

    it("incompatible (object) argument", () => {
      const badArgument = {
        someKey: 1234 // Not a string value.
      };

      expect(isEnvironmentData(badArgument)).to.be.false;
    });

    it("correct key type but `undefined`/`null` values", () => {
      expect(isEnvironmentData({ someKey: undefined })).to.be.false;
      expect(isEnvironmentData({ someKey: null })).to.be.false;
    });
  });

  it("should work on correct type argument", () => {
    const argument = {
      mode: "dev",
      path: "c:\\;c:\\my\\folder;"
    };

    expect(isEnvironmentData(argument)).to.be.true;
  });
});
