export class Thrown {
  d: any;
  constructor(throwable: any) {
    this.d = throwable;
  }
}

export class NonFunctionSubscriberError extends Error {}

export type Subscriber<Message, ReturnType = any> = (
  load: Message
) => ReturnType;

export default class Emitter<Message, ReturnType = any> {
  _subscribers = new Set<Subscriber<Message, ReturnType>>();
  subscribe(subscriber: Subscriber<Message, ReturnType>) {
    if (typeof subscriber !== "function") {
      throw new NonFunctionSubscriberError();
    }
    this._subscribers.add(subscriber);
    return () => this.unsubscribe(subscriber);
  }
  unsubscribe(subscriber: Subscriber<Message, ReturnType>) {
    return this._subscribers.delete(subscriber);
  }
  emit(message: Message) {
    return Array.from(this._subscribers).map((subscriber) => {
      try {
        return subscriber(message);
      } catch (throwable) {
        return new Thrown(throwable);
      }
    });
  }
  clear() {
    this._subscribers = new Set();
  }
}
