import ChatInputForm from "../components/ChatInputForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/chats/new", data);
      return res.data;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["allChats"] });
      navigate(`/dashboard/chat/${id}`);
    },
  });

  const options = [
    { img: "/chat.png", text: "Create a New Chat" },
    { img: "/image.png", text: "Analyze Images" },
    { img: "/code.png", text: "Get Code Assistance" },
  ];
  return (
    <div
      id="hideScroll"
      className="relative h-full flex flex-col items-center overflow-y-scroll"
    >
      <div className=" flex-1 flex justify-center items-center flex-col w-[50%] gap-16">
        <div className="flex justify-center items-center gap-6 opacity-50">
          <img src="/logo.png" alt="logo" className="w-16 h-16" />
          <h1 className="text-6xl" id="title">
            Intellica
          </h1>
        </div>
        <div className="hidden lg:flex justify-between items-center gap-12">
          {options.map((option) => (
            <div
              key={option.text}
              className="w-48 flex flex-col justify-center items-center gap-4 p-6 border-2 border-neutral-600 rounded"
            >
              <img src={option.img} alt="" className="w-16" />
              <span className="font-light text-nowrap">{option.text}</span>
            </div>
          ))}
        </div>
      </div>
      <ChatInputForm mutateAsync={mutateAsync} isMutating={isMutating} />
    </div>
  );
};

export default DashboardPage;
