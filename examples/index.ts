import { Either, Left, liftEither, Right } from "../src/Either";
import { Just, liftMaybe, Maybe, Nothing } from "../src/Maybe";
import { State, sequenceState_ } from "../src/State";

// MAYBE

function maybeFind<T>(elems: T[], predicate: (elem: T) => boolean): Maybe<T> {
  const found = elems.find(predicate);
  return found ? Just(found) : (Nothing as Maybe<T>);
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

console.log("john", john); // JustType { value: { name: 'John', age: 32 } }
console.log("britney", britney); // NothingType {}

console.log(john.apply(Just((p: Person) => p.name.toUpperCase()))); // JustType { value: 'JOHN' }
console.log(john.apply(Nothing as Maybe<(p: Person) => string>)); // NothingType {}

function getAge(person: Person): Maybe<number> {
  return person.age ? Just(person.age) : (Nothing as Maybe<number>);
}

const robert = maybeFind(people, (person) => person.name === "Robert");
const ageOfJohn = john.bind(getAge);
const ageOfBritney = britney.bind(getAge);
const ageOfRobert = robert.bind(getAge);

console.log("ageOfJohn", ageOfJohn); // JustType { value: 32 }
console.log("ageOfBritney", ageOfBritney); // NothingType {}
console.log("ageOfRobert", ageOfRobert); // NothingType {}

const liftedGetAge = liftMaybe(getAge);
console.log("liftedGetAge(john)", liftedGetAge(john)); // JustType { value: 32 }
console.log("liftedGetAge(britney)", liftedGetAge(britney)); // NothingType {}
console.log("liftedGetAge(robert)", liftedGetAge(robert)); // NothingType {}

// EITHER

function divide(a: number, b: number): Either<string, number> {
  if (b === 0) return Left("cannot divide by zero");
  return Right(a / b);
}

console.log("divide(4, 2)", divide(4, 2)); // RightType { right: 2 }
console.log("divide(4, 0)", divide(4, 0)); // LeftType { left: 'cannot divide by zero' }

function doubleIfEven(a: number): Either<string, number> {
  if (a % 2 === 0) return Right(2 * a);
  return Left("cannot double odd number");
}

console.log("divide(6, 3).bind(doubleIfEven)", divide(6, 3).bind(doubleIfEven)); // RightType { right: 4 }
console.log("divide(6, 3).bind(doubleIfEven)", divide(6, 2).bind(doubleIfEven)); // LeftType { left: 'cannot double odd number' }
console.log("divide(6, 3).bind(doubleIfEven)", divide(6, 0).bind(doubleIfEven)); // LeftType { left: 'cannot divide by zero' }

const liftedDoubleIfEven = liftEither(doubleIfEven);

console.log(
  "liftedDoubleIfEven(divide(6, 3))",
  liftedDoubleIfEven(divide(6, 3))
); // RightType { right: 4 }
console.log(
  "liftedDoubleIfEven(divide(6, 3))",
  liftedDoubleIfEven(divide(6, 2))
); // LeftType { left: 'cannot double odd number' }
console.log(
  "liftedDoubleIfEven(divide(6, 3))",
  liftedDoubleIfEven(divide(6, 0))
); // LeftType { left: 'cannot divide by zero' }

// State

interface AppState {
  numberOfUsersLoggedIn: number;
  lastUserLoggedIn: string;
  logs: string[];
}
const initialState: AppState = {
  numberOfUsersLoggedIn: 0,
  lastUserLoggedIn: "",
  logs: [],
};

const userDisconnected = State((appState: AppState) => ({
  result: null,
  state: {
    ...appState,
    numberOfUsersLoggedIn: appState.numberOfUsersLoggedIn - 1,
    logs: [...appState.logs, "disconnect"],
  },
}));

const userConnected = (name: string) => {
  return State((appState: AppState) => ({
    result: null,
    state: {
      ...appState,
      lastUserLoggedIn: name,
      numberOfUsersLoggedIn: appState.numberOfUsersLoggedIn + 1,
      logs: [...appState.logs, "connect " + name],
    },
  }));
};

console.log(userConnected("John").runState(initialState));
/*
{
  result: null,
  state: {
    numberOfUsersLoggedIn: 1,
    lastUserLoggedIn: 'John',
    logs: [ 'connect John' ]
  }
}
*/
console.log(
  userConnected("John").then(userDisconnected).runState(initialState)
);
/*
{
  result: null,
  state: {
    numberOfUsersLoggedIn: 0,
    lastUserLoggedIn: 'John',
    logs: [ 'connect John', 'disconnect' ]
  }
}
*/

console.log(
  sequenceState_([
    userConnected("John"),
    userConnected("Jane"),
    userConnected("Robert"),
    userDisconnected,
    userConnected("John"),
    userDisconnected,
  ]).runState(initialState)
);
/*
{
  result: null,
  state: {
    numberOfUsersLoggedIn: 2,
    lastUserLoggedIn: 'John',
    logs: [
      'connect John',
      'connect Jane',
      'connect Robert',
      'disconnect',
      'connect John',
      'disconnect'
    ]
  }
}
*/

const getLastUserConnected = State((appState: AppState) => ({
  result: appState.lastUserLoggedIn,
  state: appState,
}));

// Reconnect last user
console.log(
  getLastUserConnected.bind(userConnected).runState({
    numberOfUsersLoggedIn: 30,
    lastUserLoggedIn: "John",
    logs: [],
  })
);
/*
{
  result: null,
  state: {
    numberOfUsersLoggedIn: 31,
    lastUserLoggedIn: 'John',
    logs: [ 'connect John' ]
  }
}
*/

const searchLogs = State((appState: AppState) => {
  return {
    result: (search: string) => appState.logs.filter((l) => l.includes(search)),
    state: appState,
  };
});

const someState: AppState = {
  numberOfUsersLoggedIn: 2,
  lastUserLoggedIn: "John",
  logs: [
    "connect John",
    "connect Jane",
    "connect Robert",
    "disconnect",
    "connect John",
    "disconnect",
  ],
};

console.log(getLastUserConnected.apply(searchLogs).runState(someState));
/*
{
  result: [ 'connect John', 'connect John' ],
  state: {
    numberOfUsersLoggedIn: 2,
    lastUserLoggedIn: 'John',
    logs: [
      'connect John',
      'connect Jane',
      'connect Robert',
      'disconnect',
      'connect John',
      'disconnect'
    ]
  }
}
*/
