import test from "ava";
import Emitter, { Subscriber, NonFunctionSubscriberError, Thrown } from "./";
import returnCatched from "../test-utils/return-catched";

test("Emitter.subscribe should return unsubscribe function", (t) => {
  const emitter = new Emitter<number>();
  let a = 0;
  let unsubscribe = emitter.subscribe((message) => {
    a = message;
  });
  unsubscribe();
  t.is(a, 0);
});

test("Emitter.subscribe should throw instance of NonFunctionSubscriberError if supplied with non function", (t) => {
  const emitter = new Emitter();
  t.is(
    returnCatched(() => emitter.subscribe(true as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
  t.is(
    returnCatched(() => emitter.subscribe(false as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
  t.is(
    returnCatched(() => emitter.subscribe(0 as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
  t.is(
    returnCatched(() => emitter.subscribe(1 as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
  t.is(
    returnCatched(() => emitter.subscribe("string" as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
  t.is(
    returnCatched(() => emitter.subscribe(null as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
  t.is(
    returnCatched(() => emitter.subscribe(undefined as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
  t.is(
    returnCatched(() => emitter.subscribe({} as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
  t.is(
    returnCatched(() => emitter.subscribe([] as any)) instanceof
      NonFunctionSubscriberError,
    true
  );
});

test("Emitter.unsubscribe should return true if argument is subscribed, else return false", (t) => {
  const emitter = new Emitter<number>();
  let unsubscribe = emitter.subscribe(() => {});
  t.is(unsubscribe(), true);
  t.is(unsubscribe(), false);
});

test("Emitter.emit should triggers subscribed subscribers", (t) => {
  const emitter = new Emitter<number>();
  let a = 0;
  let b = 0;
  emitter.subscribe((message) => {
    a = message;
  });
  emitter.subscribe(() => {
    b = 1;
  });

  emitter.emit(3);
  t.is(a, 3);
  t.is(b, 1);
});

test("Emitter.emit should doesn't trigger unsubscribed subscribers", (t) => {
  const emitter = new Emitter<number>();
  let a = 0;
  let subscribeFunction: Subscriber<number> = (message) => {
    a = message;
  };
  emitter.subscribe(subscribeFunction);
  emitter.unsubscribe(subscribeFunction);
  emitter.emit(3);
  t.is(a, 0);
});

test("Emitter.emit should return an array of return value of subscribers", (t) => {
  const emitter = new Emitter();
  emitter.subscribe(() => 0);
  emitter.subscribe(() => 1);
  emitter.subscribe(() => 2);
  const result = emitter.emit(undefined);
  t.is(result[0], 0);
  t.is(result[1], 1);
  t.is(result[2], 2);
});

test("Emitter.emit returns Thrown instance if a subscriber throws an exception at the index of supposed return value", (t) => {
  const emitter = new Emitter();
  emitter.subscribe(() => {
    throw "some-throwable";
  });
  emitter.subscribe(() => 1);
  emitter.subscribe(() => 2);
  const result = emitter.emit(1);
  t.is(result[1], 1);
  t.is(result[2], 2);
  t.is(result[0] instanceof Thrown, true);
  t.is(result[0].d, "some-throwable");
});

test("Emitter.clear removes all subscribers", (t) => {
  const emitter = new Emitter();
  const arrSideEffect = [];
  emitter.subscribe(() => arrSideEffect.push(1));
  emitter.subscribe(() => arrSideEffect.push(2));
  emitter.subscribe(() => arrSideEffect.push(3));
  emitter.clear();

  const result = emitter.emit(undefined);
  t.is(result.length, 0);
  t.is(arrSideEffect.length, 0);
});
