import FeedbackLogo from '../assets/vectors/FeedbackLogo'
const UpperSection = () => {

  return(
    <div className = "flex flex-col items-center gap-2 mt-[5rem] min-h-fit">

      <div className = "flex flex-row items-center gap-[0.688rem]">
        <div className = "">
          <FeedbackLogo/>
        </div>
        <p className = "font-bold lg:text-[60px] text-[32px]">
          Feedback
        </p>
      </div>

      <p className = "w-[11rem] lg:text-[15px] text-[13px] text-center">
        Tell us what you like, dislike, or what we can do better.
      </p>
      
    </div>
  )

}

export default UpperSection
