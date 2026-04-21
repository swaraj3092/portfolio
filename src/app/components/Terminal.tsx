import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ChevronRight } from "lucide-react";
import { soundManager } from "../utils/sounds";

type CommandResult = {
  command: string;
  output: string | string[];
  type: 'input' | 'output' | 'error';
};

export function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandResult[]>([
    { command: "init", output: "Multiverse Terminal v1.0.4 initialized. Type 'help' for commands.", type: 'output' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen, isMinimized]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.toLowerCase().trim();
    let output: string | string[] = "";
    let type: 'output' | 'error' = 'output';

    switch (cleanCmd) {
      case 'help':
        output = [
          "TACTICAL COMMANDS:",
          "  neofetch      - System overview & specs",
          "  about         - Mission profile / Bio",
          "  skills        - Technical arsenal loadout",
          "  resume        - Fetch identity (PDF)",
          "",
          "UPLINK SHORTCUTS:",
          "  socials       - List all networking hubs",
          "  github        - Direct link to code repositories",
          "  linkedin      - Connect on LinkedIn network",
          "",
          "SYSTEM:",
          "  clear / exit  - Buffer management",
          "  sudo [cmd]    - [CLASSIFIED] Root access"
        ];
        break;
      case 'neofetch':
        output = [
          "      .---.      ",
          "     /     \\    ",
          "    |  S K B |   USER: Swaraj@Multiverse",
          "     \\     /    OS: NeuralVibe_v2.0.4",
          "      '---'      HOST: KIIT_RESEARCH_LAB",
          "                 UPTIME: 2 internships, 12+ projects",
          "                 SHELL: React-TS-Terminal",
          "                 RESOLUTION: 4K_AESTHETIC",
          "                 POWER: 98.7% Stable"
        ];
        break;
      case 'socials':
        output = [
          "Uplink Hubs Found:",
          "  - github   : github.com/swaraj3092",
          "  - linkedin : linkedin.com/in/swaraj-kumar-behera-...",
          "  - email    : swarajbehera923@gmail.com"
        ];
        break;
      case 'github':
        window.open('https://github.com/swaraj3092', '_blank');
        output = "Redirecting to GitHub uplink...";
        break;
      case 'linkedin':
        window.open('https://www.linkedin.com/in/swaraj-kumar-behera-b48b07325/', '_blank');
        output = "Redirecting to LinkedIn uplink...";
        break;
      case 'sudo':
        output = "OVERRIDE ATTEMPT DETECTED. [X] Access Denied. Nice try, hacker.";
        type = 'error';
        break;
      case 'about':
        output = "Swaraj Kumar Behera. AI/ML Research Engineer specializing in computer vision (Cattle Breed AI @ 92.5%) and high-performance automation systems.";
        break;
      case 'skills':
        output = [
          "Technical Arsenal:",
          "  - CORE: Python, PyTorch, React, Next.js",
          "  - AI: CNN, BiLSTM, NLP, Computer Vision",
          "  - TOOLS: Git, FastAPI, SQL, Supabase"
        ];
        break;
      case 'resume':
        output = "Initiating secure transfer of Swaraj_Resume.pdf...";
        window.open('/resume.pdf', '_blank');
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'exit':
        setIsOpen(false);
        return;
      case '':
        return;
      default:
        output = `Command not found: ${cleanCmd}. Type 'help' for tactical assistance.`;
        type = 'error';
    }

    setHistory(prev => [...prev, 
      { command: cmd, output: "", type: 'input' },
      { command: "", output, type }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  return (
    <>
      {/* Floating Toggle Icon */}
      <motion.button
        className="fixed bottom-36 right-6 z-[60] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
        style={{ 
          background: 'rgba(220, 20, 60, 0.15)', 
          border: '1px solid rgba(220, 20, 60, 0.4)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(220, 20, 60, 0.2)'
        }}
        whileHover={{ scale: 1.1, background: 'rgba(220, 20, 60, 0.3)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true);
          soundManager.play('tech', 0.5);
        }}
      >
        <TerminalIcon className="w-5 h-5 text-[#dc143c]" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#dc143c] rounded-full animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '45px' : '400px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-32 right-6 z-[70] w-[350px] md:w-[450px] overflow-hidden shadow-2xl"
            style={{ 
              background: 'rgba(6, 3, 5, 0.95)', 
              border: '1px solid rgba(220, 20, 60, 0.3)',
              borderRadius: '8px',
              fontFamily: 'monospace'
            }}
          >
            {/* Header / Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-[#dc143c]/20 cursor-move">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-[#dc143c]" />
                <span className="text-[10px] text-gray-400 tracking-widest uppercase">System_Terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-500 hover:text-white transition-colors">
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-[#dc143c] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div 
                className="p-4 flex flex-col h-[calc(100%-45px)]"
                onClick={() => inputRef.current?.focus()}
              >
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto mb-4 custom-scrollbar space-y-2"
                >
                  {history.map((item, i) => (
                    <div key={i} className="text-xs leading-relaxed">
                      {item.type === 'input' && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#dc143c]">guest@skb:~$</span>
                          <span className="text-white">{item.command}</span>
                        </div>
                      )}
                      {item.type === 'output' && (
                        <div className="text-gray-400 mt-1">
                          {Array.isArray(item.output) ? (
                            item.output.map((line, j) => <div key={j}>{line}</div>)
                          ) : (
                            <div>{item.output}</div>
                          )}
                        </div>
                      )}
                      {item.type === 'error' && (
                        <div className="text-red-500/80 mt-1">{item.output}</div>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="flex items-center gap-2 pb-2">
                  <span className="text-[#dc143c] text-xs">guest@skb:~$</span>
                  <input
                    ref={inputRef}
                    autoFocus
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      soundManager.playClick();
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-white"
                    spellCheck="false"
                  />
                  <ChevronRight className="w-3.5 h-3.5 text-gray-700 animate-pulse" />
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
