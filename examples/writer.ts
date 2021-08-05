import { writer, Writer } from "../src/Writer";

export const run = (): void => {
  console.log("WRITER");

  interface Person {
    name: string;
    belongings: string[];
  }

  const john: Person = { name: "John", belongings: ["keys", "shoes"] };

  function logEnter(p: Person): Writer<string, Person> {
    return writer({ value: p, written: [`${p.name} entered the vault`] });
  }

  console.log(logEnter(john));

  const logGetBelongings = writer({
    value: (person: Person) => person.belongings,
    written: ["Getting belongings"],
  });

  function logValue<T>(v: T): Writer<string, T> {
    return writer({ value: v, written: [`${JSON.stringify(v)}`] });
  }

  console.log(logEnter(john).ap(logGetBelongings).chain(logValue));
};
