export interface Eq<T> {
  equals(other: T): boolean;
}

// https://github.com/fantasyland/fantasy-land#functor
export interface Functor<T> {
  map<U>(fn: (t: T) => U): Functor<U>;
}

// https://github.com/fantasyland/fantasy-land#apply
export interface Apply<T> {
  ap<U>(fn: Apply<(t: T) => U>): Apply<U>;
}

// https://github.com/fantasyland/fantasy-land#chain
export interface Chain<T> {
  chain<U>(fn: (t: T) => Chain<U>): Chain<U>;
}

export interface Monad<T> extends Functor<T>, Apply<T>, Chain<T> {}
