import logo from '@/assets/logo.png';
import { motion } from "framer-motion";
// import Link from "next/link";

// import { LogoGoogle, MessageIcon, VercelIcon } from "./icons";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-[500px] mt-20 mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="border-none bg-muted/50 rounded-2xl p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="Pilotcrew.ai Logo" className="w-16 h-16 object-contain" />
          <h2 className="text-xl font-eudoxus-medium text-zinc-900 dark:text-zinc-50 text-center">
            Welcome to Pilotcrew.ai
          </h2>
        </div>
        <p className="text-center">
          This is an agentic model that can help you in your evaluation and validation process. Ask it questions in the lines of better rubrics, comparison parameters, strength and weaknesses, etc.
        </p>
      </div>
    </motion.div>
  );
};