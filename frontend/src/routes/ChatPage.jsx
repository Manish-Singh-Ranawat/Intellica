import React from "react";
import ChatInputForm from "../components/ChatInputForm";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";
import Markdown from "react-markdown";

const ChatPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: chat, isPending } = useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/chats/${id}`);
      return res.data.chat;
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put(`/chats/${id}`, data);
      return res.data;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["chat", id] });
    },
  });

  if (isPending)
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );

  if (!chat) {
    navigate(`/dashboard`);
  }

  return (
    <div className="relative h-full flex flex-col items-center">
      <div
        id="hideScroll"
        className="flex-1 overflow-y-scroll w-full flex justify-center mb-4"
      >
        <div id="chat" className="w-[90%] lg:w-[60%] flex flex-col gap-4 pt-6">
          {chat?.history?.map((item, index) => (
            <React.Fragment key={index}>
              {item.parts[0].image.url != "" && (
                <img
                  src={item.parts[0].image.url}
                  alt=""
                  className="max-h-48 max-w-48 self-end rounded-xl"
                />
              )}
              <div
                className={` ${
                  item.role == "user"
                    ? "px-2 text-lg bg-gray rounded-2xl max-w-[75%] self-end"
                    : "text-lg leading-8"
                }
                `}
              >
                <Markdown>{item.parts[0].text}</Markdown>
              </div>
            </React.Fragment>
          ))}
          <ChatInputForm mutateAsync={mutateAsync} isMutating={isMutating} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
