import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { FaArrowRightLong } from "react-icons/fa6";
import { EnhancedButton } from "@/components/ui/enhanced-btn";
import { BsDiscord } from "react-icons/bs";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import VideoModal, { VideoTrigger } from "@/components/video-modal";

interface FormProps {
  email: string;
  otp: string;
  showOtpInput: boolean;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleOtpChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  loading: boolean;
}

export default function Form({
  email,
  otp,
  showOtpInput,
  handleEmailChange,
  handleOtpChange,
  handleSubmit,
  loading,
}: FormProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleVideoClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleVideoClose = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <motion.div
      className="mt-6 flex w-full max-w-[40rem] flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <Input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={handleEmailChange}
          disabled={showOtpInput}
        />
      </motion.div>
      {showOtpInput && (
        <motion.div variants={itemVariants}>
          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={handleOtpChange}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </motion.div>
      )}
      <motion.div variants={itemVariants}>
        <EnhancedButton
          variant="expandIcon"
          Icon={FaArrowRightLong}
          onClick={handleSubmit}
          iconPlacement="right"
          className="mt-2 w-full"
          disabled={loading}>
          {loading 
            ? "Loading..." 
            : showOtpInput 
              ? "Verify & Join Waitlist!" 
              : "Enter Email"
          }
        </EnhancedButton>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-8 flex w-full items-center justify-center gap-1 text-muted-foreground">
        <p>For any queries, reach out at </p>
        <Link
          href="https://x.com/CoinbaseDev"
          rel="noopener noreferrer"
          target="_blank">
          <FaXTwitter className="h-4 w-4 transition-all duration-200 ease-linear hover:text-[#B8E1FF]" />
        </Link>
        or
        <Link
          href="https://discord.com/invite/cdp"
          rel="noopener noreferrer"
          target="_blank">
          <BsDiscord className="ml-0.5 h-5 w-5 transition-all duration-200 ease-linear hover:text-[#B8E1FF]" />
        </Link>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="mt-2 flex w-full max-w-2xl items-center justify-center gap-1 text-muted-foreground">
        <VideoTrigger onClick={handleVideoClick} />
      </motion.div>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleVideoClose}
        videoUrl="https://www.youtube.com/embed/9KfnGH8Yc2A"
      />
    </motion.div>
  );
}
