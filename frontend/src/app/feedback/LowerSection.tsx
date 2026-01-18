import PostFeedback from './postFeedback'
import GetAllFeedback from './getAllFeedbacks'

const LowerSection = () => {


  return(
    <div className = "absolute lg:top-[15rem] top-[13.5rem] bottom-0 left-0 right-0 bg-[#FFC75F] w-full max-4xl pt-[10px] m-0">
      <div className = "relative flex flex-col items-center justify-center bg-[#FBF7FF] w-full h-full overflow-y-auto gap-1">
        <p className = "text-[#000000] absolute top-[1rem] left-[1.5rem] lg:text-[28px] text-[18px]">Feedback Form:</p>
        
        <div className = "absolute lg:top-[3.5rem] top-[3rem] left-0 px-[1.5rem] m-0 w-full flex flex-col gap-[2rem]">
          <PostFeedback/>
          <GetAllFeedback/>
        </div>


      </div>
    </div>
  )

}

export default LowerSection
