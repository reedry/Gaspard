import { useState } from "react";

export const useQueue = (initialValue: number[]) => {
  const [arr, setArr] = useState(initialValue);
  const [cur, setCur] = useState(0);
  return {
    enqueue: (val: number) => {
      setArr(prev => prev.slice(cur).concat(val));
      setCur(0);
    },
    dequeue: () => {
      const first = cur;
      setCur(prev => prev + 1);
      return arr[first];
    },
    concat: (newarr: number[]) => {
      setArr(prev => prev.slice(cur).concat(newarr));
      setCur(0);
    },
    len: () => {
      return arr.length - cur;
    },
    isEmpty: () => {
      return cur === arr.length;
    }
  };
};
