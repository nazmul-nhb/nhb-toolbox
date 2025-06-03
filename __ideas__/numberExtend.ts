/**
 * Interface describing extended number methods
 */
// interface ExtendedNumberMethods {
//     double(): number;
//     add(n: number): number;
//     sub(n: number): number;
//   }
  
//   /**
//    * Creates an extended number object that behaves like a number and supports custom methods.
//    * @param value - Initial numeric value
//    * @returns Proxy number with extra methods
//    */
//   export function createExtendedNumber(value: number): number & ExtendedNumberMethods {
//     const methods: ExtendedNumberMethods = {
//       double() {
//         return value * 2;
//       },
//       add(n: number) {
//         return value + n;
//       },
//       sub(n: number) {
//         return value - n;
//       },
//     };
  
//     return new Proxy(value as number, {
//       get(target, prop) {
//         if (prop in methods) {
//           return (methods as any)[prop];
//         }
//         return (target as any)[prop];
//       },
//       // Auto-unbox to primitive
//       valueOf() {
//         return value;
//       },
//     }) as number & ExtendedNumberMethods;
//   }
  

  /**
 * ExtendedNumber wraps native Number and adds custom methods
 */
export class ExtendedNumber extends Number {
    /**
     * Create a new ExtendedNumber instance
     * @param value - initial number value
     */
    constructor(value: number) {
      super(value);
    }
  
    /**
     * Get the primitive number value
     */
    override valueOf(): number {
      return super.valueOf();
    }
  
    /**
     * Custom method: double the number
     * @returns new ExtendedNumber
     */
    double(): ExtendedNumber {
      return new ExtendedNumber(this.valueOf() * 2);
    }
  
    /**
     * Add to current number
     * @param n - number to add
     * @returns new ExtendedNumber
     */
    add(n: number): ExtendedNumber {
      return new ExtendedNumber(this.valueOf() + n);
    }
  
    /**
     * Subtract from current number
     * @param n - number to subtract
     * @returns new ExtendedNumber
     */
    sub(n: number): ExtendedNumber {
      return new ExtendedNumber(this.valueOf() - n);
    }
  }
  
  
const n = new ExtendedNumber(5);

console.info(+n);