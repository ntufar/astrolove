// Short personality blurbs keyed by zodiac sign, used for each person's
// individual "Sun sign" (core identity / horoscope) and "Ascendant" (outward
// first impression) profile.

export const SUN_TRAITS = {
  aries: "Direct, energetic, and quick to act. Leads with instinct and courage, thrives on challenge and new starts, and can be impatient when things move too slowly.",
  taurus: "Steady, grounded, and sensual. Values comfort, loyalty, and the good things in life; moves at its own pace and resists being rushed or pressured.",
  gemini: "Curious, quick-witted, and sociable. Thinks and talks fast, loves variety and new ideas, and can seem restless or scattered when boxed into routine.",
  cancer: "Warm, protective, and deeply feeling. Leads with intuition and care for loved ones, needs emotional security, and can retreat inward when hurt.",
  leo: "Warm-hearted, expressive, and proud. Wants to be seen and to shine, gives generously and loyally, and needs genuine appreciation to feel fulfilled.",
  virgo: "Practical, observant, and detail-oriented. Improves whatever it touches, shows love through useful acts of service, and can be overly self-critical.",
  libra: "Charming, fair-minded, and relationship-focused. Seeks balance and harmony, values partnership and aesthetics, and can struggle with indecision.",
  scorpio: "Intense, perceptive, and private. Feels everything deeply, is fiercely loyal once trust is earned, and needs real emotional honesty to open up.",
  sagittarius: "Adventurous, optimistic, and freedom-loving. Seeks meaning and new horizons, speaks its mind bluntly, and needs room to roam and grow.",
  capricorn: "Ambitious, disciplined, and responsible. Builds for the long term, earns trust through consistency, and can undervalue rest and play.",
  aquarius: "Independent, inventive, and idealistic. Thinks outside convention, values friendship and causes bigger than itself, and can seem emotionally detached.",
  pisces: "Empathetic, imaginative, and gentle. Absorbs the feelings of others, is drawn to art and spirituality, and needs healthy boundaries to avoid overwhelm.",
};

export const ASCENDANT_TRAITS = {
  aries: "Comes across as bold, energetic, and ready for action — first impressions are confident and a little impatient.",
  taurus: "Comes across as calm, warm, and reassuringly grounded — first impressions are steady and unhurried.",
  gemini: "Comes across as lively, talkative, and curious — first impressions are quick-witted and easy to strike up conversation with.",
  cancer: "Comes across as gentle, caring, and a little reserved at first — first impressions soften quickly once trust builds.",
  leo: "Comes across as warm, confident, and magnetic — first impressions are memorable and larger than life.",
  virgo: "Comes across as polished, attentive, and modest — first impressions are competent and quietly observant.",
  libra: "Comes across as charming, diplomatic, and easy on the eye — first impressions are graceful and accommodating.",
  scorpio: "Comes across as intense, magnetic, and hard to read — first impressions carry quiet depth and a guarded edge.",
  sagittarius: "Comes across as open, enthusiastic, and easygoing — first impressions are friendly and full of energy.",
  capricorn: "Comes across as composed, capable, and a touch reserved — first impressions are serious and dependable.",
  aquarius: "Comes across as unique, friendly, and a bit unconventional — first impressions are interesting and hard to pin down.",
  pisces: "Comes across as soft, dreamy, and approachable — first impressions are gentle and quietly perceptive.",
};

export function buildPersonalityProfile(points) {
  const sun = points.find((p) => p.key === "sun");
  const ascendant = points.find((p) => p.key === "ascendant");

  return {
    sunSign: sun?.sign,
    sunText: sun ? SUN_TRAITS[sun.sign] : null,
    ascendantSign: ascendant?.sign,
    ascendantText: ascendant ? ASCENDANT_TRAITS[ascendant.sign] : null,
  };
}
