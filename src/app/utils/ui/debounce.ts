const debounceWaitGroups = new Map<string, NodeJS.Timeout>();

export const debounce = (
  callback: () => void,
  key: string,
  timeout = 300
) => {
  if (debounceWaitGroups.has(key)) {
    clearTimeout(debounceWaitGroups.get(key));
  }
  debounceWaitGroups.set(key, setTimeout(() => {
    callback();
  }, timeout));
};