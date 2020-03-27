import React from "react";
import { StateName } from "./types";
import { Button } from "./CommonComponents";

type ResultProps = {
  setState: (s: StateName) => void;
  check: boolean[];
};

const Result: React.FC<ResultProps> = props => {
  return (
    <>
      <Button onClick={() => props.setState("Menu")}>Back to Menu</Button>
      <textarea>
        {props.check
          .slice(1)
          .map(b => (b ? "TRUE" : "FALSE"))
          .join("\n")}
      </textarea>
    </>
  );
};

export default Result;
