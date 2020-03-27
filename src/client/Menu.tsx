import React, { useState, useEffect } from "react";
import ColumnsGuide from "./ColumnsGuide";
import { runServerFunction, useInput } from "./common";
import { Button } from "./CommonComponents";
import { StateName, ColumnNumbers } from "./types";

type MenuProps = {
  setState: (s: StateName) => void;
  tableState: [string[][], (t: string[][]) => void];
  columnsState: [ColumnNumbers, (c: ColumnNumbers) => void];
  setCheck: (arr: boolean[]) => void;
};

const Menu: React.FC<MenuProps> = props => {
  const [isSheetNamesLoaded, setIsSheetNamesLoaded] = useState(false);
  const [isColumnNamesLoaded, setIsColumnNamesLoaded] = useState(false);

  const targetUrl = useInput("");
  const [fetchUrl, setFetchUrl] = useState("");
  const [sheetNames, setSheetNames] = useState([""]);
  const targetSheetName = useInput("");
  const [fetchSheetName, setFetchSheetName] = useState("");

  const [columns, setColumns] = props.columnsState;
  const [table, setTable] = props.tableState;

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
    };
    loadTableFromSheet();
  }, [fetchUrl, fetchSheetName]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    setColumns({ ...columns, [e.target.name]: num });
  };

  const renderNumberInput = <Name extends keyof ColumnNumbers>(name: Name) => {
    return <input type="number" name={name} onChange={handleFormChange} />;
  };
  return (
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
              props.setCheck(
                table.map(row => JSON.stringify(row[columns.check]) === "true")
              );
              props.setState("Flashcard");
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
  );
};

export default Menu;
