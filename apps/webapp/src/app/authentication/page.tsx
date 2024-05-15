'use client'
import AppleAuth from "@/components/onboarding/AppleAuth";
import Authentication from "@/components/onboarding/Authentication";
import GoogleAuth from "@/components/onboarding/GoogleAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [login, setLogin] = useState<HTMLButtonElement | boolean>(false)
  return (
    <main className="flex flex-col">
      <div className="banner">
        <Image src='/foundation.svg' alt="Logo" height={180} width={180} priority className="invert dark:invert-0" />
        <h1>Welcome to Foundation</h1>
        <p className="uppercase tracking-[5px]">the web3 standard </p>
      </div>

      {/* Form Authentication */}

      <Authentication login={login} />
      {
        !login ?
          <div className="text-center space-y-5 my-5">
            <span className="text-lg text-[#6A6A6A]">Or continue with</span>
            <div className="flex items-center justify-center gap-4">

              {/* Apple Authentication */}
              <AppleAuth />

              {/* Google Authentication */}
              <GoogleAuth />

            </div>

          </div> :
          <div className="my-5 text-center">
            <Link href='/authentication/forgetmail' className="text-lg underline underline-offset-3">Forget Password?</Link>
          </div>
      }
      <div className="text-center">
        <p className="text-lg text-[#6A6A6A]">{login ? "Don't have an Account?" : "Have an Account?"}
          <Button onClick={() => setLogin(!login)} className="link-colour text-lg p-1 pl-2">{login ? "Sign Up" : "Log In"}</Button>
        </p>
      </div>
      <div className="pt-10 mt-auto pb-10 text-lg text-black dark:text-white">
        <center>
          By continuing, you agree to our

          {/* Terms of Service */}
          <Link href={"/"} className="link-colour">
            {" "} terms of service
          </Link>{" "}
          <br /> and{" "}


          {/* Privacy Policy */}
          <Link href={"/"} className="link-colour">
            privacy policy
          </Link>
        </center>
      </div>
    </main >
  );
}
