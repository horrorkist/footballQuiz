export default function getRandomLetter(str: string) {
  return str[Math.floor(Math.random() * str.length)];
}
