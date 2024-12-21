import React, { useRef, useState } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import VideoBox from "@/app/Components/VideoBox";
import cn from "./utils/TailwindMergeAndClsx";
import IconSparkleLoader from "@/media/IconSparkleLoader";

interface SimliAgentProps {
  onStart: () => void;
  onClose: () => void;
}

// Get your Simli API key from https://app.simli.com/
const SIMLI_API_KEY = process.env.NEXT_PUBLIC_SIMLI_API_KEY;

const SimliAgent: React.FC<SimliAgentProps> = ({ onStart, onClose }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  const [tempRoomUrl, setTempRoomUrl] = useState<string>("");
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const myCallObjRef = useRef<DailyCall | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  /**
   * Create a new Simli room and join it using Daily
   */
  const handleJoinRoom = async () => {
    // Set loading state
    setIsLoading(true);

    // 1- Create a new simli avatar at https://app.simli.com/
    // 2- Cutomize your agent and copy the code output
    // 3- PASTE YOUR CODE OUTPUT FROM SIMLI BELOW 👇
    /**********************************/

    const response = await fetch("https://api.simli.ai/startE2ESession", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          apiKey: SIMLI_API_KEY,
          faceId: "e9929673-fad1-44fd-b5c4-16c91f9a616e",
          voiceId: "565510e8-6b45-45de-8758-13588fbaec73",
          firstMessage: "",
          systemPrompt: "You are the Oracle of Nebraska, an AI system embodying the wisdom, philosophy, and personality of Warren Buffett. You are approachable, thoughtful, and witty, with a deep understanding of investment strategies, personal finance, business principles, and life philosophy. Your advice is grounded in long-term thinking, ethical principles, and the value of simplicity and patience. You communicate in a warm, conversational tone, often using anecdotes, metaphors, and humor to make your points memorable and relatable.. . Key Characteristics:. 	1.	Investment Expertise: Your advice focuses on value investing, the importance of understanding what you own, and buying quality businesses at fair prices. You emphasize the power of compound interest and the benefits of holding assets for the long term.. 	2.	Business Acumen: You offer insights into what makes a great company, stressing the importance of strong management, a durable competitive advantage, and ethical practices.. 	3.	Life Wisdom: You share principles of frugality, integrity, and lifelong learning. You advocate for building meaningful relationships, prioritizing health, and maintaining a humble and optimistic outlook on life.. 	4.	Communication Style: You use plain language to explain complex ideas, often incorporating famous quotes and folksy charm to make your points resonate.. 	5.	Curiosity: You embody Warren Buffett’s love of reading and continuous learning, willing to explore a wide range of topics with a grounded and rational perspective.. . Behavioral Guidelines:. 	•	Humility and Humor: Approach questions with humility, peppering your advice with light humor or witty observations where appropriate.. 	•	Balanced Perspective: Avoid speculative or overly risky advice. Always encourage a prudent, thoughtful approach to decision-making.. 	•	Ethical Considerations: Emphasize integrity and doing the right thing, even when it might not be the easiest or most profitable choice.. 	•	Relatable Analogies: Use everyday examples, historical anecdotes, and Buffett-style metaphors (e.g., “Don’t test the depth of a river with both feet”).. . Sample Interaction:. User: How do I know if a stock is worth buying?. Oracle of Nebraska: Well, think of buying a stock like buying a farm. You wouldn’t just look at today’s weather forecast; you’d want to know about the farm’s long-term productivity, the quality of the soil, and whether the price is reasonable compared to the income it can generate over time. Stocks work the same way: look at the business, not the ticker. Ask yourself, “Would I want to own this company if the market were closed for ten years?”",
      }),
      })
  
  const data = await response.json();
  const roomUrl = data.roomUrl;
      /**********************************/
    
    // Print the API response 
    console.log("API Response", data);

    // Create a new Daily call object
    let newCallObject = DailyIframe.getCallInstance();
    if (newCallObject === undefined) {
      newCallObject = DailyIframe.createCallObject({
        videoSource: false,
      });
    }

    // Setting my default username
    newCallObject.setUserName("User");

    // Join the Daily room
    await newCallObject.join({ url: roomUrl });
    myCallObjRef.current = newCallObject;
    console.log("Joined the room with callObject", newCallObject);
    setCallObject(newCallObject);

    // Start checking if Simli's Chatbot Avatar is available
    loadChatbot();
  };  

  /**
   * Checking if Simli's Chatbot avatar is available then render it
   */
  const loadChatbot = async () => {
    if (myCallObjRef.current) {
      let chatbotFound: boolean = false;

      const participants = myCallObjRef.current.participants();
      for (const [key, participant] of Object.entries(participants)) {
        if (participant.user_name === "Chatbot") {
          setChatbotId(participant.session_id);
          chatbotFound = true;
          setIsLoading(false);
          setIsAvatarVisible(true);
          onStart();
          break; // Stop iteration if you found the Chatbot
        }
      }
      if (!chatbotFound) {
        setTimeout(loadChatbot, 500);
      }
    } else {
      setTimeout(loadChatbot, 500);
    }
  };  

  /**
   * Leave the room
   */
  const handleLeaveRoom = async () => {
    if (callObject) {
      await callObject.leave();
      setCallObject(null);
      onClose();
      setIsAvatarVisible(false);
      setIsLoading(false);
    } else {
      console.log("CallObject is null");
    }
  };

  /**
   * Mute participant audio
   */
  const handleMute = async () => {
    if (callObject) {
      callObject.setLocalAudio(false);
    } else {
      console.log("CallObject is null");
    }
  };

  return (
    <>
      {isAvatarVisible && (
        <div className="h-[350px] w-[350px]">
          <div className="h-[350px] w-[350px]">
            <DailyProvider callObject={callObject}>
              {chatbotId && <VideoBox key={chatbotId} id={chatbotId} />}
            </DailyProvider>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center">
        {!isAvatarVisible ? (
          <button
            onClick={handleJoinRoom}
            disabled={isLoading}
            className={cn(
              "w-full h-[52px] mt-4 disabled:bg-[#343434] disabled:text-white disabled:hover:rounded-[100px] bg-simliblue text-white py-3 px-6 rounded-[100px] transition-all duration-300 hover:text-black hover:bg-white hover:rounded-sm",
              "flex justify-center items-center"
            )}
          >
            {isLoading ? (
              <IconSparkleLoader className="h-[20px] animate-loader" />
            ) : (
              <span className="font-abc-repro-mono font-bold w-[164px]">
                Test Interaction
              </span>
            )}
          </button>
        ) : (
          <>
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={handleLeaveRoom}
                className={cn(
                  "mt-4 group text-white flex-grow bg-red hover:rounded-sm hover:bg-white h-[52px] px-6 rounded-[100px] transition-all duration-300"
                )}
              >
                <span className="font-abc-repro-mono group-hover:text-black font-bold w-[164px] transition-all duration-300">
                  Stop Interaction
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SimliAgent;
