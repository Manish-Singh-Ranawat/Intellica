import { useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="h-full flex flex-col justify-center items-center gap-24 relative lg:flex-row">
      {/* background image */}
      <img
        src="/orbital.png"
        alt="background-img"
        className="absolute left-0 bottom-0 opacity-5 animate-rotateOrbital "
      />

      {/* left section */}
      <div className="flex-1 flex flex-col items-center gap-4 z-10">
        <h1 className="text-7xl mb-8 mt-32 lg:text-9xl lg:mt-0" id="title">
          Intellica
        </h1>
        <h2 className=" text-xl text-slate-300 font-semibold text-center">
          Unlock the Power of AI-Powered Conversations
        </h2>
        <h3 className="text-lg max-w-[70%] w-full text-slate-400 text-center text-balance ">
          Seamless, Smart, and Human-Like Interactions Powered by Cutting-Edge
          AI
        </h3>
        <Link
          to="/dashboard"
          className=" mt-4 px-6 py-4 rounded-full text-lg leading-none bg-blue hover:opacity-85 "
        >
          Get started
        </Link>
      </div>

      {/* right section */}
      <div className=" hidden xl:flex h-full flex-1 justify-center items-center flex-col">
        {/* bot image */}
        <div className="flex justify-center items-center rounded-[50px] h-[50%] w-[80%] bg-purple overflow-hidden relative">
          <div
            className="w-[200%] h-full overflow-hidden absolute top-0 left-0 rounded-[50px] opacity-20 animate-slideBg"
            style={{
              backgroundImage: "url(/bg.png)",
              backgroundSize: "auto 100%",
            }}
          ></div>
          <img
            src="/bot.png"
            alt="bot"
            className="w-full h-full object-contain animate-botImage"
          />
        </div>

        {/* animated text box */}
        <div className="flex items-center gap-4 p-4 bg-gray rounded-2xl absolute bottom-36 right-0">
          <img
            src={typingStatus === "human1" ? "/human1.jpeg" : "/human2.jpeg"}
            alt={typingStatus}
            className="object-cover h-12 w-12 rounded-full"
          />

          <TypeAnimation
            sequence={[
              "Alex: Intellica feels like talking to someone who *gets* me.",
              2500,
              () => setTypingStatus("human2"),
              "Sophie: It's my go-to tool for brainstorming and writing help.",
              2500,
              () => setTypingStatus("human1"),
              "Alex: I even use it to debug code faster—total game changer.",
              2500,
              () => setTypingStatus("human2"),
              "Sophie: Clean UI, fast responses. Honestly, it just works.",
              2500,
              () => setTypingStatus("human1"),
            ]}
            wrapper="span"
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
          />
        </div>
      </div>

      {/* bottom section */}
      <div className="flex flex-col justify-center items-center absolute bottom-4">
        <img src="/logo.png" alt="logo" width={24} height={24} />
        <ul className="flex gap-4 mt-2 pe-4 text-slate-400">
          <li className="cursor-pointer hover:text-slate-300">
            Terms of Service
          </li>
          <li>|</li>
          <li className="cursor-pointer hover:text-slate-300">
            Privacy Policy
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
