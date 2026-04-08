const BASE_WORDS = [
  "about", "above", "actor", "acute", "admit", "adopt", "adore", "after", "again",
  "agent", "agree", "aisle", "alarm", "album", "alert", "alien", "align", "alive",
  "allow", "alone", "along", "aloud", "alter", "angel", "anger", "angle", "angry",
  "ankle", "apple", "apply", "apron", "argue", "arise", "armor", "arrow", "aside",
  "asset", "atlas", "atoms", "attic", "audio", "avoid", "award", "aware", "awful",
  "badge", "badly", "bagel", "baker", "basic", "basin", "beach", "beard", "beast",
  "begin", "being", "below", "bench", "berry", "birth", "black", "blade", "blame",
  "blank", "blast", "bleak", "blend", "bless", "blind", "block", "blood", "bloom",
  "blown", "board", "boast", "bonus", "boost", "booth", "bound", "brain", "brake",
  "brand", "brass", "brave", "bread", "break", "brick", "bride", "brief", "bring",
  "broad", "broke", "brown", "brush", "build", "built", "burst", "cabin", "cable",
  "camel", "candy", "carry", "carve", "catch", "cause", "cells", "chain", "chair",
  "chalk", "champ", "chant", "chaos", "charm", "chart", "chase", "cheap", "check",
  "cheer", "chess", "chest", "chief", "child", "chill", "china", "claim", "class",
  "civil",
  "clean", "clear", "clerk", "click", "cliff", "climb", "clock", "close", "cloud",
  "coach", "coast", "color", "comic", "could", "count", "court", "cover", "crack",
  "craft", "crane", "crash", "crazy", "cream", "creek", "crime", "crisp", "crown",
  "dance", "dated", "dealt", "death", "debug", "delay", "depth", "diary", "digit",
  "diner", "dirty", "doubt", "dozen", "draft", "drama", "dream", "dress", "drill",
  "drink", "drive", "eager", "eagle", "early", "earth", "elect", "elite", "empty",
  "enemy", "enjoy", "enter", "entry", "equal", "error", "event", "every", "exact",
  "exist", "extra", "faith", "false", "fault", "favor", "feast", "fence", "fever",
  "field", "fifth", "fifty", "fight", "final", "first", "flame", "flash", "fleet",
  "flesh", "float", "flock", "floor", "flour", "focus", "force", "forth", "forty",
  "forum", "found", "frame", "fresh", "front", "fruit", "funny", "genre", "ghost",
  "giant", "glade", "glass", "glide", "globe", "glory", "glove", "grace", "grade",
  "grain", "grand", "grant", "grape", "graph", "grasp", "grass", "great", "green",
  "greet", "grief", "group", "grove", "guard", "guess", "guest", "guide", "habit",
  "happy", "heart", "honey", "honor", "horse", "hotel", "house", "human", "humor",
  "ideal", "image", "index", "infer", "inner", "input", "issue", "ivory", "jelly",
  "joint", "judge", "juice", "knock", "known", "label", "labor", "laser", "later",
  "laugh", "layer", "learn", "least", "leave", "legal", "lemon", "level", "light",
  "limit", "liver", "local", "logic", "loose", "lucky", "lunch", "magic", "major",
  "march", "match", "maybe", "mayor", "medal", "metal", "meter", "might", "minor",
  "model", "money", "month", "moral", "motor", "mount", "mouse", "mouth", "movie",
  "music", "naive", "nerve", "never", "night", "noble", "noise", "north", "novel",
  "nurse", "ocean", "offer", "often", "order", "organ", "other", "ought", "paint",
  "panel", "paper", "party", "peace", "penny", "phase", "phone", "piano", "piece",
  "pilot", "pitch", "place", "plain", "plane", "plant", "plate", "plaza", "poems",
  "point", "pound", "power", "press", "price", "pride", "prime", "print", "prize",
  "proof", "proud", "queen", "quest", "quick", "quiet", "quite", "radio", "raise",
  "rally", "range", "rapid", "ratio", "reach", "react", "ready", "refer", "relax",
  "reply", "right", "rival", "river", "robot", "roman", "rough", "round", "route",
  "royal", "ruler", "rural", "scale", "scene", "scope", "score", "sense", "serve",
  "seven", "shade", "shake", "shall", "shape", "share", "shark", "sharp", "sheep",
  "sheet", "shelf", "shell", "shift", "shine", "shirt", "shock", "shoot", "shore",
  "short", "shown", "sight", "since", "skill", "sleep", "slice", "slide", "slope",
  "small", "smart", "smile", "smoke", "snake", "solid", "solve", "sound", "south",
  "space", "spare", "spark", "speak", "speed", "spell", "spend", "spice", "spike",
  "spine", "split", "sport", "spray", "squad", "stack", "staff", "stage", "stair",
  "stamp", "stand", "stare", "start", "state", "steam", "steel", "steep", "steer",
  "stick", "still", "stock", "stone", "storm", "story", "straw", "strip", "study",
  "stuff", "style", "sugar", "suite", "super", "swept", "sword", "table", "taste",
  "teach", "teeth", "thank", "theme", "there", "thick", "thing", "think", "third",
  "those", "three", "throw", "tiger", "title", "today", "topic", "total", "touch",
  "tough", "tower", "track", "trade", "train", "treat", "trend", "trial", "tribe",
  "trick", "truck", "truly", "trust", "truth", "tutor", "uncle", "under", "union",
  "unity", "until", "upper", "urban", "usage", "usual", "value", "video", "visit",
  "vital", "voice", "voter", "waste", "watch", "water", "weigh", "wheel", "where",
  "which", "while", "white", "whole", "whose", "woman", "world", "worry", "worth",
  "would", "wound", "write", "wrong", "young", "youth", "zebra"
];

const COMMON_LETTERS = "etaoinshrdlucm";
const RARE_LETTERS = "jqxzvk";

function scoreWordDifficulty(word) {
  let score = 0;

  for (const letter of word) {
    if (RARE_LETTERS.includes(letter)) {
      score += 2;
    } else if (!COMMON_LETTERS.includes(letter)) {
      score += 1;
    }
  }

  if (new Set(word).size < word.length) {
    score += 1;
  }

  if (/(ph|ght|dge|nge|tch|ck|wh)/.test(word)) {
    score += 1;
  }

  return score;
}

const WORD_BANK = {
  easy: BASE_WORDS.filter((word) => scoreWordDifficulty(word) <= 1),
  medium: BASE_WORDS.filter((word) => {
    const score = scoreWordDifficulty(word);
    return score >= 2 && score <= 3;
  }),
  challenge: BASE_WORDS.filter((word) => scoreWordDifficulty(word) >= 4)
};

const DICTIONARY_WORDS = [
  ...WORD_BANK.easy,
  ...WORD_BANK.medium,
  ...WORD_BANK.challenge
];
