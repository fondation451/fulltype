export const parseJson = (json: string): any => {
  if (!json || json === '') {
    return undefined;
  } else {
    return JSON.parse(json);
  }
};
