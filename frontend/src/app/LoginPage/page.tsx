import MoonSVG from "../assets/vectors/Moon"
import LoginSection from "../components/LoginSection/login-section"
export default function LoginPage(){
  return (
    <>
      <div className="fixed right-[8px] top-[2rem] z-50">
        <MoonSVG />
      </div>

      <div className="min-h-screen flex flex-col justify-evenly items-center px-4">
        <p className="font-bold text-[80px] leading-none text-center">
          Eaten
        </p>

        <LoginSection />
      </div>
    </>
  )
}

