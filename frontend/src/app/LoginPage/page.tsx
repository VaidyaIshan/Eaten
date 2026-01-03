import MoonSVG from "../assets/vectors/Moon.tsx"
import LoginSection from "../components/LoginSection/login-section.tsx"

export default function LoginPage(){
  return (
    <>
      <div className = "flex flex-col items-center min-h-screen gap-4 overflow-hidden">

        <div className = "absolute right-2 top-4">
          <MoonSVG/>
        </div>

          <p className = "absolute font-bold text-[80px] leading-none top-[13rem]">Eaten</p>

          <div className = "h-full w-full top-5rem">
            <LoginSection/>
          </div>
      </div>
    </>
  )
}

