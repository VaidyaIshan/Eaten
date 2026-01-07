import PostFeedback from './postFeedback.tsx'
import GetAllFeedback from './getAllFeedbacks.tsx'

const LowerSection = () => {


  return(
    <div className = "absolute top-[13.5rem] bottom-0 left-0 right-0 bg-[#FFC75F] w-full max-4xl pt-[10px] m-0">
      <div className = "flex flex-col items-center justify-center bg-[#FBF7FF] relative bottom-0 w-full h-full gap-1">
        <p className = "text-[#000000] absolute top-[1rem] left-[1.5rem]">Feedback Form:</p>
        
        <div className = "absolute top-[3rem] left-0 px-[1.5rem] m-0 w-full flex flex-col gap-[2rem]">
          <PostFeedback/>
          <GetAllFeedback/>
        </div>


      </div>
    </div>
  )

}

export default LowerSection
