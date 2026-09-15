import type { Tiers } from "@/components/TierList.astro"

const shortStoryCollections = {
  christmasPudding: {
    image: "https://m.media-amazon.com/images/I/41IVY9Y7owL._SL500_.jpg",
    href: "https://en.wikipedia.org/wiki/The_Adventure_of_the_Christmas_Pudding",
  },
  earlyCases: {
    image: "https://m.media-amazon.com/images/I/61iyB6sqgaL._SL500_.jpg",
    href: "https://en.wikipedia.org/wiki/Poirot's_Early_Cases",
  },
  laboursOfHercules: {
    image: "https://m.media-amazon.com/images/I/41XnSMKCk5L._SL500_.jpg",
    href: "https://en.wikipedia.org/wiki/The_Labours_of_Hercules",
  },
  murderInTheMews: {
    image: "https://m.media-amazon.com/images/I/51cCvASyzcL._SL500_.jpg",
    href: "https://en.wikipedia.org/wiki/Murder_in_the_Mews",
  },
  poirotInvestigates: {
    image: "https://m.media-amazon.com/images/I/51r8A+BL3EL._SL500_.jpg",
    href: "https://en.wikipedia.org/wiki/Poirot_Investigates",
  },
  problemAtPollensaBay: {
    image: "https://m.media-amazon.com/images/I/519L2G3n6ML._SL500_.jpg",
    href: "https://en.wikipedia.org/wiki/Problem_at_Pollensa_Bay_and_Other_Stories",
  },
  regattaMystery: {
    image: "https://m.media-amazon.com/images/I/61tzol97MAL._SL500_.jpg",
    href: "https://en.wikipedia.org/wiki/The_Regatta_Mystery",
  },
  witnessForTheProsecution: {
    image: "https://m.media-amazon.com/images/I/61hN+cZ3KxL._SL500_.jpg",
    href: "https://en.wikipedia.org/wiki/The_Witness_for_the_Prosecution_and_Other_Stories",
  },
}

type ShortStoryCollection = keyof typeof shortStoryCollections

const shortStory = (title: string, collection: ShortStoryCollection) => ({
  title,
  ...shortStoryCollections[collection],
})

export const shortStoryTiers = {
  "A Tier": [
    shortStory("Dead Man's Mirror", "murderInTheMews"),
    shortStory("How Does Your Garden Grow?", "regattaMystery"),
    shortStory("The Adventure of the Christmas Pudding", "christmasPudding"),
    shortStory("The Adventure of the Italian Nobleman", "poirotInvestigates"),
    shortStory("The Chocolate Box", "poirotInvestigates"),
    shortStory("The Cretan Bull", "laboursOfHercules"),
    shortStory("The Disappearance of Mr Davenheim", "poirotInvestigates"),
    shortStory("The Girdle of Hyppolita", "laboursOfHercules"),
    shortStory(
      "The Jewel Robbery at the Grand Metropolitan",
      "poirotInvestigates",
    ),
    shortStory("The Nemean Lion", "laboursOfHercules"),
    shortStory("The Stymphalean Birds", "laboursOfHercules"),
    shortStory("Wasps' Nest", "earlyCases"),
  ],
  "B Tier": [
    shortStory("Double Sin", "earlyCases"),
    shortStory("Four-and-Twenty Blackbirds", "christmasPudding"),
    shortStory("Murder in the Mews", "murderInTheMews"),
    shortStory("Problem at Sea", "regattaMystery"),
    shortStory("The Adventure of the Egyptian Tomb", "poirotInvestigates"),
    shortStory("The Adventure of the Western Star", "poirotInvestigates"),
    shortStory("The Affair at the Victory Ball", "earlyCases"),
    shortStory("The Double Clue", "earlyCases"),
    shortStory("The Dream", "christmasPudding"),
    shortStory("The Erymanthian Boar", "laboursOfHercules"),
    shortStory("The Flock of Geryon", "laboursOfHercules"),
    shortStory("The Incredible Theft", "murderInTheMews"),
    shortStory("The Mystery of the Baghdad Chest", "regattaMystery"),
    shortStory("The Mystery of the Spanish Chest", "christmasPudding"),
    shortStory("The Third Floor Flat", "earlyCases"),
    shortStory("The Veiled Lady", "poirotInvestigates"),
    shortStory("Yellow Iris", "problemAtPollensaBay"),
  ],
  "C Tier": [
    shortStory("Poirot and the Regatta Mystery", "witnessForTheProsecution"),
    shortStory("The Adventure of Johnnie Waverly", "earlyCases"),
    shortStory("The Adventure of the Cheap Flat", "poirotInvestigates"),
    shortStory("The Adventure of the Clapham Cook", "earlyCases"),
    shortStory("The Case of the Missing Will", "poirotInvestigates"),
    shortStory("The Cornish Mystery", "earlyCases"),
    shortStory("The Horses of Diomedes", "laboursOfHercules"),
    shortStory("The Lemesurier Inheritance", "earlyCases"),
    shortStory("The Market Basing Mystery", "earlyCases"),
    shortStory("The Mystery of Hunter's Lodge", "poirotInvestigates"),
    shortStory("The Plymouth Express", "earlyCases"),
    shortStory("The Second Gong", "witnessForTheProsecution"),
    shortStory("The Submarine Plans", "earlyCases"),
    shortStory("The Tragedy at Marsdon Manor", "poirotInvestigates"),
    shortStory("The Under Dog", "christmasPudding"),
  ],
  "D Tier": [
    shortStory("The Apples of the Hesperides", "laboursOfHercules"),
    shortStory("The Arcadian Deer", "laboursOfHercules"),
    shortStory("The Augean Stables", "laboursOfHercules"),
    shortStory("The Capture of Cerberus", "laboursOfHercules"),
    shortStory("The Kidnapped Prime Minister", "poirotInvestigates"),
    shortStory("The King of Clubs", "earlyCases"),
    shortStory("The Lernaean Hydra", "laboursOfHercules"),
    shortStory("The Million Dollar Bond Robbery", "poirotInvestigates"),
    shortStory("Triangle at Rhodes", "murderInTheMews"),
    shortStory("The Lost Mine", "poirotInvestigates"),
  ],
} satisfies Tiers
