export const None: unique symbol = Symbol();
export default (fn: Function) => {
  try {
    fn();
    return None;
  } catch (throwable) {
    return throwable;
  }
};
