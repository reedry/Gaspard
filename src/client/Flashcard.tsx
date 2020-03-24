import React, { useState, useEffect } from "react";
import CardContent from "./CardContent";
import { ColumnNumbers } from "./types";
import { Button } from "./CommonComponents";

type FlashCardProps = {
  table: string[][];
  columns: ColumnNumbers;
};

const Flashcard: React.FC<FlashCardProps> = props => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isCardFront, setIsCardFront] = useState(true);
  const current = props.table[currentNumber];
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
        <Button onClick={nextCard}>Next</Button>
      )}
    </>
  );
};

export default Flashcard;
