import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa6";
import { SiNotion } from "react-icons/si";

import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function Header() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed flex right-0 left-0 justify-between top-0 z-[50] m-4">
      <motion.div variants={itemVariants}>
        <Link href="https://intelligent-sailor-e5c.notion.site/242fdef2343180c69360d6fb47b7f8cd?v=242fdef2343181df8070000cfc46a4f3&pvs=143" rel="noopener noreferrer" target="_blank">
          <Button
            size="sm"
            variant="secondary"
            className="text-[#E6F4FF] transition-all duration-150 ease-linear md:hover:text-[#B8E1FF]">
            <SiNotion className="md:mr-1.5" />
            <span className="hidden md:inline">Notion DB sample</span>
          </Button>
        </Link>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Link href="https://github.com/lakshaybhushan/nextjs-notion-waitlist-template/fork" rel="noopener noreferrer" target="_blank">
          <Button
            size="sm"
            variant="secondary"
            className="text-[#E6F4FF] transition-all duration-150 ease-linear md:hover:text-[#B8E1FF]">
            <FaGithub className="md:mr-1.5" />
            <span className="hidden md:inline">Use this template</span>
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
