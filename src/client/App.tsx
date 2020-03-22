import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Flashcard from "./Flashcard";
import ColumnsGuide from "./ColumnsGuide";
import { runServerFunction, useInput } from "./common";
import { Button } from "./CommonComponents";

type StateName = "Menu" | "Flashcard" | "Result";

export type ColumnNumbers = {
  entry: number;
  check: number;
  categoryFrom: number;
  categoryTo: number;
  front: number;
  back: number;
  notes: number;
};

const defaultColumnNumbers: ColumnNumbers = {
  entry: 0,
  check: 1,
  categoryFrom: 2,
  categoryTo: 4,
  front: 5,
  back: 6,
  notes: 7
};

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const App: React.FC = () => {
  const [state, setState] = useState<StateName>("Menu");
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [isSheetNamesLoaded, setIsSheetNamesLoaded] = useState(false);
  const [isColumnNamesLoaded, setIsColumnNamesLoaded] = useState(false);

  const targetUrl = useInput("");
  const [fetchUrl, setFetchUrl] = useState("");
  const [sheetNames, setSheetNames] = useState([""]);
  const targetSheetName = useInput("");
  const [fetchSheetName, setFetchSheetName] = useState("");
  const [table, setTable] = useState([[""]]);

  const [columns, setColumns] = useState<ColumnNumbers>(defaultColumnNumbers);

  useEffect(() => {
    const loadSheetName = async () => {
      const names = await runServerFunction("getSheetNames", fetchUrl);
      setSheetNames(names);
      setIsSheetNamesLoaded(true);
    };
    loadSheetName();
  }, [fetchUrl]);
  useEffect(() => {
    const loadTableFromSheet = async () => {
      const tableStr = await runServerFunction(
        "getTableFromSheet",
        fetchUrl,
        fetchSheetName
      );
      setTable(JSON.parse(tableStr));
      setIsTableLoaded(true);
    };
    loadTableFromSheet();
  }, [fetchUrl, fetchSheetName]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    setColumns({ ...columns, [e.target.name]: num });
  };

  const renderNumberInput = <Name extends keyof ColumnNumbers>(name: Name) => {
    return <input type="number" name={name} onChange={handleFormChange} />
  };

  return (
    <Wrapper>
      {state == "Menu" && (
        <div>
          <div>
            <input type="text" {...targetUrl} />
            <Button
              onClick={() => {
                setFetchUrl(targetUrl.value);
              }}
            >
              Set URL
            </Button>
          </div>
          {isSheetNamesLoaded && (
            <div>
              <select {...targetSheetName}>
                {sheetNames.map(name => (
                  <option value={name}>{name}</option>
                ))}
              </select>
              <Button
                onClick={() => {
                  setFetchSheetName(targetSheetName.value);
                  setIsColumnNamesLoaded(true);
                }}
              >
                Set Sheet Name
              </Button>
            </div>
          )}
          {isColumnNamesLoaded && (
            <div>
              <form
                onSubmit={() => {
                  setState("Flashcard");
                  console.log(columns);
                }}
              >
                <p>
                  Entry: {renderNumberInput("entry")}
                  Check: {renderNumberInput("check")}
                </p>
                <p>
                  Category: from {renderNumberInput("categoryFrom")}
                  to {renderNumberInput("categoryTo")}
                </p>
                <p>
                  Card (front): {renderNumberInput("front")}
                  Card (back): {renderNumberInput("back")}
                </p>
                <p>
                  Notes: {renderNumberInput("notes")}
                  <Button type="submit">Submit</Button>
                </p>
              </form>
              <ColumnsGuide headers={table[0]} />
            </div>
          )}
        </div>
      )}
      {state == "Flashcard" && isTableLoaded && (
        <Flashcard table={table} columns={columns} />
      )}
      {state == "Result" && <div></div>}
    </Wrapper>
  );
};

export default App;
