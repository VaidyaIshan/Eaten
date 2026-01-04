import Button from "../Button/button.tsx"

export default function LoginSection() {

  return(
    <div className = "absolute bottom-0 left-0 right-0 bg-[#FFC75F] w-full max-4xl rounded-t-[5.875rem] pt-[15px] pl-[13px] pr-[13px]">
      <div className = "flex flex-col items-center justify-center bg-[#FBF7FF] bottom-0 h-[35rem] w-full rounded-t-[5.875rem] gap-4">

        <p className = "absolute top-[85px] font-bold text-[32px] text-primary">Welcome back</p>

        <input 
          type = "text"
          name = "username"
          placeholder = "Enter Username"
          className = "absolute top-[12rem] w-[16.813rem] px-4 py-2 border rounded-md text-black outline-none font-bold"
        />

        <input 
          type = "password"
          name = "password"
          placeholder = "Enter Password"
          className = "absolute top-[16rem] w-[16.813rem] px-4 py-2 border rounded-md text-black outline-none font-bold"
        />

        <p className = "absolute right-[75px] bottom-[245px] font-bold text-[13px] text-primary">Forgot Password?</p>

        <Button
          text = "Sign Up"
          className = "absolute bottom-[10rem] bg-primary border-8 border-solid border-accent h-[47px] w-[276px] rounded-xl flex justify-center items-center font-extrabold"
        />

        <p className = "absolute bottom-[6rem] font-bold text-[13px] text-primary">Don't have an account? Sign Up</p>

      </div>
    </div>
  )
}
