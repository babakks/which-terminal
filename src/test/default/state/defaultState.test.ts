// tslint:disable: no-unused-expression

import * as vscode from "vscode";
import { expect } from "chai";
import { DefaultState } from "../../../default/state/defaultState";
import * as sinon from "sinon";
import { FakeExtensionContext } from "./fakeExtensionContext";
import { Platform } from "../../../model/platform";
import { DefaultStateSimpleFixture } from "./defaultState.fixture";

describe("DefaultState", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("constructor()", () => {
    it("should instantiate correctly", () => {
      const context = new FakeExtensionContext();
      expect(() => new DefaultState(Platform.Windows, context)).to.not.throw();
    });
  });

  describe("order", () => {
    describe("get()", () => {
      describe("should return the correct value which matches the platform ", () => {
        it("on Windows", () => {
          const subject = new DefaultStateSimpleFixture(Platform.Windows)
            .subject;
          expect(subject.order).to.deep.equal(["windows1", "windows2"]);
        });

        it("on Osx", () => {
          const subject = new DefaultStateSimpleFixture(Platform.Osx).subject;
          expect(subject.order).to.deep.equal(["osx1", "osx2"]);
        });

        it("on Linux", () => {
          const subject = new DefaultStateSimpleFixture(Platform.Linux).subject;
          expect(subject.order).to.deep.equal(["linux1", "linux2"]);
        });
      });
    });

    describe("set()", () => {
      describe("should set correctly", () => {
        it("on Windows", () => {
          const subject = new DefaultStateSimpleFixture(Platform.Windows)
            .subject;
          subject.order = ["new-windows1", "new-windows2"];
          expect(subject.order).to.deep.equal(["new-windows1", "new-windows2"]);
        });

        it("on Osx", () => {
          const subject = new DefaultStateSimpleFixture(Platform.Osx).subject;
          subject.order = ["new-osx1", "new-osx2"];
          expect(subject.order).to.deep.equal(["new-osx1", "new-osx2"]);
        });

        it("on Linux", () => {
          const subject = new DefaultStateSimpleFixture(Platform.Linux).subject;
          subject.order = ["new-linux1", "new-linux2"];
          expect(subject.order).to.deep.equal(["new-linux1", "new-linux2"]);
        });
      });
    });
  });
});
