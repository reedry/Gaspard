import React from "react";

type Props = {
  headers: string[];
};

const ColumnsGuide: React.FC<Props> = props => {
  return (
    <ul>
      {props.headers.map((v, i) => (
        <li>
          {i}: {v}
        </li>
      ))}
    </ul>
  );
};

export default ColumnsGuide;
