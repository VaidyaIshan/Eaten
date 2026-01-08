const GetAllFeedback = () => {

  return(
    <div className = "flex flex-grow flex-col w-full gap-[1rem]">

      <div className = "w-full flex flex-col">
        <p className = "text-[#000000] text-[10px]">See what others are saying below!</p>
        <div className = "w-full h-[2px] bg-[#7466C9] flex justify-end items-center rounded-sm">
          <div className = "relative w-[3.75rem] h-[5px] bg-[#7466C9] rounded-[9px] right-[10px]">
            <div className = "hidden">
              {/* <p>placeholder</p> */}
            </div>
          </div>
        </div>
      </div>

      <div className = "w-full flex-col w-full">

        <div className = "w-full flex flex-row items-center justify-start gap-[5px] pb-[5px]">
          <div className = "w-[1.125rem] h-[1.125rem] rounded-full bg-[#7466C9] flex text-center items-center justify-center">
            <p className = "text-[10px]">A</p>
          </div>

          <p className = "text-[#000000] text-[10px]">@AryanShahi</p>
        </div>

        <div className = "bg-[#F3F3F3] flex text-center items-center justify-start h-[1.125rem] p-[3px]">
          <p className = "text-[#000000] text-[10px]">
            &gt; Eaten.
          </p>
        </div>

      </div>


      <div className = "w-full flex-col w-full">

        <div className = "w-full flex flex-row items-center justify-start gap-[5px] pb-[5px]">
          <div className = "w-[1.125rem] h-[1.125rem] rounded-full bg-[#7466C9] flex text-center items-center justify-center">
            <p className = "text-[10px]">A</p>
          </div>

          <p className = "text-[#000000] text-[10px]">@Azrael</p>
        </div>

        <div className = "bg-[#F3F3F3] flex text-center items-center justify-start h-[1.125rem] p-[3px]">
          <p className = "text-[#000000] text-[10px]">
            &gt; I feel quite hungry.
          </p>
        </div>

      </div>

      <div className = "w-full flex-col w-full">

        <div className = "w-full flex flex-row items-center justify-start gap-[5px] pb-[5px]">
          <div className = "w-[1.125rem] h-[1.125rem] rounded-full bg-[#7466C9] flex text-center items-center justify-center">
            <p className = "text-[10px]">D</p>
          </div>

          <p className = "text-[#000000] text-[10px]">@DevilPhantom</p>
        </div>

        <div className = "bg-[#F3F3F3] flex text-center items-center justify-start h-[1.125rem] p-[3px]">
          <p className = "text-[#000000] text-[10px]">
            &gt; Idk here is some lorem text "Lorem ipsum dolor sit...
          </p>
        </div>

      </div>

      <div className = "w-full flex flex-col items-center">
        <div className = "w-full h-[1px] bg-[#EFECEC] flex justify-end">
          <div className = "hidden">
              <p>placeholder</p>
          </div>
        </div>
          <p className = "text-[#CCCCCC] text-[10px] italic">That's all for now...</p>
      </div>
    </div>
  )

}

export default GetAllFeedback;
