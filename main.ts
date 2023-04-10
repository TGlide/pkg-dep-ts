import { packageRepository } from "./mock";

type DepInstall = {
  name: string;
  /* Order of installation, reversed */
  order: number;
};

export function installPackage(name: string) {
  if (!Object.keys(packageRepository).includes(name)) {
    throw new Error(`Package ${name} not found!`);
  }

  const deps: DepInstall[] = [
    {
      name,
      order: 0,
    },
  ];

  return getInnerDeps(deps);
}

// Given a depInstallList, keep only the highest order
function uniqueDeps(deps: DepInstall[]) {
  const res: DepInstall[] = [];
  deps.forEach((dep) => {
    if (res.some(({ name }) => name === dep.name)) {
      const depInRes = res.find(({ name }) => name === dep.name);
      if (depInRes) {
        depInRes.order = Math.max(depInRes.order, dep.order);
      }
    } else {
      res.push(dep);
    }
  });

  return res;
}

function getInnerDeps(deps: DepInstall[]): DepInstall[] {
  let res = [...deps];

  for (const currDep of deps) {
    if (!Object.keys(packageRepository).includes(currDep.name)) {
      throw new Error(`Package ${currDep.name} not found!`);
    }

    packageRepository[currDep.name].deps?.forEach((innerDep) => {
      const innerDepInRes = res.find(({ name }) => name === innerDep);
      if (innerDepInRes) {
        const order = Math.max(innerDepInRes.order, currDep.order + 1);

        res.push({
          name: innerDep,
          order,
        });
      }
      res.push({
        name: innerDep,
        order: currDep.order + 1,
      });
    });

    res = uniqueDeps(res);
  }

  return hasInnerDeps(res) ? getInnerDeps(res) : res;
}

function hasInnerDeps(deps: DepInstall[]): boolean {
  const depNames = deps.map(({ name }) => name);
  for (const dep of deps) {
    if (!packageRepository[dep.name].deps) continue;
    const pkgDeps = packageRepository[dep.name].deps;
    if (pkgDeps?.some((name) => !depNames.includes(name))) {
      return true;
    }
  }

  return false;
}

export function logInstallOrder(deps: DepInstall[]) {
  return deps
    .sort((a, b) => b.order - a.order)
    .map(({ name }) => name)
    .join(" -> ");
}
