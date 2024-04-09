"use client";

import { SquadMember } from "@/lib/squad";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageComponent from "next/image";

interface BlurQuizProps {
  onCorrect: (score: number) => void;
  onIncorrect: () => void;
  onReset: () => void;
  timeLimit: number;
  player: SquadMember;
  questionCount: number;
  showTeamHint: boolean;
  team: string;
}

function BlurQuiz({
  onCorrect,
  onIncorrect,
  onReset,
  timeLimit,
  player,
  questionCount,
  showTeamHint,
  team,
}: BlurQuizProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [blurStep, setBlurStep] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { register, handleSubmit, getValues } = useForm();
  const blurList = [30, 20, 10, 5];
  const maxBlurStep = 3;
  const maxScore = 4;
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (loading === false) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  const decrementBlur = () => {
    if (blurStep >= maxBlurStep) {
      return;
    }
    setBlurStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (elapsedTime >= timeLimit && onIncorrect) {
      onIncorrect();
    }
  }, [elapsedTime, timeLimit, onIncorrect]);

  const onSubmit = () => {
    const answer = getValues("answer");
    if (answer.replace(/\s/g, "") === player.name.replace(/\s/g, "")) {
      onCorrect(maxScore - blurStep);
    } else {
      onIncorrect();
    }
  };

  useEffect(() => {
    // preload image
    if (player.imageId) {
      const img = new Image();
      img.src = `https://imagedelivery.net/a9xaKxLjpK4A_4a8CoEUJg/${player.imageId}/main`;
    }
  }, [player]);

  return (
    <main className="flex flex-col items-center gap-y-4 max-w-2xl min-w-[500px]">
      <div className="flex flex-col items-center w-full gap-y-2">
        <div className="w-full">
          <button onClick={onReset} className="btn btn-ghost btn-xs">
            돌아가기
          </button>
        </div>
        {showTeamHint && (
          <div className="bg-info flex items-center rounded-full px-2 h-6">
            <span className="text-sm text-info-content font-semibold">
              {team}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-4 w-full items-center">
        <div className="bg-neutral rounded-lg overflow-hidden flex justify-center items-center w-[400px] h-[400px] 2xl:w-[500px] 2xl:h-[500px]">
          <p className={`text-white ${loading ? "block" : "hidden"}`}>
            이미지 로딩 중...
          </p>
          {blurList.map((blur, index) => {
            return (
              //   <img
              //     key={index}
              //     src={`https://imagedelivery.net/a9xaKxLjpK4A_4a8CoEUJg/${player.imageId}/blur${blur}`}
              //     alt="문제"
              //     className={`object-contain w-full h-full ${
              //       blurStep === index ? "block" : "hidden"
              //     }`}
              //   />
              <ImageComponent
                key={index}
                src={`https://imagedelivery.net/a9xaKxLjpK4A_4a8CoEUJg/${player.imageId}/blur${blur}`}
                alt="문제"
                className={`object-contain ${
                  blurStep === index ? "block" : "hidden"
                } ${loading ? "hidden" : "block"}`}
                priority
                width={500}
                height={500}
                onLoad={() => setLoading(false)}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-medium">{questionCount}.</h1>
          <ul className="steps">
            {[0, 1, 2, 3].map((score, index) => {
              return (
                <li
                  key={index}
                  className={`step text-sm ${
                    score <= blurStep && "step-primary"
                  }`}
                  data-content=""
                >
                  {maxScore - score}점
                </li>
              );
            })}
          </ul>
          <button
            disabled={blurStep >= maxBlurStep}
            onClick={decrementBlur}
            className={`btn ${
              blurStep >= maxBlurStep && "btn-disabled"
            } btn-sm mr-4`}
          >
            모르겠어
          </button>
          <div
            className={`radial-progress ${
              loading ? "text-warning" : "text-accent"
            }`}
            style={{ "--value": ((timeLimit - elapsedTime) / timeLimit) * 100 }}
            role="progressbar"
          >
            {timeLimit - elapsedTime}
          </div>
        </div>
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

export default BlurQuiz;
