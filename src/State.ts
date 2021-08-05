interface StatefulResult<S, R> {
  state: S;
  result: R;
}

class StateType<S, R> {
  constructor(public readonly runState: (s: S) => StatefulResult<S, R>) {}

  public fmap<A extends R, B>(fn: (a: A) => B): StateType<S, B> {
    return new StateType((s) => ({
      result: fn(this.runState(s).result as A),
      state: s,
    }));
  }

  public apply<A extends R, B>(fn: StateType<S, (a: A) => B>): StateType<S, B> {
    return new StateType((s) => {
      const { result: fnResult, state: fnState } = fn.runState(s);
      const { result, state } = this.runState(fnState);
      return { result: fnResult(result as A), state };
    });
  }

  public bind<A extends R, B>(fn: (a: A) => StateType<S, B>): StateType<S, B> {
    return new StateType((s) => {
      const { result, state } = this.runState(s);
      return fn(result as A).runState(state);
    });
  }

  public then<B>(computation: StateType<S, B>): StateType<S, B> {
    return new StateType((s) => {
      const { state } = this.runState(s);
      return computation.runState(state);
    });
  }
}
export function State<S, R>(
  runState: (s: S) => StatefulResult<S, R>
): StateType<S, R> {
  return new StateType(runState);
}

export function sequenceState_<S, A>(
  computations: StateType<S, A>[]
): StateType<S, A> {
  return computations.reduce(
    (memo: StateType<S, A>, computation: StateType<S, A>) => {
      return memo.then(computation);
    }
  );
}
