# Unit class

## ✅ Step 1: Add SI Prefix Map

Add this above `Unit` class or in a utility file:

```ts
/**
 * @description Scientific SI prefix multipliers.
 */
const PREFIX_MULTIPLIERS = {
 y: 1e-24,
 z: 1e-21,
 a: 1e-18,
 f: 1e-15,
 p: 1e-12,
 n: 1e-9,
 μ: 1e-6,
 u: 1e-6,
 m: 1e-3,
 c: 1e-2,
 d: 1e-1,
 da: 1e1,
 h: 1e2,
 k: 1e3,
 M: 1e6,
 G: 1e9,
 T: 1e12,
 P: 1e15,
 E: 1e18,
 Z: 1e21,
 Y: 1e24,
 '': 1, // base unit, like meter, gram, byte
} as const;

type SIPrefix = keyof typeof PREFIX_MULTIPLIERS;
```

---

## ✅ Step 2: Add Method Inside `Unit` Class

Add this method inside `Unit` class:

```ts
 /**
  * @description Converts a value using scientific prefixes (e.g., kB to MB, mg to g).
  * @param value The value to convert.
  * @param fromPrefix The SI prefix of the source unit.
  * @param toPrefix The SI prefix of the target unit.
  * @returns The converted numeric value.
  */
 static convertByPrefix(value: number, fromPrefix: SIPrefix, toPrefix: SIPrefix): number {
  const fromMultiplier = PREFIX_MULTIPLIERS[fromPrefix];
  const toMultiplier = PREFIX_MULTIPLIERS[toPrefix];

  return (value * fromMultiplier) / toMultiplier;
 }
```

---

## ✅ Example Usage

```ts
Unit.convertByPrefix(1000, 'k', 'M'); // 1
Unit.convertByPrefix(5, 'm', ''); // 0.005
Unit.convertByPrefix(1, 'G', 'M'); // 1000
```

---

## 🔥 Optional Wrapper (Prefix + Unit)

```ts
Unit.convertFromTo(1000, 'kB', 'MB'); // → 1
```

Add:

```ts
 /**
  * @description Converts from prefixed unit string to another (e.g., kB to MB, mg to g).
  * @param value The numeric value.
  * @param from Prefixed unit string (e.g., 'kB', 'mg').
  * @param to Target prefixed unit string (e.g., 'MB', 'g').
  * @returns The converted numeric value.
  */
 static convertFromTo(value: number, from: string, to: string): number {
  const extractPrefix = (str: string): [SIPrefix, string] => {
   const match = str.match(/^(da|[yzafpnμumcdhkMGTPEZY]?)(.+)$/);
   if (!match) throw new Error(`Invalid unit format: ${str}`);
   return [match[1] as SIPrefix, match[2]];
  };

  const [fromPrefix, fromUnit] = extractPrefix(from);
  const [toPrefix, toUnit] = extractPrefix(to);

  if (fromUnit !== toUnit) {
   throw new Error(`Mismatched units: ${fromUnit} vs ${toUnit}`);
  }

  return Unit.convertByPrefix(value, fromPrefix, toPrefix);
 }
```

### Example

```ts
Unit.convertFromTo(1000, 'kB', 'MB'); // 1
Unit.convertFromTo(1, 'GB', 'MB'); // 1000
Unit.convertFromTo(300, 'mg', 'g'); // 0.3
```

------------------------------------------;

```ts
/**
 * @instance Converts using a unit string and returns formatted string with new unit.
 * @param to Target prefixed unit string (e.g., 'MB', 'g')
 * @returns Converted value as formatted string (e.g., "3 g")
 */
convertToUnit(to: string): string {
  const result = Unit.convertFromTo(this.#value, this.#unit, to);
  return `${result} ${to}`;
}
```
