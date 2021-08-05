interface MaybeType<T> {
  isNothing(): boolean;
  isJust(): boolean;
  fmap<P extends T, R>(_fn: (a: P) => R): Maybe<R>;
  apply<A extends T, B>(_fn: Maybe<(a: A) => B>): Maybe<B>;
  bind<A extends T, B>(_fn: (a: A) => Maybe<B>): Maybe<B>;
}

class NothingType<T> implements MaybeType<T> {
  public isNothing(): this is NothingType<T> {
    return true;
  }

  public isJust(): this is JustType<T> {
    return false;
  }

  public fmap<P extends T, R>(_fn: (a: P) => R): Maybe<R> {
    return Nothing as Maybe<R>;
  }

  public apply<A extends T, B>(_fn: Maybe<(a: A) => B>): Maybe<B> {
    return Nothing as Maybe<B>;
  }

  public bind<A extends T, B>(_fn: (a: A) => Maybe<B>): Maybe<B> {
    return Nothing as Maybe<B>;
  }

  public equals(other: Maybe<T>): boolean {
    return !other.isJust();
  }
}

class JustType<T> implements MaybeType<T> {
  constructor(public readonly value: T) {}

  public isNothing(): this is NothingType<T> {
    return false;
  }

  public isJust(): this is JustType<T> {
    return true;
  }

  public fmap<P extends T, R>(fn: (a: P) => R): Maybe<R> {
    return Just(fn(this.value as P));
  }

  public apply<A extends T, B>(fn: Maybe<(a: A) => B>): Maybe<B> {
    if (fn.isJust()) {
      return this.fmap(fn.value);
    } else {
      return Nothing as Maybe<B>;
    }
  }

  public bind<A extends T, B>(fn: (a: A) => Maybe<B>): Maybe<B> {
    return fn(this.value as A);
  }

  public equals(other: Maybe<T>): boolean {
    return other.isJust() && other.value === this.value;
  }
}

export const Nothing = new NothingType();
export function Just<T>(value: T): JustType<T> {
  return new JustType(value);
}

export type Maybe<T> = JustType<T> | NothingType<T>;

export function liftMaybe<A, B>(
  fn: (t: A) => Maybe<B>
): (t: Maybe<A>) => Maybe<B> {
  return (t: Maybe<A>) => {
    if (t.isJust()) {
      return fn(t.value);
    } else {
      return Nothing as Maybe<B>;
    }
  };
}
