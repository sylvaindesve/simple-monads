import { state, sequenceState_ } from "../src/State";

export const run = (): void => {
  console.log("STATE");

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

  const userDisconnected = state((appState: AppState) => ({
    result: null,
    state: {
      ...appState,
      numberOfUsersLoggedIn: appState.numberOfUsersLoggedIn - 1,
      logs: [...appState.logs, "disconnect"],
    },
  }));

  const userConnected = (name: string) => {
    return state((appState: AppState) => ({
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

  const getLastUserConnected = state((appState: AppState) => ({
    result: appState.lastUserLoggedIn,
    state: appState,
  }));

  // Reconnect last user
  console.log(
    getLastUserConnected.chain(userConnected).runState({
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

  const searchLogs = state((appState: AppState) => {
    return {
      result: (search: string) =>
        appState.logs.filter((l) => l.includes(search)),
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

  console.log(getLastUserConnected.ap(searchLogs).runState(someState));
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
};
