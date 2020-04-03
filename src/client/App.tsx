import React, { useState } from "react";
import styled from "styled-components";
import Menu from "./Menu";
import Flashcard from "./Flashcard";
import Result from "./Result";
import { StateName, Columns } from "./types";
import { useQueue } from "./hooks/queue";

const defaultColumns: Columns = {
  entry: 0,
  check: 1,
  categories: [2, 3, 4],
  front: 5,
  back: 6,
  notes: [7, 8, 9, 10]
};

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const App: React.FC = () => {
  const [state, setState] = useState<StateName>("Menu");
  const [table, setTable] = useState([[""]]);
  const [columns, setColumns] = useState<Columns>(defaultColumns);
  const [check, setCheck] = useState([true]);
  const queue = useQueue([]);

  return (
    <Wrapper>
      {state == "Menu" && (
        <Menu
          setState={setState}
          tableState={[table, setTable]}
          columnsState={[columns, setColumns]}
          setCheck={setCheck}
          queue={queue}
        />
      )}
      {state == "Flashcard" && (
        <Flashcard
          table={table}
          columns={columns}
          setCheck={setCheck}
          setState={setState}
          queue={queue}
        />
      )}
      {state == "Result" && <Result setState={setState} check={check} />}
    </Wrapper>
  );
};

export default App;
