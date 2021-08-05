import { Either, left, liftEither, right } from "../src/Either";

export const run = (): void => {
  console.log("EITHER");

  function divide(a: number, b: number): Either<string, number> {
    if (b === 0) return left("cannot divide by zero");
    return right(a / b);
  }

  console.log("divide(4, 2)", divide(4, 2)); // Right { right: 2 }
  console.log("divide(4, 0)", divide(4, 0)); // Left { left: 'cannot divide by zero' }

  function doubleIfEven(a: number): Either<string, number> {
    if (a % 2 === 0) return right(2 * a);
    return left("cannot double odd number");
  }

  console.log(
    "divide(6, 3).bind(doubleIfEven)",
    divide(6, 3).chain(doubleIfEven)
  ); // Right { right: 4 }
  console.log(
    "divide(6, 3).bind(doubleIfEven)",
    divide(6, 2).chain(doubleIfEven)
  ); // Left { left: 'cannot double odd number' }
  console.log(
    "divide(6, 3).bind(doubleIfEven)",
    divide(6, 0).chain(doubleIfEven)
  ); // Left { left: 'cannot divide by zero' }

  const liftedDoubleIfEven = liftEither(doubleIfEven);

  console.log(
    "liftedDoubleIfEven(divide(6, 3))",
    liftedDoubleIfEven(divide(6, 3))
  ); // Right { right: 4 }
  console.log(
    "liftedDoubleIfEven(divide(6, 3))",
    liftedDoubleIfEven(divide(6, 2))
  ); // Left { left: 'cannot double odd number' }
  console.log(
    "liftedDoubleIfEven(divide(6, 3))",
    liftedDoubleIfEven(divide(6, 0))
  ); // Left { left: 'cannot divide by zero' }
};
