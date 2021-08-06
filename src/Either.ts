import { Eq, Monad } from "./Monad";

interface EitherType<R> extends Monad<R>, Eq<EitherType<R>> {
  isLeft(): boolean;
  isRight(): boolean;
}

class Left<L, R> implements EitherType<R> {
  constructor(public readonly left: L) {}

  public isLeft(): this is Left<L, R> {
    return true;
  }

  public isRight(): this is Right<L, R> {
    return false;
  }

  public map<U>(_fn: (a: R) => U): Either<L, U> {
    return left(this.left);
  }

  public ap<U>(_fn: Either<L, (a: R) => U>): Either<L, U> {
    return left(this.left);
  }

  public chain<U>(_fn: (a: R) => Either<L, U>): Either<L, U> {
    return left(this.left);
  }

  public equals(other: Either<L, R>): boolean {
    return other.isLeft() && other.left === this.left;
  }
}
export function left<L, R>(left: L): Left<L, R> {
  return new Left(left);
}

class Right<L, R> implements EitherType<R> {
  constructor(public readonly right: R) {}

  public isLeft(): this is Left<L, R> {
    return false;
  }

  public isRight(): this is Right<L, R> {
    return true;
  }

  public map<U>(fn: (a: R) => U): Either<L, U> {
    return right(fn(this.right));
  }

  public ap<U>(fn: Either<L, (a: R) => U>): Either<L, U> {
    if (fn.isRight()) {
      return this.map(fn.right);
    } else {
      return left(fn.left);
    }
  }

  public chain<U>(fn: (a: R) => Either<L, U>): Either<L, U> {
    return fn(this.right);
  }

  public equals(other: Either<L, R>): boolean {
    return other.isRight() && other.right === this.right;
  }
}
export function right<L, R>(right: R): Right<L, R> {
  return new Right(right);
}

// https://github.com/fantasyland/fantasy-land#applicative
export const of = right;

export type Either<A, B> = Left<A, B> | Right<A, B>;

export function liftEither<L, R1, R2>(
  fn: (t: R1) => Either<L, R2>
): (t: Either<L, R1>) => Either<L, R2> {
  return (t: Either<L, R1>) => {
    if (t.isRight()) {
      return fn(t.right);
    } else {
      return left(t.left);
    }
  };
}
