import React from "react";

type CardContentProps = {
  category: string[];
  front: string;
  back: string;
  notes: string[];
  isCardFront: boolean;
};

const CardContent: React.FC<CardContentProps> = props => {
  return (
    <div>
      <div>{props.category.join(" > ")}</div>
      {props.isCardFront ? (
        <div>{props.front}</div>
      ) : (
        <div>
          <div>{props.back}</div>
          <div>
            {props.notes.map(note => (note === "" ? "None" : note)).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContent;
