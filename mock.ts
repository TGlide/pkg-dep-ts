import { Package } from "./types";

export const packageRepository: Record<string, Package> = {
  grit: {
    deps: ["typescript", "python"],
  },
  typescript: {
    deps: ["javascript"],
  },
  javascript: {
    deps: ["web"],
  },
  python: {},
  web: {},
  node: {
    deps: ["javascript"],
  },
  bun: {
    deps: ["typescript", "node"],
  },
  radix: {
    deps: ["react"],
  },
  react: {
    deps: ["typescript"],
  },
  a: {
    deps: ["c", "b"],
  },
  b: {
    deps: ["d", "c"],
  },
  c: {
    deps: ["d"],
  },
  d: {
    deps: ["e", "f"],
  },
  e: {
    deps: ["g"],
  },
  f: {
    deps: ["e"],
  },
  g: {},
};
