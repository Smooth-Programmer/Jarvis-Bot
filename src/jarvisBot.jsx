import { useEffect, useState, useRef } from "react";
import "./App.css";

const JarvisBot = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => console.log("🎤 Voice recognition started");
    recognition.onerror = (e) => console.error("Speech error:", e);
    recognition.onend = () => {
      console.log("Voice recognition ended");
      if (isListening) recognition.start(); // Auto-restart
    };

    recognition.onresult = (event) => {
      let current = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);

      if (current.toLowerCase().includes("hey jarvis")) {
        const command = current.toLowerCase().replace("hey jarvis", "").trim();
        handleCommand(command);
      }
    };

    recognitionRef.current = recognition;
  }, [isListening]);

  const handleCommand = (cmd) => {
    let msg = "";
    if (cmd.includes("time")) {
      msg = `The current time is ${new Date().toLocaleTimeString()}`;
    } else if (cmd.includes("date")) {
      msg = `Today's date is ${new Date().toLocaleDateString()}`;
    } else if (cmd.includes("hello")) {
      msg = "Hello! I am always listening.";
    } else {
      msg = "Sorry, I didn't understand that command.";
    }

    setResponse(msg);
    speak(msg);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!isListening) {
      recognition.start();
      console.log("🎤 Starting to listen...");
    } else {
      recognition.stop();
      console.log("🛑 Stopped listening.");
    }

    setIsListening(!isListening);
  };

  return (
    <div className="Jarvis-Bot">
      <h1 className="text-3xl font-bold mb-4"> <img style={{width: "44px", height: "41px"}} src="/iron-man.png" alt="iron-man" /> Jarvis Bot Voice Assistant</h1>
      <a href="https://git.io/typing-svg">
        <img
          style={{ paddingLeft: "110px" }}
          src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&pause=1000&color=F7F7F7&width=770&height=92&lines=A+Voice+Assistant+that+uses;Speech+Recognition+to+Convert;+Speech+to+Text+and+Vice+Versa"
          alt="Typing SVG"
        />
      </a>
      <h3>Executing Jarvis’s orders just like Iron Man does!</h3>
      <h4>Tony Stark: Jarvis Reporting</h4>
      <button
        onClick={toggleListening}
        className={`px-6 py-2 rounded-lg text-lg font-semibold ${
          isListening ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>

      <div className="mt-6 w-full max-w-xl text-left">
        <p>
          <strong>You Said: </strong> {transcript}
        </p>
        <p className="mt-2">
          <strong>Jarvis: </strong> {response}
        </p>
      </div>

      <p className="Footer">
        © {new Date().getFullYear()} Jaskaran Singh | All Rights Reserved.
      </p>
    </div>
  );
};

export default JarvisBot;
