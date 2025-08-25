
import natural from "natural";

// tokenizer + stemmer
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// root bad words list
const badwords = ["fuck", "shit", "porn", "nsfw", "fucker"];

export function containsNSFW(text) {
  // tokenize + lowercase
  const tokens = tokenizer.tokenize(text.toLowerCase());

  // stem tokens
  const stemmedTokens = tokens.map((word) => stemmer.stem(word));

  console.log("🔍 Tokens:", tokens);
  console.log("🌱 Stemmed:", stemmedTokens);

  // check for bad words
  return stemmedTokens.some((word) => badwords.includes(word));
}
