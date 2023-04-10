import { expect } from "chai";
import test from "node:test";
import { describe, it } from "vitest";
import { installPackage, logInstallOrder } from "./main";

type MainTest = {
  pkg: string;
  output: string;
};

const tests: MainTest[] = [
  {
    pkg: "grit",
    output: "web -> javascript -> typescript -> python -> grit",
  },
  {
    pkg: "typescript",
    output: "web -> javascript -> typescript",
  },
  {
    pkg: "python",
    output: "python",
  },
  {
    pkg: "bun",
    output: "web -> javascript -> typescript -> node -> bun",
  },
  {
    pkg: "radix",
    output: "web -> javascript -> typescript -> react -> radix",
  },
  {
    pkg: "a",
    output: "d -> b -> c -> a",
  },
];

describe("main", async () => {
  tests.forEach((test) => {
    it(`Should give a correct install order for ${test.pkg}`, () => {
      const deps = installPackage(test.pkg);
      const formatted = logInstallOrder(deps);
      expect(formatted).to.equal(test.output);
    });
  });

  it("Should throw an error if a package is not found", () => {
    expect(() => installPackage("not-found")).to.throw(
      "Package not-found not found!"
    );
  });
});
