# Safe Single Emitter

Safe Single Object Event Emitter that is safe from exception.

```
npm install safe-single-emitter
```

### Table of Contents:

- [Usage](#usage)
  - [Common](#common-usage)
  - [Unsubscription](#unsubscription)
  - [Throwable Return](#thrown)
  - [Clear Subscription](#clear)
- [TypeScript support](#ts-support)

# <a name="usage" /> Usage

##### <a name="common-usage" /> Common Usage

```javascript
import emitter from "safe-single-emitter";

const emitter = new Emitter();
const unsubscribe = emitter.subscribe((message) => {
  console.log("message:", message);
  return "return-value";
});

// Values returned by emit method are returned in an array
emitter.emit();
// ["return-value"]

// Unsubscribe the listener
unsubscribe();
// true
```

### <a name="unsubscription" /> Unsubscription

```javascript
import emitter from "safe-single-emitter";

const emitter = new Emitter();
const listener = () => console.log(1);
const unsubscribe = emitter.subscribe(listener);

// Use the returned unsubscribe function
unsubscribe();

// OR use unsubscribe method
emitter.unsubscribe(listener);
```

### <a name="thrown" /> Throwable Return

```javascript
import emitter, { Thrown } from "safe-single-emitter";

const emitter = new Emitter();
emitter.subscribe((message) => {
  throw 1;
});
emitter.subscribe((message) => {
  return 1;
});

const values = emitter.emit(1);
// [ Thrown { d: 1 }, 1 ]

console.log(values[0] instanceof Thrown);
// true
console.log(values[0].d);
// 1
```

### <a name="clear" /> Clear Subscription

```javascript
import emitter, { Thrown } from "safe-single-emitter";

const emitter = new Emitter();
emitter.subscribe(() => 1);
emitter.subscribe(() => 2);
emitter.subscribe(() => 3);

emitter.clear();
emitter.emit(1);
// []
```

# <a name="ts-support" /> TypeScript Support

```typescript
import emitter, { Listener } from "safe-single-emitter";

type MessageType = number[];
type ReturnType = boolean[];

const emitter = new Emitter<MessageType, ReturnType>();
const listener: Listener<MessageType, ReturnType> = (someNumbers: number) => someNumbers.map(num => num % 2);

emitter.emit([0,1,2,3,4]);
// [false, true, false, true, false]

emitter.emit([0,1,2,3,"4"]);
// Compile error because "4" is not a number
```
