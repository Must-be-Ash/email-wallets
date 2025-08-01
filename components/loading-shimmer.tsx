import { TextShimmer } from '@/components/ui/text-shimmer';

interface LoadingShimmerProps {
  message: string;
  duration?: number;
}

export function LoadingShimmer({ message, duration = 1.5 }: LoadingShimmerProps) {
  return (
    <div className="flex items-center gap-2">
      <TextShimmer 
        className="text-sm font-medium"
        duration={duration}
      >
        {message}
      </TextShimmer>
      <span className="text-sm">🚀</span>
    </div>
  );
}