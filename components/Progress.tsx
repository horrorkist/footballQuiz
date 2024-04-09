interface ProgressProps {
  questionCount: number;
  maxQuestionCount: number;
}

function Progress({ questionCount, maxQuestionCount }: ProgressProps) {
  return (
    <div className="flex items-center gap-x-4 w-full">
      <progress
        className="progress progress-primary flex-1"
        value={questionCount}
        max={maxQuestionCount}
      ></progress>
      <p className="text-nowrap">
        {questionCount} / {maxQuestionCount}
      </p>
    </div>
  );
}

export default Progress;
