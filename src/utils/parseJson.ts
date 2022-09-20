export const parseJson = (json: string): any => {
  if (json === '') {
    return undefined;
  } else {
    return JSON.parse(json);
  }
};
