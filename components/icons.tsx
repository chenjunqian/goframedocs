import {
    Github,
    Moon,
    SunMedium,
    Twitter,
    type Icon as LucideIcon,
} from "lucide-react"

export type Icon = typeof LucideIcon

export const Icons = {
    sun: SunMedium,
    moon: Moon,
    twitter: Twitter,
    gitHub: () => (
        <Github />
    ),
}