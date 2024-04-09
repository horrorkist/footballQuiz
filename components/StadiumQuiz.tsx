"use client";

import { Stadium } from "@/lib/stadiums";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageComponent from "next/image";
import isCorrect from "@/utils/isCorrect";
import Progress from "./Progress";

interface StadiumQuizProps {
  onCorrect: () => void;
  onIncorrect: () => void;
  onReset: () => void;
  timeLimit: number;
  stadium: Stadium;
  questionCount: number;
  maxQuestionCount: number;
}

function StadiumQuiz({
  onCorrect,
  onIncorrect,
  onReset,
  timeLimit,
  stadium,
  questionCount,
  maxQuestionCount,
}: StadiumQuizProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const { register, handleSubmit, getValues } = useForm();
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (elapsedTime >= timeLimit && onIncorrect) {
      onIncorrect();
    }
  }, [elapsedTime, timeLimit, onIncorrect]);

  const onSubmit = () => {
    const answer = getValues("answer");
    if (isCorrect(answer, stadium.name)) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  useEffect(() => {
    // preload image
    console.log(stadium);
    if (stadium.imageId) {
      const img = new Image();
      img.src = `https://imagedelivery.net/a9xaKxLjpK4A_4a8CoEUJg/${stadium.imageId}/main`;
    }
  }, [stadium]);

  return (
    <main className="flex flex-col items-center gap-y-4 max-w-2xl min-w-[500px]">
      <div className="flex flex-col items-center w-full gap-y-2">
        <div className="w-full">
          <button onClick={onReset} className="btn btn-ghost btn-xs">
            돌아가기
          </button>
        </div>
      </div>
      <Progress
        questionCount={questionCount}
        maxQuestionCount={maxQuestionCount}
      />
      <div className="flex flex-col space-y-4 w-full items-center">
        <div className="bg-red-500 rounded-lg overflow-hidden flex justify-center items-center w-[400px] h-[400px] 2xl:w-[500px] 2xl:h-[500px]">
          <ImageComponent
            key={stadium.imageId}
            src={`https://imagedelivery.net/a9xaKxLjpK4A_4a8CoEUJg/${stadium.imageId}/main`}
            alt="문제"
            className={`object-contain`}
            priority
            width={500}
            height={500}
          />
        </div>
      </div>
      <div
        className="radial-progress text-accent"
        style={{ "--value": ((timeLimit - elapsedTime) / timeLimit) * 100 }}
        role="progressbar"
      >
        {timeLimit - elapsedTime}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex justify-center mt-auto"
      >
        <input
          {...register("answer", {
            required: true,
          })}
          autoFocus
          placeholder="정답을 입력해주세요."
          type="text"
          autoComplete="off"
          className="input-primary input-md w-full border-b-2 focus:border-none"
        />
      </form>
    </main>
  );
}

export default StadiumQuiz;
