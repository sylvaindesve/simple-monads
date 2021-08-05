import { Eq, Monad } from "./Monad";

interface MaybeType<T> extends Monad<T>, Eq<MaybeType<T>> {
  isNothing(): boolean;
  isJust(): boolean;
}

class Nothing<T> implements MaybeType<T> {
  public isNothing(): this is Nothing<T> {
    return true;
  }

  public isJust(): this is Just<T> {
    return false;
  }

  public map<U>(_fn: (a: T) => U): Maybe<U> {
    return nothing();
  }

  public ap<U>(_fn: Maybe<(a: T) => U>): Maybe<U> {
    return nothing();
  }

  public chain<U>(_fn: (a: T) => Maybe<U>): Maybe<U> {
    return nothing();
  }

  public equals(other: Maybe<T>): boolean {
    return !other.isJust();
  }
}

class Just<T> implements MaybeType<T> {
  constructor(public readonly value: T) {}

  public isNothing(): this is Nothing<T> {
    return false;
  }

  public isJust(): this is Just<T> {
    return true;
  }

  public map<U>(fn: (a: T) => U): Maybe<U> {
    return just(fn(this.value));
  }

  public ap<U>(fn: Maybe<(a: T) => U>): Maybe<U> {
    if (fn.isJust()) {
      return this.map(fn.value);
    } else {
      return nothing();
    }
  }

  public chain<U>(fn: (a: T) => Maybe<U>): Maybe<U> {
    return fn(this.value);
  }

  public equals(other: Maybe<T>): boolean {
    return other.isJust() && other.value === this.value;
  }
}

export function nothing<T>(): Nothing<T> {
  return new Nothing<T>();
}
export function just<T>(value: T): Just<T> {
  return new Just(value);
}

export type Maybe<T> = Just<T> | Nothing<T>;

export function liftMaybe<A, B>(
  fn: (t: A) => Maybe<B>
): (t: Maybe<A>) => Maybe<B> {
  return (t: Maybe<A>) => {
    if (t.isJust()) {
      return fn(t.value);
    } else {
      return nothing();
    }
  };
}
