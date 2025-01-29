import type React from "react"
import { Facebook, Twitter, LinkedinIcon as LinkedIn, Mail } from "lucide-react"

interface SocialShareButtonsProps {
  url: string
  title: string
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: LinkedIn,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=Check out this questionnaire: ${encodedUrl}`,
    },
  ]

  return (
    <div className="flex space-x-4">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 transition-colors"
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="w-6 h-6" />
        </a>
      ))}
    </div>
  )
}

export default SocialShareButtons

