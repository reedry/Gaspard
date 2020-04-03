import React, { useState, useEffect } from "react";
import CardContent from "./CardContent";
import { StateName, Columns } from "./types";
import { Button } from "./CommonComponents";
import styled from "styled-components";
import { useQueue } from "./hooks/queue";

type FlashCardProps = {
  table: string[][];
  columns: Columns;
  setCheck: (fn: (arr: boolean[]) => boolean[]) => void;
  setState: (s: StateName) => void;
  queue: ReturnType<typeof useQueue>;
};

const ButtonWrapper = styled.div`
  text-align: center;
`;

const filterColumns = (row: string[], arr: number[]): string[] => {
  return row.filter((_, i) => arr.indexOf(i) !== -1);
};

const Flashcard: React.FC<FlashCardProps> = props => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isCardFront, setIsCardFront] = useState(true);
  const current = props.table[currentNumber];
  const flipCard = () => {
    setIsCardFront(false);
  };
  const nextCard = (isOk: boolean) => {
    if (props.queue.isEmpty()) {
      props.setState("Result");
      return;
    }
    setIsCardFront(true);
    props.setCheck(prev => {
      prev[currentNumber] = isOk;
      return prev;
    });
    setCurrentNumber(props.queue.dequeue());
  };
  useEffect(() => {
    setCurrentNumber(props.queue.dequeue());
  }, []);
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
  useEffect(() => {
    if (current[props.columns.entry] === "") {
      nextCard(false);
    }
  }, [current]);

  return (
    <>
      <div>
        Card No. {currentNumber} ({props.queue.len()} cards left)
      </div>
      <CardContent
        category={filterColumns(current, props.columns.categories)}
        front={current[props.columns.front]}
        back={current[props.columns.back]}
        notes={filterColumns(current, props.columns.notes)}
        isCardFront={isCardFront}
      />
      {isCardFront ? (
        <ButtonWrapper>
          <Button onClick={flipCard}>Flip</Button>
        </ButtonWrapper>
      ) : (
        <ButtonWrapper>
          <Button onClick={() => nextCard(false)}>Don't know</Button>
          <Button onClick={() => nextCard(true)}>OK</Button>
        </ButtonWrapper>
      )}
      <ButtonWrapper>
        <Button onClick={() => props.setState("Result")}>Exit</Button>
      </ButtonWrapper>
    </>
  );
};

export default Flashcard;
