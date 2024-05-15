"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // if the person is logining in for the first time it should check if its an existing user to push either to dashboard or login
    setTimeout(() => {
      router.push("/authentication");
    }, 3000);
  }, []);
  return (
    <main className="flex flex-col items-center pb-10">
      <div className="flex flex-col items-center justify-center gap-3 shrink-0 my-auto">
        <Image
          src="/foundation.svg"
          alt="Logo"
          height={130}
          width={130}
          priority
          className="invert dark:invert-0 shrink-0"
        />
        <div className="relative shrink-0 object-contain h-14 w-64">
          <Image
            src="/foundation-text.png"
            alt="Logo"
            fill={true}
            sizes="100%"
            className="dark:invert invert-0"
          />
        </div>
      </div>
      <div className="relative shrink-0 object-contain h-16 w-40 justify-self-end">
        <Image
          src="/powered.png"
          alt="Logo"
          fill={true}
          sizes="100%"
          className="invert dark:invert-0"
        />
      </div>
    </main>
  );
}
