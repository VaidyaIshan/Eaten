const GetAllFeedback = () => {

  return(
    <div className = "flex flex-col w-full">

      <div className = "w-full flex flex-col">
        <p className = "text-[#000000] text-[10px]">See what others are saying below!</p>
        <div className = "w-full h-[2px] bg-[#7466C9] flex justify-end">
          <div className = "relative w-[3.75rem] h-[5px] bg-[#7466C9] rounded-[9px] bottom-[1px] right-[10px]">
            <div className = "hidden">
              <p>placeholder</p>
            </div>
          </div>
        </div>
      </div>

      <div className = "w-full flex-col w-full">
        <div className = "w-full flex flex-row">
          <div className = "w-[1.125rem] h-[1.125rem] rounded-full bg-[#7466C9] text-center">
            <p>A</p>
          </div>
        </div>
      </div>

    </div>
  )

}

export default GetAllFeedback;

