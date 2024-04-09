"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SquadMember, squad } from "@/lib/squad";
import generateHint from "@/utils/generateHint";
import Quiz from "@/components/Quiz";

type GameState = "preparation" | "playing" | "intermission" | "result";

interface RandomFormData {
  questionCount: number;
  wordLength: number;
  timeLimit: number;
  teamHint: boolean;
}

export default function Random() {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
  } = useForm<RandomFormData>();
  const [gameState, setGameState] = useState<GameState>("preparation");
  const [list, setList] = useState<SquadMember[]>(squad);
  const router = useRouter();
  const [player, setPlayer] = useState<SquadMember>();
  const [score, setScore] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(0);

  const setNextQuestion = () => {
    setQuestionCount((prev) => prev + 1);
    // pick a random name from the list

    const randomIndex = Math.floor(Math.random() * list.length);

    const player = list[randomIndex];
    setPlayer(player);

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
    setList(squad);
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
          <h1 className="text-3xl font-medium">랜덤 글자로 이름 맞히기</h1>

          <div>
            <p>주어지는 글자로 선수의 이름을 맞히는 게임입니다.</p>
            <p>
              글자의 순서는 무작위이며, 같은 글자가 중복으로 주어질 수도
              있습니다.
            </p>
            <p>예시) 티 스 누 두 -&gt; 크리스티아누 호날두</p>
            <p>문제는 프리미어 리그 빅6 선수들로 구성되어 있습니다.</p>
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
                  <option value="30">30 문제</option>
                </select>
              </div>
              <div className="w-full flex flex-col text-center gap-y-2">
                <p>글자 수</p>
                <select
                  {...register("wordLength", {
                    required: "글자 수를 선택해주세요.",
                    valueAsNumber: true,
                  })}
                  className="select select-primary w-full max-w-xs"
                >
                  <option value="">글자 수</option>
                  <option value="3">3 글자</option>
                  <option value="4">4 글자</option>
                  <option value="5">5 글자</option>
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
            <div className="w-full flex flex-col gap-y-2 items-end">
              <label className="label cursor-pointer flex gap-x-4">
                <span className="label-text flex-1">팀 힌트</span>
                <input
                  {...register("teamHint")}
                  type="checkbox"
                  className="toggle toggle-primary"
                />
              </label>
              {/* <label className="label cursor-pointer flex gap-x-4">
                <span className="label-text">글자 수 힌트</span>
                <input type="checkbox" className="toggle toggle-secondary" />
              </label> */}
            </div>
            <button
              className={`btn ${isValid ? "btn-primary" : "btn-disabled"}`}
            >
              시작하기
            </button>
          </form>
        </div>
      </main>
    );
  } else if (gameState === "playing" && player) {
    return (
      <Quiz
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
        player={player}
        hintLength={getValues("wordLength")}
        timeLimit={getValues("timeLimit")}
        questionCount={questionCount}
        onReset={onReset}
        showTeamHint={getValues("teamHint")}
        team={player?.team || ""}
      />
    );
  } else if (gameState === "intermission") {
    return (
      <main className="flex flex-col items-center gap-y-8 max-w-2xl">
        <h1 className="text-3xl font-medium">{result}</h1>
        <div className="flex flex-col gap-y-4 items-center">
          <div className="artboard artboard-horizontal rounded-lg phone-1 flex justify-center items-center">
            <img
              src={`https://imagedelivery.net/a9xaKxLjpK4A_4a8CoEUJg/${player?.imageId}/main`}
              alt=""
              className="object-contain w-full h-full"
            />
          </div>
          <p className="text-3xl">{player?.name}</p>
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
        <p className="text-2xl">
          점수 : {score} / {getValues("questionCount")}
        </p>
        <div className="flex items-center gap-x-8">
          <button
            onClick={() => {
              setGameState("preparation");
              setList(squad);
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
