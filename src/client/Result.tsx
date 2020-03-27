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
      <div>
        <Button onClick={() => props.setState("Menu")}>Back to Menu</Button>
      </div>
      <div>
        <textarea>
          {props.check
            .slice(1)
            .map(b => (b ? "TRUE" : "FALSE"))
            .join("\n")}
        </textarea>
      </div>
    </>
  );
};

export default Result;
