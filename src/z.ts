import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

const main = pipe(
    TE.right<string, number>(42),
    TE.map((x) => (x + 1))
  );

main().then(console.log);
  