import {
  Scissors,
  Heart,
  Sparkles,
  Palette,
  User,
  Star,
  Droplets,
  Wind,
  Brush,
  Flower2,
  type LucideProps,
} from "lucide-react";
import { type FC } from "react";

const iconMap: Record<string, FC<LucideProps>> = {
  Scissors,
  Heart,
  Sparkles,
  Palette,
  User,
  Star,
  Droplets,
  Wind,
  Brush,
  Flower2,
};

interface LucideIconProps extends LucideProps {
  name: string;
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
  const IconComponent = iconMap[name] ?? Scissors;
  return <IconComponent {...props} />;
}
