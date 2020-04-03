import React, { useState, useEffect } from "react";
import ColumnsGuide from "./ColumnsGuide";
import { runServerFunction } from "./common";
import { useInput } from "./hooks/input";
import { Button } from "./CommonComponents";
import { StateName, ColumnNumbers, ColumnArrays, Columns } from "./types";
import { useQueue } from "./hooks/queue";

type MenuProps = {
  setState: (s: StateName) => void;
  tableState: [string[][], (t: string[][]) => void];
  columnsState: [Columns, (c: Columns) => void];
  setCheck: (arr: boolean[]) => void;
  queue: ReturnType<typeof useQueue>;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    setColumns({ ...columns, [e.target.name]: num });
  };
  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = e.target.value
      .split(/\s?,/)
      .filter(s => {
        return /\s*\d+\s*/.test(s) || /\s*\d+\s*-\s*\d+\s*/.test(s);
      })
      .flatMap(s => {
        const found = s.match(/\d+/g);
        if (!found) return;
        if (found.length > 1) {
          const [start, end] = found.map(s => Number(s));
          if (start > end) return start;
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        } else {
          return Number(found[0]);
        }
      });
    setColumns({ ...columns, [e.target.name]: arr });
  };

  const renderNumberInput = <Name extends keyof ColumnNumbers>(name: Name) => {
    return <input type="number" name={name} onChange={handleInputChange} />;
  };
  const renderArrayInput = <Name extends keyof ColumnArrays>(name: Name) => {
    return <input type="text" name={name} onChange={handleArrayInputChange} />;
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
              props.queue.concat(
                Array.from({ length: table.length - 1 }, (_, i) => i + 1)
              );
              props.setState("Flashcard");
            }}
          >
            <p>
              Entry: {renderNumberInput("entry")}
              Check: {renderNumberInput("check")}
            </p>
            <p>Category: {renderArrayInput("categories")}</p>
            <p>
              Card (front): {renderNumberInput("front")}
              Card (back): {renderNumberInput("back")}
            </p>
            <p>
              Notes: {renderArrayInput("notes")}
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
