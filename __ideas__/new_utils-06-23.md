# New Ideas from June 23, 2025

## Extend class details util(s)

~~done~~

```ts
function getInstanceGetterNames(cls: Constructor): string[] {
 const prototype = cls.prototype;
 const descriptors = Object.getOwnPropertyDescriptors(prototype);

 return Object.entries(descriptors)
  .filter(
   ([key, desc]) =>
    typeof desc.get === "function" &&
    key !== "constructor" &&
    !key.startsWith("_") // optional: exclude conventionally-private keys
  )
  .map(([key]) => key);
}

function getStaticGetterNames(cls: Constructor): string[] {
 const descriptors = Object.getOwnPropertyDescriptors(cls);

 return Object.entries(descriptors)
  .filter(
   ([key, desc]) =>
    typeof desc.get === "function" && key !== "prototype"
  )
  .map(([key]) => key);
}

console.info(getStaticGetterNames(Chronos));
console.info(getInstanceGetterNames(Chronos));
```

## New Array util(s)

- Split by property-name

like this:
~~done~~

```ts
const spitArrayByProperty = (arrays: GenericObject[] | undefined) => {
 const arraysByFloor: Record<number, GenericObject[]> = {};

 [...(arrays ?? [])].forEach((array) => {
  if (!arraysByFloor[array.floor_no]) {
   arraysByFloor[array.floor_no] = [];
  }
  arraysByFloor[array.floor_no].push(array);
 });

 return Object.entries(arraysByFloor).map(([floor, arrays]) => ({
  floor: Number(floor),
  arrays,
 }));
};
```

## Create new like previous ones

<!-- - `deleteFields` like `pickFields` -->
- `useClock()` hook for `nhb-hooks`
