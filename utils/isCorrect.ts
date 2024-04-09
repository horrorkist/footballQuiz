export default function isCorrect(submit: string, answer: string | string[]) {
  const submitTrimmed = submit.replace(/\s/g, "");

  // answer in in a form of array
  if (Array.isArray(answer)) {
    return answer.some((a) => a.replace(/\s/g, "").includes(submitTrimmed));
  }

  // answer is string
  return answer.replace(/\s/g, "").includes(submitTrimmed);
}
