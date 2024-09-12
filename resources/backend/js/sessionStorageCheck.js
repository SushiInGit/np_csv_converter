// Check if any sessionStorage:excelData found and calc used data size
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  const value = sessionStorage.getItem(key);
  logger.trace(`SessionStorage: ${key}`, JSON.parse(value));
}

