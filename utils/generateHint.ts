import getRandomLetter from "./getRandomLetter";

export default function generateHint(length: number, name: string) {
  let hint = "";
  const trimmed = name.replace(/\s/g, "");
  for (let i = 0; i < length; i++) {
    hint += getRandomLetter(trimmed);
  }
  return hint;
}
