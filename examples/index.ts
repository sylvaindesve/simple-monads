import { run as runMaybe } from "./maybe";
import { run as runEither } from "./either";
import { run as runState } from "./state";
import { run as runWriter } from "./writer";
import { run as runReader } from "./reader";

runMaybe();
runEither();
runState();
runWriter();
runReader();
