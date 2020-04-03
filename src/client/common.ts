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
