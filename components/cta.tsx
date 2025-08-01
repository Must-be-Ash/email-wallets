import { motion } from "framer-motion";
import TextBlur from "@/components/ui/text-blur";
// import AnimatedShinyText from "@/components/ui/shimmer-text";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-2 pt-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      {/* <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center rounded-full bg-muted/80 text-center">
            <AnimatedShinyText className="px-4 py-1 pb-2">
              <span>Coming soon!</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div> */}

      <motion.img
        src="/logo.svg"
        alt="logo"
        className="mx-auto h-20 w-20 p-1"
        variants={itemVariants}
      />

      <motion.div variants={itemVariants} className="flex flex-col items-center">
        <div className="text-center">
          <TextShimmer
            className="text-3xl font-medium tracking-tighter sm:text-5xl mt-3 pr-2 pl-2"
            duration={3}
            spread={3}
          >
            Get wallet address
          </TextShimmer>
        </div>

        <div className="text-center">
          <TextShimmer
            className="text-3xl font-medium tracking-tighter sm:text-5xl pb-2 pr-2 pl-2"
            duration={3}
            spread={3}
          >
            on email signups
          </TextShimmer>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[27rem] pt-1.5 text-center text-base text-zinc-300 sm:text-lg"
          text="Automaticaly create wallets on signups & send users early supporter's NFTs, perks or tokens, or email them presales instructions for your launch"
          duration={0.8}
        />
      </motion.div>
    </motion.div>
  );
}
