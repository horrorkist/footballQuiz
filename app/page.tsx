import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-y-16 max-w-2xl">
      <h1 className="text-3xl font-medium">축잘알 퀴즈쇼</h1>
      <ul className="max-w-screen-sm w-full flex flex-col space-y-16">
        <li>
          <Link
            href={"/random"}
            className="btn btn-primary w-full flex items-center"
          >
            랜덤 글자로 이름 맞히기
          </Link>
        </li>
        <li>
          <Link
            href={"/blur"}
            className="btn btn-primary w-full flex items-center"
          >
            흐린 이미지로 선수 맞히기
          </Link>
        </li>
        <li>
          <Link
            href={"/stadium"}
            className="btn btn-primary w-full flex items-center"
          >
            스타디움 맞히기
          </Link>
        </li>
      </ul>
    </main>
  );
}
