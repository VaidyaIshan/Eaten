import MoonSVG from "../assets/vectors/Moon.tsx"
import LoginSection from "../components/LoginSection/login-section.tsx"

export default function LoginPage(){
  return (
    <>
      <div className = "flex flex-col items-center justify-center min-h-screen gap-4">

        <div className = "absolute right-2 top-4">
          <MoonSVG/>
        </div>

          <p className = "font-bold text-[80px] leading-none">Eaten</p>

          <LoginSection/>
      </div>
    </>
  )
}

