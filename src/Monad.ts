export interface Eq<T> {
  equals(other: T): boolean;
}

// https://github.com/fantasyland/fantasy-land#functor
export interface Functor<T> {
  map<U>(fn: (t: T) => U): Functor<U>;
}

// https://github.com/fantasyland/fantasy-land#apply
export interface Apply<T> extends Functor<T> {
  ap<U>(fn: Apply<(t: T) => U>): Apply<U>;
}

// https://github.com/fantasyland/fantasy-land#chain
export interface Chain<T> extends Apply<T> {
  chain<U>(fn: (t: T) => Chain<U>): Chain<U>;
}

// https://github.com/fantasyland/fantasy-land#applicative

// https://github.com/fantasyland/fantasy-land#monad
// Monad shoudl also be an Applicative and provide an `of` function.
export type Monad<T> = Chain<T>;
