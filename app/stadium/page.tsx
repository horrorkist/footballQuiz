"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Stadium, Stadiums } from "@/lib/stadiums";
import StadiumQuiz from "@/components/StadiumQuiz";

type GameState = "preparation" | "playing" | "intermission" | "result";

interface RandomFormData {
  questionCount: number;
  timeLimit: number;
  teamHint: boolean;
}

export default function Stadium() {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
  } = useForm<RandomFormData>();
  const [gameState, setGameState] = useState<GameState>("preparation");
  const [list, setList] = useState<Stadium[]>(Stadiums);
  const router = useRouter();
  const [stadium, setStadium] = useState<Stadium>();
  const [score, setScore] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(0);

  const setNextQuestion = () => {
    setQuestionCount((prev) => prev + 1);
    // pick a random name from the list

    const randomIndex = Math.floor(Math.random() * list.length);

    const stadium = list[randomIndex];
    setStadium(stadium);

    // remove the name from the list

    setList((prev) => {
      const next = [...prev];
      next.splice(randomIndex, 1);
      return next;
    });

    setGameState("playing");
  };

  const onSubmit = () => {
    setNextQuestion();
  };

  const onCorrect = () => {
    setScore((prev) => prev + 1);
    setResult("정답입니다!");
    setGameState("intermission");
  };

  const onIncorrect = () => {
    setResult("틀렸습니다!");
    setGameState("intermission");
  };

  const onReset = () => {
    setGameState("preparation");
    setList(Stadiums);
    setScore(0);
    setQuestionCount(0);
  };

  useEffect(() => {
    const onEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && gameState === "intermission") {
        if (questionCount < getValues("questionCount")) {
          setNextQuestion();
        } else {
          setGameState("result");
        }
      }
    };

    window.addEventListener("keydown", onEnter);

    return () => window.removeEventListener("keydown", onEnter);
  }, [gameState]);

  if (gameState === "preparation") {
    return (
      <main className="flex flex-col items-center gap-y-4 max-w-2xl">
        <div className="w-full">
          <button
            onClick={() => router.replace("/")}
            className="btn btn-ghost btn-sm"
          >
            돌아가기
          </button>
        </div>
        <div className="flex flex-col gap-y-10 items-center w-full">
          <h1 className="text-3xl font-medium">스타디움 맞히기</h1>

          <div>
            <p>경기장의 사진으로 경기장의 이름을 맞히는 게임입니다.</p>
            {/* <p>
              흐린 정도를 낮출 수 있는 버튼이 제공되며, 더 많이 흐려진 상태에서
              맞힐 수록 높은 점수를 얻습니다.
            </p>
            <p>문제는 프리미어 리그 빅6 선수들로 구성되어 있습니다.</p> */}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit, (e) => {})}
            className="flex flex-col items-center w-full gap-y-10 group"
          >
            <div className="flex justify-between gap-x-2 w-full">
              <div className="w-full flex flex-col text-center gap-y-2">
                <p>문제 수</p>
                <select
                  {...register("questionCount", {
                    required: "문제 수를 선택해주세요.",
                    valueAsNumber: true,
                  })}
                  className="select select-primary w-full max-w-xs"
                >
                  <option value="">문제 수</option>
                  <option value="10">10 문제</option>
                  <option value="20">20 문제</option>
                </select>
              </div>
              <div className="w-full flex flex-col text-center gap-y-2">
                <p>제한 시간</p>
                <select
                  {...register("timeLimit", {
                    required: "제한 시간을 선택해주세요.",
                    valueAsNumber: true,
                  })}
                  className="select select-primary w-full max-w-xs"
                >
                  <option value="">제한 시간</option>
                  <option value="10">10초</option>
                  <option value="30">30초</option>
                  <option value="60">60초</option>
                </select>
              </div>
            </div>
            {/* <div className="w-full flex flex-col gap-y-2 items-end">
              <label className="label cursor-pointer flex gap-x-4">
                <span className="label-text flex-1">팀 힌트</span>
                <input
                  {...register("teamHint")}
                  type="checkbox"
                  className="toggle toggle-primary"
                />
              </label>
            </div> */}
            <button
              className={`btn ${isValid ? "btn-primary" : "btn-disabled"}`}
            >
              시작하기
            </button>
          </form>
        </div>
      </main>
    );
  } else if (gameState === "playing" && stadium) {
    return (
      <StadiumQuiz
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
        onReset={onReset}
        stadium={stadium}
        questionCount={questionCount}
        maxQuestionCount={getValues("questionCount")}
        timeLimit={getValues("timeLimit")}
      />
    );
  } else if (gameState === "intermission") {
    return (
      <main className="flex flex-col items-center gap-y-8 max-w-2xl">
        <h1 className="text-3xl font-medium">{result}</h1>
        <div className="flex flex-col gap-y-4 items-center">
          <div className="artboard artboard-horizontal rounded-lg phone-1 flex justify-center items-center">
            <img
              src={`https://imagedelivery.net/a9xaKxLjpK4A_4a8CoEUJg/${stadium?.imageId}/main`}
              alt=""
              className="object-contain w-full h-full"
            />
          </div>
          <p className="text-3xl">{stadium?.name[0]}</p>
        </div>
        {questionCount < getValues("questionCount") ? (
          <button
            onClick={() => setNextQuestion()}
            className="btn btn-primary w-full"
          >
            다음 문제
          </button>
        ) : (
          <button
            onClick={() => setGameState("result")}
            className="btn btn-primary w-full"
          >
            결과 보기
          </button>
        )}
      </main>
    );
  } else if (gameState === "result") {
    return (
      <main className="flex flex-col items-center justify-between max-w-2xl">
        <h1 className="text-3xl font-medium">결과</h1>
        <p className="text-2xl">점수 : {score}</p>
        <div className="flex items-center gap-x-8">
          <button
            onClick={() => {
              setGameState("preparation");
              setList(Stadiums);
              setScore(0);
              setQuestionCount(0);
            }}
            className="btn btn-primary"
          >
            다시 하기
          </button>
          <button
            onClick={() => router.replace("/")}
            className="btn btn-secondary"
          >
            홈으로
          </button>
        </div>
      </main>
    );
  }
}
