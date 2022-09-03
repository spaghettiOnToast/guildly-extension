export function indexAddress(address) {
  const newHex =
    address.substring(0, 2) + address.substring(3).replace(/^0+/, "");
  return newHex;
}

export function padAddress(address) {
  const length = address.length;
  const neededLength = 66 - length;
  let zeros = "";
  for (var i = 0; i < neededLength; i++) {
    zeros += "0";
  }
  const newHex = address.substring(0, 2) + zeros + address.substring(2);
  return newHex;
}

export function useDisplayName(string) {
  if (string === undefined) return "unknown";
  return string.substring(0, 6) + "..." + string.substring(string.length - 4);
}
