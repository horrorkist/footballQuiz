"use client";

import { SquadMember } from "@/lib/squad";
import generateHint from "@/utils/generateHint";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface QuizProps {
  onCorrect: () => void;
  onIncorrect: () => void;
  onReset: () => void;
  timeLimit: number;
  player: SquadMember;
  hintLength: number;
  questionCount: number;
  showTeamHint: boolean;
  team: string;
}

function Quiz({
  onCorrect,
  onIncorrect,
  onReset,
  timeLimit,
  player,
  hintLength,
  questionCount,
  showTeamHint,
  team,
}: QuizProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const { register, handleSubmit, getValues } = useForm();
  const [hint, setHint] = useState<string>();
  const [isRerolled, setIsRerolled] = useState(false);

  useEffect(() => {
    setHint(generateHint(hintLength, player.name));

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsedTime >= timeLimit && onIncorrect) {
      onIncorrect();
    }
  }, [elapsedTime, timeLimit, onIncorrect]);

  const onSubmit = () => {
    const answer = getValues("answer");
    if (answer.replace(/\s/g, "") === player.name.replace(/\s/g, "")) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  const onReroll = () => {
    setHint(generateHint(hintLength, player.name));
    setIsRerolled(true);
  };

  useEffect(() => {
    //preload image

    const img = new Image();
    img.src = `https://imagedelivery.net/a9xaKxLjpK4A_4a8CoEUJg/${player?.imageId}/main`;
  }, []);

  return (
    <main className="flex flex-col justify-between items-center gap-y-4 max-w-2xl">
      <div className="flex flex-col items-center w-full gap-y-2">
        <div className="w-full">
          <button onClick={onReset} className="btn btn-ghost btn-xs">
            돌아가기
          </button>
        </div>
        <div className="w-full flex">
          <div className="size-16 flex justify-center items-center">
            <h1 className="text-3xl font-medium">{questionCount}.</h1>
          </div>
          <div className="flex w-full gap-x-4">
            {hint?.split("").map((letter, index) => {
              return (
                <div
                  key={index}
                  className="size-16 flex justify-center items-center border-b-2"
                >
                  <span className="text-3xl font-bold">{letter}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`w-full flex ${
            showTeamHint ? "justify-between" : "justify-end"
          }`}
        >
          {showTeamHint && (
            <div className="bg-info flex items-center rounded-full px-2 h-6">
              <span className="text-sm text-info-content font-semibold">
                {team}
              </span>
            </div>
          )}
          <div
            className={`${!isRerolled && "tooltip tooltip-bottom"} active`}
            data-tip="중복 글자가 많다면 클릭!"
          >
            <button
              onClick={onReroll}
              disabled={isRerolled}
              className={`btn ${
                isRerolled ? "btn-disabled" : "btn-ghost"
              } btn-sm`}
            >
              억까 ㄴ
            </button>
          </div>
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
        className="w-full flex justify-center"
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

export default Quiz;
