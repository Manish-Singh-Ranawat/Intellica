import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList";
import { AlignLeft, Loader, X } from "lucide-react";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  const [showList, setShowList] = useState(false);

  if (!isLoaded)
    return (
      <div className="flex w-full h-full justify-center items-center ">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  return (
    <div className="relative flex mt-4 mb-4 xl:gap-10 w-full h-[95%]">
      <AlignLeft
        size={28}
        className={`${
          showList ? "hidden" : "block"
        } fixed left-2 cursor-pointer hover:opacity-80 z-10 xl:hidden`}
        onClick={() => setShowList((prev) => !prev)}
      />
      <div
        className={` ${
          showList
            ? "max-xl:w-full max-xl:h-full max-xl:absolute max-xl:z-10 max-xl:bg-[#12101b] max-xl:p-6 max-xl:rounded-xl"
            : "max-xl:hidden"
        } w-[25%] xl:mt-4 xl:mb-2 xl:mr-6`}
      >
        <ChatList setShowList={setShowList} />
      </div>
      <div className="bg-[#12101b] w-full rounded-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
