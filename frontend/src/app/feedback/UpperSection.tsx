import FeedbackLogo from '../assets/vectors/FeedbackLogo'
const UpperSection = () => {

  return(
    <div className = "flex flex-col items-center gap-2 mt-[5rem] min-h-fit">

      <div className = "flex flex-row items-center gap-[0.688rem]">
        <div className = "w-[1.688rem] h-[1.688rem]">
          <FeedbackLogo/>
        </div>
        <p className = "font-bold text-[32px]">
          Feedback
        </p>
      </div>

      <p className = "w-[11rem] text-[10px] text-center">
        Tell us what you like, dislike, or what we can do better.
      </p>
      
    </div>
  )

}

export default UpperSection
