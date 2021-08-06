import { of, reader, Reader } from "../src/Reader";

export const run = (): void => {
  console.log("READER");

  interface Config {
    version: string;
    adminUsers: string[];
  }

  const printVersion = reader(
    (context: Config) => `Version: ${context.version}`
  );
  console.log(printVersion.runWithContext({ version: "1.0", adminUsers: [] }));

  console.log(
    printVersion
      .map((version) => `Starting ${version}`)
      .runWithContext({ version: "1.1", adminUsers: [] })
  );

  const sayHello = reader((context: Config) => {
    return (name: string) => {
      if (context.version === "2.0") {
        return `Ola ${name} !`;
      }
      return `Hello ${name} !`;
    };
  });

  const john = reader((_context: Config) => "John");

  console.log(
    john.ap(sayHello).runWithContext({ version: "2.0", adminUsers: [] })
  );
  console.log(
    john.ap(sayHello).runWithContext({ version: "1.0", adminUsers: [] })
  );

  function isAdmin(name: string): Reader<Config, boolean> {
    return reader((context: Config) => {
      return context.adminUsers.includes(name);
    });
  }

  console.log(
    of<Config, string>("Jane")
      .chain(isAdmin)
      .runWithContext({ version: "1.0", adminUsers: ["Jane"] })
  );
  console.log(
    of<Config, string>("Jane")
      .chain(isAdmin)
      .runWithContext({ version: "1.0", adminUsers: ["John"] })
  );
};
