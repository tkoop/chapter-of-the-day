function getTotalChapters() {
  return 1189; //books.reduce((sum, [_, numChapters]) => sum + numChapters, 0);
}

const books = [
  ["Genesis", 50, "GEN"],
  ["Exodus", 40, "EXO"],
  ["Leviticus", 27, "LEV"],
  ["Numbers", 36, "NUM"],
  ["Deuteronomy", 34, "DEU"],
  ["Joshua", 24, "JOS"],
  ["Judges", 21, "JDG"],
  ["Ruth", 4, "RUT"],
  ["1 Samuel", 31, "1SA"],
  ["2 Samuel", 24, "2SA"],
  ["1 Kings", 22, "1KI"],
  ["2 Kings", 25, "2KI"],
  ["1 Chronicles", 29, "1CH"],
  ["2 Chronicles", 36, "2CH"],
  ["Ezra", 10, "EZR"],
  ["Nehemiah", 13, "NEH"],
  ["Esther", 10, "EST"],
  ["Job", 42, "JOB"],
  ["Psalms", 150, "PSA"],
  ["Proverbs", 31, "PRO"],
  ["Ecclesiastes", 12, "ECC"],
  ["Song of Solomon", 8, "SNG"],
  ["Isaiah", 66, "ISA"],
  ["Jeremiah", 52, "JER"],
  ["Lamentations", 5, "LAM"],
  ["Ezekiel", 48, "EZK"],
  ["Daniel", 12, "DAN"],
  ["Hosea", 14, "HOS"],
  ["Joel", 3, "JOL"],
  ["Amos", 9, "AMO"],
  ["Obadiah", 1, "OBA"],
  ["Jonah", 4, "JON"],
  ["Micah", 7, "MIC"],
  ["Nahum", 3, "NAM"],
  ["Habakkuk", 3, "HAB"],
  ["Zephaniah", 3, "ZEP"],
  ["Haggai", 2, "HAG"],
  ["Zechariah", 14, "ZEC"],
  ["Malachi", 4, "MAL"],
  ["Matthew", 28, "MAT"],
  ["Mark", 16, "MRK"],
  ["Luke", 24, "LUK"],
  ["John", 21, "JHN"],
  ["Acts", 28, "ACT"],
  ["Romans", 16, "ROM"],
  ["1 Corinthians", 16, "1CO"],
  ["2 Corinthians", 13, "2CO"],
  ["Galatians", 6, "GAL"],
  ["Ephesians", 6, "EPH"],
  ["Philippians", 4, "PHP"],
  ["Colossians", 4, "COL"],
  ["1 Thessalonians", 5, "1TH"],
  ["2 Thessalonians", 3, "2TH"],
  ["1 Timothy", 6, "1TI"],
  ["2 Timothy", 4, "2TI"],
  ["Titus", 3, "TIT"],
  ["Philemon", 1, "PHM"],
  ["Hebrews", 13, "HEB"],
  ["James", 5, "JAS"],
  ["1 Peter", 5, "1PE"],
  ["2 Peter", 3, "2PE"],
  ["1 John", 5, "1JN"],
  ["2 John", 1, "2JN"],
  ["3 John", 1, "3JN"],
  ["Jude", 1, "JUD"],
  ["Revelation", 22, "REV"],
];

function getNthChapter(n) {
  let count = 0;
  for (let i = 0; i < books.length; i++) {
    const [book, numChapters] = books[i];
    if (n <= count + numChapters) {
      return book + " " + (n - count);
    }
    count += numChapters;
  }
  return null; // n is out of range
}

async function getChapterHTML(chapterIndex, bibleId = "de4e12af7f28f599-02") {
  // bibleId: BSB = "de4e12af7f28f599-02", LEB = "bba9f40183526463-01"
  const reference = getNthChapter(chapterIndex);
  if (!reference)
    return {
      ref: "",
      translation: "",
      content: "<p>Invalid chapter index.</p>",
    };
  const [book, chapter] = reference.split(" ");
  // Find the book ID for api.bible from the books array
  const bookEntry = books.find((b) => b[0] === book);
  const bookId = bookEntry ? bookEntry[2] : null;
  if (!bookId)
    return {
      ref: reference,
      translation: "",
      content: `<p>Book not found: ${book}</p>`,
    };
  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${bookId}.${chapter}`;
  const response = await fetch(url, {
    headers: { "api-key": window.API_BIBLE_KEY },
  });
  const data = await response.json();
  if (!data.data)
    return {
      ref: reference,
      translation: "",
      content: `<p>Chapter not found.</p>`,
    };
  return {
    ref: reference,
    translation:
      bibleId === "de4e12af7f28f599-02"
        ? "BSB"
        : bibleId === "bba9f40183526463-01"
        ? "LEB"
        : bibleId,
    content: `<div class=\"space-y-2\">${data.data.content}</div>`,
  };
}

// On script load, fetch and display the chapter for today
getChapterHTML(((daysSinceJuly272025() + 124) % getTotalChapters()) + 1).then(
  (data) => {
    document.getElementById("bible-chapter-ref").textContent = data.ref;
    document.getElementById("bible-chapter-translation").textContent =
      data.translation;
    document.getElementById("bible-chapter").innerHTML = data.content;
  }
);

function daysSinceJuly272025() {
  const start = new Date(2025, 6, 27); // July is month 6 (0-based)
  const now = new Date();
  // Zero out the time for both dates
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
