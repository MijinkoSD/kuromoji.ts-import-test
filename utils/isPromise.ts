export function isPromise(obj: any): boolean {
  return obj instanceof Promise || (obj && typeof obj.then === "function");
}
