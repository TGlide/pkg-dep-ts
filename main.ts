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

function getInnerDeps(deps: DepInstall[]): DepInstall[] {
  let res = [...deps];
  console.log("\nres before", res);

  for (const currDep of deps) {
    if (!Object.keys(packageRepository).includes(currDep.name)) {
      throw new Error(`Package ${currDep.name} not found!`);
    }

    const innerDeps: DepInstall[] = [];
    packageRepository[currDep.name].deps?.forEach((innerDep) => {
      const innerDepInRes = res.find(({ name }) => name === innerDep);
      if (innerDepInRes) {
        const order = Math.max(innerDepInRes.order, currDep.order + 1);
        // const innerDepRegistry = packageRepository[innerDep];
        // deps.forEach((idrDep) => {
        //   if (innerDepRegistry.deps?.includes(idrDep.name)) {
        //     idrDep.order = Math.max(idrDep.order, order + 1);
        //   }
        // });

        innerDeps.push({
          name: innerDep,
          order,
        });
      }
      innerDeps.push({
        name: innerDep,
        order: currDep.order + 1,
      });
    });

    console.log(`\ninnerDeps for ${currDep.name}`, innerDeps);

    res = [
      // Remove duplicates from res, as deeper deps should have a higher order
      ...res.filter(
        ({ name }) => !innerDeps.map(({ name }) => name).includes(name)
      ),
      ...innerDeps,
    ];

    console.log("\nres after", res);
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

const depInstalls = installPackage("grit");
console.log(logInstallOrder(depInstalls));
