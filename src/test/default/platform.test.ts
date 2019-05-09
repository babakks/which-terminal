// tslint:disable: no-unused-expression

import { expect } from "chai";
import {
  getPlatform,
  Platform,
  onPlatform
} from "../../default/state/platform";
import * as sinon from "sinon";

describe("Platform", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getPlatform()", () => {
    it("should recognize 'Windows' correctly", () => {
      expect(getPlatform("win32")).to.equal(Platform.Windows);
    });

    it("should recognize 'Osx' correctly", () => {
      expect(getPlatform("darwin")).to.equal(Platform.Osx);
    });

    it("should recognize 'Linux' correctly", () => {
      expect(getPlatform("linux")).to.equal(Platform.Linux);
    });

    it("should throw in case of unknown platform", () => {
      expect(() => getPlatform("someUnknownPlatform")).to.throw(
        "Unknown platform."
      );
    });
  });

  describe("onPlatform", () => {
    it("should return correct argument on 'Windows'", () => {
      expect(onPlatform(Platform.Windows, true, false, false)).to.be.true;
    });

    it("should return correct argument on 'Osx'", () => {
      expect(onPlatform(Platform.Osx, false, true, false)).to.be.true;
    });

    it("should return correct argument on 'Linux'", () => {
      expect(onPlatform(Platform.Linux, false, false, true)).to.be.true;
    });
  });
});
