interface EitherType<L, R> {
  isLeft(): boolean;
  isRight(): boolean;
  fmap<R1 extends R, R2>(fn: (a: R1) => R2): Either<L, R2>;
  apply<R1 extends R, R2>(fn: Either<L, (a: R1) => R2>): Either<L, R2>;
  bind<R1 extends R, R2>(fn: (a: R1) => Either<L, R2>): Either<L, R2>;
}

class LeftType<L, R> implements EitherType<L, R> {
  constructor(public readonly left: L) {}

  public isLeft(): this is LeftType<L, R> {
    return true;
  }

  public isRight(): this is RightType<L, R> {
    return false;
  }

  public fmap<R1 extends R, R2>(_fn: (a: R1) => R2): Either<L, R2> {
    return Left(this.left);
  }

  public apply<R1 extends R, R2>(_fn: Either<L, (a: R1) => R2>): Either<L, R2> {
    return Left(this.left);
  }

  public bind<R1 extends R, R2>(_fn: (a: R1) => Either<L, R2>): Either<L, R2> {
    return Left(this.left);
  }

  public equals(other: Either<L, R>): boolean {
    return other.isLeft() && other.left === this.left;
  }
}
export function Left<L, R>(left: L): LeftType<L, R> {
  return new LeftType(left);
}

class RightType<L, R> implements EitherType<L, R> {
  constructor(public readonly right: R) {}

  public isLeft(): this is LeftType<L, R> {
    return false;
  }

  public isRight(): this is RightType<L, R> {
    return true;
  }

  public fmap<R1 extends R, R2>(fn: (a: R1) => R2): Either<L, R2> {
    return Right(fn(this.right as R1));
  }

  public apply<R1 extends R, R2>(fn: Either<L, (a: R1) => R2>): Either<L, R2> {
    if (fn.isRight()) {
      return this.fmap(fn.right);
    } else {
      return Left(fn.left);
    }
  }

  public bind<R1 extends R, R2>(fn: (a: R1) => Either<L, R2>): Either<L, R2> {
    return fn(this.right as R1);
  }

  public equals(other: Either<L, R>): boolean {
    return other.isRight() && other.right === this.right;
  }
}
export function Right<L, R>(right: R): RightType<L, R> {
  return new RightType(right);
}

export type Either<A, B> = LeftType<A, B> | RightType<A, B>;

export function liftEither<L, R1, R2>(
  fn: (t: R1) => Either<L, R2>
): (t: Either<L, R1>) => Either<L, R2> {
  return (t: Either<L, R1>) => {
    if (t.isRight()) {
      return fn(t.right);
    } else {
      return Left(t.left);
    }
  };
}
