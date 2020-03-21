import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CardContent from "./CardContent";
import { runServerFunction, useInput } from "./common";

type StateName = "Menu" | "Flashcard" | "Result";

type ColumnNumbers = {
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

const Button = styled.button``;

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

  const [currentNumber, setCurrentNumber] = useState(1);
  const [isCardFront, setIsCardFront] = useState(true);

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

  const flipCard = () => {
    setIsCardFront(false);
  };
  const nextCard = () => {
    setIsCardFront(true);
    setCurrentNumber(cur => cur + 1);
  };
  useEffect(() => {
    const onKeyUp = () => {
      if (isCardFront) {
        flipCard();
      } else {
        nextCard();
      }
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [isCardFront]);

  const current = table[currentNumber];

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
                  Entry:
                  <input
                    type="number"
                    name="entry"
                    onChange={handleFormChange}
                  />
                  Check:
                  <input
                    type="number"
                    name="check"
                    onChange={handleFormChange}
                  />
                </p>
                <p>
                  Category: from
                  <input
                    type="number"
                    name="categoryFrom"
                    onChange={handleFormChange}
                  />
                  to
                  <input
                    type="number"
                    name="categoryTo"
                    onChange={handleFormChange}
                  />
                </p>
                <p>
                  Card (front):
                  <input
                    type="number"
                    name="front"
                    onChange={handleFormChange}
                  />
                  Card (back):
                  <input
                    type="number"
                    name="back"
                    onChange={handleFormChange}
                  />
                </p>
                <p>
                  Notes:
                  <input
                    type="number"
                    name="notes"
                    onChange={handleFormChange}
                  />
                  <Button type="submit">Submit</Button>
                </p>
              </form>
              <ul>
                {table[0].map((v, i) => (
                  <li>
                    {i}: {v}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {state == "Flashcard" && isTableLoaded && (
        <>
          <CardContent
            category={current.slice(
              columns.categoryFrom,
              columns.categoryTo + 1
            )}
            front={current[columns.front]}
            back={current[columns.back]}
            notes={current.slice(columns.notes)}
            isCardFront={isCardFront}
          />
          {isCardFront ? (
            <Button onClick={flipCard}>Flip</Button>
          ) : (
            <Button onClick={nextCard}>Next</Button>
          )}
        </>
      )}
      {state == "Result" && <div></div>}
    </Wrapper>
  );
};

export default App;
