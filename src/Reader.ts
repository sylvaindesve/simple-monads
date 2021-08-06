import { Monad } from "./Monad";

export class Reader<C, T> implements Monad<T> {
  constructor(public readonly runWithContext: (context: C) => T) {}

  public map<U>(fn: (t: T) => U): Reader<C, U> {
    return new Reader((context) => fn(this.runWithContext(context)));
  }

  public ap<U>(readerFn: Reader<C, (t: T) => U>): Reader<C, U> {
    return new Reader((context) => {
      const fn = readerFn.runWithContext(context);
      return fn(this.runWithContext(context));
    });
  }

  public chain<U>(fn: (t: T) => Reader<C, U>): Reader<C, U> {
    return new Reader((context) => {
      return fn(this.runWithContext(context)).runWithContext(context);
    });
  }
}

export function reader<C, T>(runWithContext: (context: C) => T): Reader<C, T> {
  return new Reader(runWithContext);
}

// https://github.com/fantasyland/fantasy-land#applicative
export function of<C, T>(value: T): Reader<C, T> {
  return reader((_context: C) => value);
}
