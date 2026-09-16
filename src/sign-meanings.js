// Short personality blurbs keyed by zodiac sign, used for each person's
// individual "Sun sign" (core identity / horoscope) and "Ascendant" (outward
// first impression) profile. Blurbs are duplicated per language rather than
// machine-translated so the phrasing reads naturally in each.

const SUN_TRAITS = {
  el: {
    aries: "Άμεσος, ενεργητικός και γρήγορος στη δράση. Οδηγείται από το ένστικτο και το θάρρος, ευδοκιμεί στην πρόκληση και στα νέα ξεκινήματα, και μπορεί να ανυπομονεί όταν τα πράγματα κινούνται αργά.",
    taurus: "Σταθερός, γειωμένος και αισθησιακός. Εκτιμά την άνεση, την αφοσίωση και τις καλές στιγμές της ζωής· κινείται με τον δικό του ρυθμό και αντιστέκεται στη βιασύνη ή την πίεση.",
    gemini: "Περίεργος, ευφυής και κοινωνικός. Σκέφτεται και μιλάει γρήγορα, λατρεύει την ποικιλία και τις νέες ιδέες, και μπορεί να δείχνει ανήσυχος όταν εγκλωβίζεται σε ρουτίνα.",
    cancer: "Ζεστός, προστατευτικός και βαθιά συναισθηματικός. Οδηγείται από τη διαίσθηση και τη φροντίδα για τους αγαπημένους του, χρειάζεται συναισθηματική ασφάλεια, και μπορεί να κλείνεται στον εαυτό του όταν πληγώνεται.",
    leo: "Θερμός, εκφραστικός και περήφανος. Θέλει να τον προσέχουν και να λάμπει, δίνει απλόχερα και με αφοσίωση, και χρειάζεται γνήσια εκτίμηση για να νιώσει ολοκληρωμένος.",
    virgo: "Πρακτικός, παρατηρητικός και προσηλωμένος στη λεπτομέρεια. Βελτιώνει ό,τι αγγίζει, δείχνει αγάπη μέσα από χρήσιμες πράξεις προσφοράς, και μπορεί να είναι υπερβολικά αυτοκριτικός.",
    libra: "Γοητευτικός, δίκαιος και προσανατολισμένος στις σχέσεις. Αναζητά ισορροπία και αρμονία, εκτιμά τη συντροφικότητα και την αισθητική, και μπορεί να δυσκολεύεται με τις αποφάσεις.",
    scorpio: "Έντονος, διορατικός και ιδιωτικός. Νιώθει τα πάντα βαθιά, είναι φανατικά αφοσιωμένος όταν κερδηθεί η εμπιστοσύνη του, και χρειάζεται πραγματική συναισθηματική ειλικρίνεια για να ανοιχτεί.",
    sagittarius: "Περιπετειώδης, αισιόδοξος και λάτρης της ελευθερίας. Αναζητά νόημα και νέους ορίζοντες, μιλάει ανοιχτά, και χρειάζεται χώρο για να περιπλανηθεί και να εξελιχθεί.",
    capricorn: "Φιλόδοξος, πειθαρχημένος και υπεύθυνος. Χτίζει για το μέλλον, κερδίζει την εμπιστοσύνη με συνέπεια, και μπορεί να υποτιμά την ανάπαυση και το παιχνίδι.",
    aquarius: "Ανεξάρτητος, εφευρετικός και ιδεαλιστής. Σκέφτεται εκτός συμβατικών πλαισίων, εκτιμά τη φιλία και τους σκοπούς που ξεπερνούν το άτομο, και μπορεί να φαντάζει συναισθηματικά αποστασιοποιημένος.",
    pisces: "Ενσυναισθητικός, με φαντασία και απαλός. Απορροφά τα συναισθήματα των άλλων, έλκεται από την τέχνη και την πνευματικότητα, και χρειάζεται υγιή όρια για να αποφύγει την κατάκλυση.",
  },
  en: {
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
  },
};

const ASCENDANT_TRAITS = {
  el: {
    aries: "Δίνει την εντύπωση τολμηρού, ενεργητικού και έτοιμου για δράση — η πρώτη εντύπωση είναι σίγουρη και λίγο ανυπόμονη.",
    taurus: "Δίνει την εντύπωση ήρεμου, ζεστού και καθησυχαστικά γειωμένου — η πρώτη εντύπωση είναι σταθερή και χωρίς βιασύνη.",
    gemini: "Δίνει την εντύπωση ζωηρού, ομιλητικού και περίεργου — η πρώτη εντύπωση είναι ευφυής και εύκολη στην κουβέντα.",
    cancer: "Δίνει την εντύπωση απαλού, φροντιστικού και λίγο επιφυλακτικού αρχικά — η πρώτη εντύπωση μαλακώνει γρήγορα μόλις χτιστεί εμπιστοσύνη.",
    leo: "Δίνει την εντύπωση θερμού, σίγουρου και μαγνητικού — η πρώτη εντύπωση είναι αξέχαστη και εντυπωσιακή.",
    virgo: "Δίνει την εντύπωση περιποιημένου, προσεκτικού και μετριόφρονα — η πρώτη εντύπωση είναι ικανή και ήσυχα παρατηρητική.",
    libra: "Δίνει την εντύπωση γοητευτικού, διπλωματικού και ευχάριστου στο μάτι — η πρώτη εντύπωση είναι χαριτωμένη και βολική.",
    scorpio: "Δίνει την εντύπωση έντονου, μαγνητικού και δυσανάγνωστου — η πρώτη εντύπωση κρύβει ήσυχο βάθος και μια φυλαγμένη πλευρά.",
    sagittarius: "Δίνει την εντύπωση ανοιχτού, ενθουσιώδους και ανέμελου — η πρώτη εντύπωση είναι φιλική και γεμάτη ενέργεια.",
    capricorn: "Δίνει την εντύπωση ήρεμου, ικανού και κάπως επιφυλακτικού — η πρώτη εντύπωση είναι σοβαρή και αξιόπιστη.",
    aquarius: "Δίνει την εντύπωση μοναδικού, φιλικού και λίγο ασυνήθιστου — η πρώτη εντύπωση είναι ενδιαφέρουσα και δυσκολοπροσδιόριστη.",
    pisces: "Δίνει την εντύπωση απαλού, ονειροπόλου και προσιτού — η πρώτη εντύπωση είναι τρυφερή και ήσυχα διορατική.",
  },
  en: {
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
  },
};

export function buildPersonalityProfile(points, lang) {
  const sun = points.find((p) => p.key === "sun");
  const ascendant = points.find((p) => p.key === "ascendant");

  return {
    sunSign: sun?.sign,
    sunText: sun ? SUN_TRAITS[lang][sun.sign] : null,
    ascendantSign: ascendant?.sign,
    ascendantText: ascendant ? ASCENDANT_TRAITS[lang][ascendant.sign] : null,
  };
}
