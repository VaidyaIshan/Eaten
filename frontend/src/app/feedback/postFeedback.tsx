const PostFeedback = () => {

  return(

    <div className = "flex flex-col p-0 m-0 gap-5 w-full justify-end items-end">

      <div className = "flex flex-col gap-[4px] w-full m-0 p-0">
        <textarea
          className = "placeholder-gray-500 border border-gray-500 w-full h-[15.25rem] text-gray-900 text-[10px] rounded-[1px] p-[3px]"
          placeholder = "Enter your thoughts..."
        />
      <div className = "flex justify-end">
        <p className = "italic text-[#ACACAC] text-[8px]">
          /*Your feedback will be monitored*/
        </p>
      </div>
      </div>

        <button
          className="bg-primary text-white text-[12px] rounded-[4px] w-[12.813rem] h-[1.813rem]"
        >
          Submit Feedback
        </button>
    </div>

  )
}

export default PostFeedback;
