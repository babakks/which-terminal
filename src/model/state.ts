import { Order, isOrder } from "./order";

/**
 * Defines an interface for classes that encapsulate the extension's state.
 *
 * @export
 * @interface State
 */
export interface State {
  order: Order;
}

export function isState(object: unknown): object is State {
  return (
    object instanceof Object &&
    object !== null &&
    isOrder((object as State).order)
  );
}
