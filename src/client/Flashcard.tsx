import React, { useState, useEffect } from "react";
import CardContent from "./CardContent";
import { StateName, ColumnNumbers } from "./types";
import { Button } from "./CommonComponents";

type FlashCardProps = {
  table: string[][];
  columns: ColumnNumbers;
  setCheck: (fn: (arr: boolean[]) => boolean[]) => void;
  setState: (s: StateName) => void;
};

const Flashcard: React.FC<FlashCardProps> = props => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isCardFront, setIsCardFront] = useState(true);
  const current = props.table[currentNumber];
  const flipCard = () => {
    setIsCardFront(false);
  };
  const nextCard = (isOk: boolean) => {
    setIsCardFront(true);
    props.setCheck(prev => {
      prev[currentNumber] = isOk;
      console.log(prev.slice(1));
      return prev;
    });
    setCurrentNumber(cur => cur + 1);
  };
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (isCardFront) {
        flipCard();
      } else {
        if (e.code === "Space") {
          nextCard(true);
        } else {
          nextCard(false);
        }
      }
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [isCardFront]);

  return (
    <>
      <CardContent
        category={current.slice(
          props.columns.categoryFrom,
          props.columns.categoryTo + 1
        )}
        front={current[props.columns.front]}
        back={current[props.columns.back]}
        notes={current.slice(props.columns.notes)}
        isCardFront={isCardFront}
      />
      {isCardFront ? (
        <Button onClick={flipCard}>Flip</Button>
      ) : (
        <>
          <Button onClick={() => nextCard(false)}>Don't know</Button>
          <Button onClick={() => nextCard(true)}>OK</Button>
        </>
      )}
      <Button onClick={() => props.setState("Result")}>Exit</Button>
    </>
  );
};

export default Flashcard;
