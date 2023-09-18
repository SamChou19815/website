const sleep = (time = 50): Promise<void> =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, time),
  );

export default sleep;
