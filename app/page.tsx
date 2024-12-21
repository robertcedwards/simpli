"use client";
import React, { useEffect, useState } from "react";
import SimliAgent from "@/app/SimliAgent";
import DottedFace from "./Components/DottedFace";
import SimliHeaderLogo from "./Components/Logo";
import Navbar from "./Components/Navbar";
import Image from "next/image";
import GitHubLogo from "@/media/github-mark-white.svg";

const Demo: React.FC = () => {
  const [showDottedFace, setShowDottedFace] = useState(true);

  const onStart = () => {
    console.log("Setting setshowDottedface to false...");
    setShowDottedFace(false);
  };

  const onClose = () => {
    console.log("Setting setshowDottedface to true...");
    setShowDottedFace(true);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center font-abc-repro font-normal text-sm text-white p-8">
      <SimliHeaderLogo />
      <Navbar />

      <div className="absolute top-[32px] right-[32px]">
        <text
          onClick={() => {
            window.open("https://github.com/simliai/create-simli-agent");
          }}
          className="font-bold cursor-pointer mb-8 text-xl leading-8"
        >
          <Image className="w-[20px] inline mr-2" src={GitHubLogo} alt="" />
          create-simli-agent
        </text>
      </div>
      <div className="flex flex-col items-center gap-6 bg-effect15White p-6 pb-[40px] rounded-xl w-full">
        <div>
          {showDottedFace && <DottedFace />}
          <SimliAgent
            onStart={onStart}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default Demo;
