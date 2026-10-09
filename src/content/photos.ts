/*
  Stock photos for the sample content, all from Pexels (free to use, no
  attribution required; photographers are credited below anyway).
  They load straight from the Pexels CDN, and `npm run seed` copies them
  into Sanity, after which the site serves Sanity's copies.
*/

type Credit = { id: number; by: string };

export const pexels = {
  hero: { id: 5524164, by: "Clay Elliot" },

  "avenue-f-ext": { id: 5353939, by: "Curtis Adams" },
  "avenue-f-living": { id: 36777534, by: "Curtis Adams" },
  "avenue-f-kitchen": { id: 7166645, by: "Max Vakhtbovych" },
  "avenue-f-bed": { id: 15456211, by: "Đức Đào" },
  "avenue-f-garden": { id: 238385, by: "Marianne" },

  "willow-ext": { id: 12993967, by: "Brett Sayles" },
  "willow-living": { id: 19916712, by: "Lisa Anna" },
  "willow-kitchen": { id: 8700684, by: "Konstantin Mishchenko" },
  "willow-bed": { id: 6782439, by: "Max Vakhtbovych" },
  "willow-garden": { id: 5554796, by: "Marian B." },

  "fairmount-ext": { id: 35361412, by: "Alef Morais" },
  "fairmount-living": { id: 18657168, by: "Stephen Leonardi" },
  "fairmount-kitchen": { id: 18657161, by: "Stephen Leonardi" },
  "fairmount-bed": { id: 18657166, by: "Stephen Leonardi" },
  "fairmount-garden": { id: 8143669, by: "Max Vakhtbovych" },

  "duval-ext": { id: 4119830, by: "Curtis Adams" },
  "duval-living": { id: 276746, by: "Pixabay" },
  "duval-kitchen": { id: 7168051, by: "Curtis Adams" },
  "duval-bed": { id: 4409369, by: "Jesus R Gen" },
  "duval-garden": { id: 17240699, by: "hi room" },

  "aldrich-ext": { id: 31656149, by: "SHOX ART" },
  "aldrich-living": { id: 8082242, by: "Max Vakhtbovych" },
  "aldrich-kitchen": { id: 7195739, by: "Max Vakhtbovych" },
  "aldrich-bed": { id: 6588581, by: "Max Vakhtbovych" },
  "aldrich-garden": { id: 14286287, by: "Atlantic Ambience" },

  "e13th-ext": { id: 34188578, by: "AJ Ahamad" },
  "e13th-living": { id: 8089172, by: "Max Vakhtbovych" },
  "e13th-kitchen": { id: 6265836, by: "Max Vakhtbovych" },
  "e13th-bed": { id: 6480210, by: "Max Vakhtbovych" },
  "e13th-garden": { id: 6430734, by: "Skylar Kang" },

  "harris-ext": { id: 8031875, by: "Curtis Adams" },
  "harris-living": { id: 280239, by: "Pixabay" },
  "harris-kitchen": { id: 4469160, by: "Curtis Adams" },
  "harris-bed": { id: 24245791, by: "Curtis Adams" },
  "harris-garden": { id: 7546775, by: "Max Vakhtbovych" },

  "kenwood-ext": { id: 8031883, by: "Curtis Adams" },
  "kenwood-living": { id: 8584020, by: "Curtis Adams" },
  "kenwood-kitchen": { id: 4221389, by: "Curtis Adams" },
  "kenwood-bed": { id: 4044806, by: "Curtis Adams" },
  "kenwood-garden": { id: 12368554, by: "Boris K." },

  "newning-ext": { id: 4061970, by: "Erik Mclean" },
  "newning-living": { id: 34864829, by: "Riedelmax" },
  "newning-kitchen": { id: 10117730, by: "Keegan Checks" },
  "newning-bed": { id: 5071175, by: "Curtis Adams" },
  "newning-garden": { id: 7587475, by: "Max Vakhtbovych" },

  "area-hyde-park": { id: 9473065, by: "David Yu" },
  "area-travis-heights": { id: 8148346, by: "K" },
  "area-east-austin": { id: 16977276, by: "David Brown" },
  "area-mueller": { id: 11018264, by: "Curtis Adams" },
  "area-north-loop": { id: 6035315, by: "Curtis Adams" },
  "area-bouldin": { id: 37788596, by: "Soumyojit Sinha" },

  "agent-maya": { id: 32846944, by: "Monica Crews" },
  "agent-daniel": { id: 38319085, by: "Deni's Fotografia" },
  "agent-priya": { id: 30161439, by: "Eric Moura" },
  "agent-tom": { id: 37148308, by: "Vincent Santamaria" },
} satisfies Record<string, Credit>;

export type PhotoKey = keyof typeof pexels;

/** CDN address of a Pexels photo, pre-sized so the image optimiser fetches a sensible file */
export const pexelsSrc = (key: PhotoKey) => {
  const { id } = pexels[key];
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`;
};
