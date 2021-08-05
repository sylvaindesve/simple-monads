import { tell, writer, Writer } from "../src/Writer";

export const run = (): void => {
  console.log("WRITER");

  interface Person {
    name: string;
    belongings: string[];
  }

  const john: Person = { name: "John", belongings: ["keys", "shoes"] };

  function logEnter(p: Person): Writer<string, Person> {
    return writer([`${p.name} entered the vault`], p);
  }

  console.log(logEnter(john));

  const logGetBelongings = writer(
    ["Getting belongings"],
    (person: Person) => person.belongings
  );

  function logValue<T>(v: T): Writer<string, T> {
    return writer([`${JSON.stringify(v)}`], v);
  }

  console.log(
    logEnter(john).ap(logGetBelongings).chain(logValue).then(tell("finished"))
  );

  /*
    Slighly modified from http://learnyouahaskell.com/for-a-few-monads-more#writer
    (added `tell`)

    multWithLog :: Writer [String] Int
    multWithLog = do
      a <- logNumber 3
      b <- logNumber 5
      tell "multiply " ++ a ++ " with " ++ b
      return (a*b)
  */

  function logNumber(n: number): Writer<string, number> {
    return writer([`got number ${n}`], n);
  }

  // Desugaring do notation : https://en.wikibooks.org/wiki/Haskell/do_notation
  const multWithLog: Writer<string, number> = logNumber(3).chain((a: number) =>
    logNumber(5).chain((b: number) =>
      tell(`multiply ${a} with ${b}`).then(writer([] as string[], a * b))
    )
  );

  console.log(multWithLog);

  console.log(
    writer(["Starting"], 0)
      .chain((a: number) => writer([`adding 3 to ${a}`], a + 3))
      .chain((a: number) => writer([`adding 10 to ${a}`], a + 10))
      .chain((a: number) => writer([`result is ${a}`], a))
  );
};
