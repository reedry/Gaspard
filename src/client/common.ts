import { useState } from "react";

type RPC = typeof import("../server/code");

export const runServerFunction = <Name extends keyof RPC>(
  name: Name,
  ...args: Parameters<RPC[Name]>
): Promise<ReturnType<RPC[Name]>> => {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [name](...args);
  });
};

export const useInput = (initialValue: string) => {
  const [value, set] = useState(initialValue);
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      set(e.target.value)
  };
};
