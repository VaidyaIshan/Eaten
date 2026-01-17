import MoonSVG from "../assets/vectors/Moon"
import LoginSection from "../components/LoginSection/login-section"
export default function LoginPage(){
  return (
    <>
 <div className="min-h-screen w-full flex flex-col items-center relative overflow-hidden">
      
      <div className="w-full flex-none pt-12 pb-10 flex flex-col items-center relative z-10">
        

        <div className="mt-16 mb-4">
          <h1 className="text-white text-[70px] font-bold leading-none">
            Eaten
          </h1>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col items-center">
        <div className="w-full max-w-xs">
          <LoginSection />
        </div>
        
      </div>
    </div>
    </>
  )
}

