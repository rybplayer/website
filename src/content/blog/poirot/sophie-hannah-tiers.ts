import type { Tiers } from "@/components/TierList.astro";

export const sophieHannahTiers = {
  "A Tier": [],
  "B Tier": [
    {
      title: "The Monogram Murders",
      image: "https://m.media-amazon.com/images/I/515Yh75et3L._SL500_.jpg",
      href: "https://en.wikipedia.org/wiki/The_Monogram_Murders",
    },
    {
      title: "The Mystery of Three Quarters",
      image: "https://m.media-amazon.com/images/I/61fu4MM5hFL._SL500_.jpg",
      href: "https://en.wikipedia.org/wiki/The_Mystery_of_Three_Quarters",
    },
  ],
  "C Tier": [
    {
      title: "Closed Casket",
      image: "https://m.media-amazon.com/images/I/51INMzadY+L._SL500_.jpg",
      href: "https://en.wikipedia.org/wiki/Closed_Casket_(novel)",
    },
  ],
  "D Tier": [
    {
      title: "The Killings at Kingfisher Hill",
      image: "https://m.media-amazon.com/images/I/51UAMXMYF-L._SL500_.jpg",
      href: "https://en.wikipedia.org/wiki/The_Killings_at_Kingfisher_Hill",
    },
    {
      title: "Hercule Poirot’s Silent Night",
      image: "https://m.media-amazon.com/images/I/51xxVFapobL._SL500_.jpg",
      href: "https://en.wikipedia.org/wiki/Sophie_Hannah#Fiction:_Hercule_Poirot_mysteries",
    },
    {
      title: "The Last Death of the Year",
      image: "https://m.media-amazon.com/images/I/41C-f1YlRsL._SL500_.jpg",
      href: "https://en.wikipedia.org/wiki/Sophie_Hannah#Fiction:_Hercule_Poirot_mysteries",
    },
  ],
} satisfies Tiers;
