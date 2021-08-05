import { Monad } from "./Monad";

interface RunWriter<W, T> {
  value: T;
  written: W[];
}

export class Writer<W, T> implements Monad<T> {
  constructor(public readonly runWriter: RunWriter<W, T>) {}

  public map<U>(fn: (t: T) => U): Writer<W, U> {
    return new Writer({
      value: fn(this.runWriter.value),
      written: this.runWriter.written,
    });
  }

  public ap<U>(fn: Writer<W, (t: T) => U>): Writer<W, U> {
    const { value: fnv, written: fnw } = fn.runWriter;
    return new Writer({
      value: fnv(this.runWriter.value),
      written: this.runWriter.written.concat(fnw),
    });
  }

  public chain<U>(fn: (t: T) => Writer<W, U>): Writer<W, U> {
    const { value: thisValue, written: thisWritten } = this.runWriter;
    const { value: fnValue, written: fnWritten } = fn(thisValue).runWriter;
    return new Writer({
      value: fnValue,
      written: thisWritten.concat(fnWritten),
    });
  }

  public then<U>(writer: Writer<W, U>): Writer<W, U> {
    return new Writer({
      value: writer.runWriter.value,
      written: this.runWriter.written.concat(writer.runWriter.written),
    });
  }
}

export function writer<W, T>(written: W[], value: T): Writer<W, T> {
  return new Writer({ value, written });
}

export function tell<W>(msg: W): Writer<W, void> {
  return new Writer({ value: void null, written: [msg] });
}
