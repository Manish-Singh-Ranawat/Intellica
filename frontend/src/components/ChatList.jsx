import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Loader, Trash2, X } from "lucide-react";

const ChatList = ({ setShowList }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: allChats, isPending } = useQuery({
    queryKey: ["allChats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/chats/all");
      return res.data.chats;
    },
  });

  const { mutate: deleteChatMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/chats/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allChats"] });
      navigate(`/dashboard`);
    },
  });

  const handleDelete = (chat) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${chat.title}"?`
    );
    if (confirmed) {
      deleteChatMutation(chat._id);
    }
  };

  if (isPending)
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 text-xl relative h-full w-full  max-xl:px-2">
      <div className="w-full flex justify-between items-center">
        <Link
          to="/dashboard"
          className="text-slate-200 hover:text-white"
          onClick={() => setShowList(false)}
        >
          New chat
        </Link>
        <X
          className={`cursor-pointer hover:opacity-80 xl:hidden`}
          onClick={() => setShowList(false)}
        />
      </div>
      <Link
        to="/"
        className=" text-slate-200 hover:text-white"
        onClick={() => setShowList(false)}
      >
        Explore Intellica
      </Link>
      <hr  />
      <span className="font-semibold text-slate-200 hover:text-white">
        Recent Chats
      </span>
      <div
        id="hideScroll"
        className="max-h-[65%] flex flex-col overflow-y-scroll gap-3"
      >
        {allChats &&
          [...allChats]?.reverse().map((chat) => (
            <div
              key={chat._id}
              className="flex justify-between items-center w-full gap-4 hover:bg-gray rounded-lg px-4 py-1"
            >
              <Link
                to={`/dashboard/chat/${chat._id}`}
                className="text-lg flex-1 "
                onClick={() => setShowList(false)}
              >
                {chat.title}
              </Link>
              {!isDeleting && (
                <Trash2
                  size={16}
                  className="cursor-pointer text-red-500"
                  onClick={() => handleDelete(chat)}
                />
              )}
            </div>
          ))}
      </div>
      <div className=" flex gap-6 absolute bottom-4">
        <img
          src="/logo.png"
          alt="logo"
          className="w-10 justify-self-center self-center"
        />
        <div className=" cursor-pointer">
          <p className="text-lg text-slate-200 hover:text-white">
            Upgrade to pro
          </p>
          <p className="text-base text-slate-400">
            Get unlimited access to all features
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
