import { packageRepository } from "./mock";

export type PkgNestingMap = {
  [key: string]: number;
};

export function getPkgNestingMap(pkg: string) {
  if (!Object.keys(packageRepository).includes(pkg))
    throw new Error(`Package ${pkg} not found!`);

  const pkgNestingMap: PkgNestingMap = {
    [pkg]: 1,
  };
  const pkgDeps = packageRepository[pkg].deps ?? [];

  pkgDeps.forEach((pkgDep) => {
    const pnm = getPkgNestingMap(pkgDep);

    Object.entries(pnm).forEach(([name, level]) => {
      const currLevel = pkgNestingMap[name] ?? 1;
      pkgNestingMap[name] = Math.max(currLevel, level + 1);
    });
  });

  return pkgNestingMap;
}
