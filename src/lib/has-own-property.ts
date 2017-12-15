export default function hasOwnProperty(obj: object, ...args: PropertyKey[]): boolean {
  return Object.prototype.hasOwnProperty.apply(obj, args);
}