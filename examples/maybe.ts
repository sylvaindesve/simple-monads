import { just, liftMaybe, Maybe, nothing } from "../src/Maybe";

export const run = (): void => {
  console.log("MAYBE");

  function maybeFind<T>(elems: T[], predicate: (elem: T) => boolean): Maybe<T> {
    const found = elems.find(predicate);
    return found ? just(found) : nothing();
  }

  interface Person {
    name: string;
    age?: number;
  }

  const people: Person[] = [
    { name: "John", age: 32 },
    { name: "Jane", age: 27 },
    { name: "Robert" },
  ];

  const john = maybeFind(people, (person) => person.name === "John");
  const britney = maybeFind(people, (person) => person.name === "Britney");

  console.log("john", john); // Just { value: { name: 'John', age: 32 } }
  console.log("britney", britney); // Nothing {}

  console.log(john.ap(just((p: Person) => p.name.toUpperCase()))); // Just { value: 'JOHN' }
  console.log(john.ap(nothing<(p: Person) => string>())); // Nothing {}

  function getAge(person: Person): Maybe<number> {
    return person.age ? just(person.age) : nothing();
  }

  const robert = maybeFind(people, (person) => person.name === "Robert");
  const ageOfJohn = john.chain(getAge);
  const ageOfBritney = britney.chain(getAge);
  const ageOfRobert = robert.chain(getAge);

  console.log("ageOfJohn", ageOfJohn); // Just { value: 32 }
  console.log("ageOfBritney", ageOfBritney); // Nothing {}
  console.log("ageOfRobert", ageOfRobert); // Nothing {}

  const liftedGetAge = liftMaybe(getAge);
  console.log("liftedGetAge(john)", liftedGetAge(john)); // Just { value: 32 }
  console.log("liftedGetAge(britney)", liftedGetAge(britney)); // Nothing {}
  console.log("liftedGetAge(robert)", liftedGetAge(robert)); // Nothing {}
};
