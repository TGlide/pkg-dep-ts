import { describe, it, expect } from "vitest";

import { getPkgNestingMap, PkgNestingMap } from "./postInterview";

type MainTest = {
  pkg: string;
  output: PkgNestingMap;
};

const tests: MainTest[] = [
  {
    pkg: "grit",
    output: {
      grit: 1,
      typescript: 2,
      python: 2,
      javascript: 3,
      web: 4,
    },
  },
  {
    pkg: "typescript",
    output: {
      typescript: 1,
      javascript: 2,
      web: 3,
    },
  },
  {
    pkg: "python",
    output: {
      python: 1,
    },
  },
  {
    pkg: "bun",
    output: {
      bun: 1,
      typescript: 2,
      node: 2,
      javascript: 3,
      web: 4,
    },
  },
  {
    pkg: "radix",
    output: {
      radix: 1,
      react: 2,
      typescript: 3,
      javascript: 4,
      web: 5,
    },
  },
  {
    pkg: "a",
    output: {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 6,
      f: 5,
      g: 7,
    },
  },
];

describe("postInterview", async () => {
  tests.forEach((test) => {
    it(`Should give a correct install order for ${test.pkg}`, () => {
      const pnm = getPkgNestingMap(test.pkg);
      expect(pnm).to.deep.equal(test.output);
    });
  });

  it("Should throw an error if a package is not found", () => {
    expect(() => getPkgNestingMap("not-found")).to.throw(
      "Package not-found not found!"
    );
  });
});
