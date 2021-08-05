import { Monad } from "./Monad";

interface StatefulResult<S, R> {
  state: S;
  result: R;
}

class State<S, R> implements Monad<R> {
  constructor(public readonly runState: (s: S) => StatefulResult<S, R>) {}

  public map<U>(fn: (r: R) => U): State<S, U> {
    return new State((s) => ({
      result: fn(this.runState(s).result),
      state: s,
    }));
  }

  public ap<U>(fn: State<S, (r: R) => U>): State<S, U> {
    return new State((s) => {
      const { result: fnResult, state: fnState } = fn.runState(s);
      const { result, state } = this.runState(fnState);
      return { result: fnResult(result), state };
    });
  }

  public chain<U>(fn: (r: R) => State<S, U>): State<S, U> {
    return new State((s) => {
      const { result, state } = this.runState(s);
      return fn(result).runState(state);
    });
  }

  public then<U>(computation: State<S, U>): State<S, U> {
    return new State((s) => {
      const { state } = this.runState(s);
      return computation.runState(state);
    });
  }
}
export function state<S, R>(
  runState: (s: S) => StatefulResult<S, R>
): State<S, R> {
  return new State(runState);
}

export function sequenceState_<S, A>(computations: State<S, A>[]): State<S, A> {
  return computations.reduce((memo: State<S, A>, computation: State<S, A>) => {
    return memo.then(computation);
  });
}
