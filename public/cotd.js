function getTotalChapters() {
  return 1189; //chapters.reduce((sum, [_, numChapters]) => sum + numChapters, 0);
}

const chapters = [
  ["Genesis", 50],
  ["Exodus", 40],
  ["Leviticus", 27],
  ["Numbers", 36],
  ["Deuteronomy", 34],
  ["Joshua", 24],
  ["Judges", 21],
  ["Ruth", 4],
  ["1 Samuel", 31],
  ["2 Samuel", 24],
  ["1 Kings", 22],
  ["2 Kings", 25],
  ["1 Chronicles", 29],
  ["2 Chronicles", 36],
  ["Ezra", 10],
  ["Nehemiah", 13],
  ["Esther", 10],
  ["Job", 42],
  ["Psalms", 150],
  ["Proverbs", 31],
  ["Ecclesiastes", 12],
  ["Song of Solomon", 8],
  ["Isaiah", 66],
  ["Jeremiah", 52],
  ["Lamentations", 5],
  ["Ezekiel", 48],
  ["Daniel", 12],
  ["Hosea", 14],
  ["Joel", 3],
  ["Amos", 9],
  ["Obadiah", 1],
  ["Jonah", 4],
  ["Micah", 7],
  ["Nahum", 3],
  ["Habakkuk", 3],
  ["Zephaniah", 3],
  ["Haggai", 2],
  ["Zechariah", 14],
  ["Malachi", 4],
  ["Matthew", 28],
  ["Mark", 16],
  ["Luke", 24],
  ["John", 21],
  ["Acts", 28],
  ["Romans", 16],
  ["1 Corinthians", 16],
  ["2 Corinthians", 13],
  ["Galatians", 6],
  ["Ephesians", 6],
  ["Philippians", 4],
  ["Colossians", 4],
  ["1 Thessalonians", 5],
  ["2 Thessalonians", 3],
  ["1 Timothy", 6],
  ["2 Timothy", 4],
  ["Titus", 3],
  ["Philemon", 1],
  ["Hebrews", 13],
  ["James", 5],
  ["1 Peter", 5],
  ["2 Peter", 3],
  ["1 John", 5],
  ["2 John", 1],
  ["3 John", 1],
  ["Jude", 1],
  ["Revelation", 22],
];

function getNthChapter(n) {
  let count = 0;
  for (let i = 0; i < chapters.length; i++) {
    const [book, numChapters] = chapters[i];
    if (n <= count + numChapters) {
      return book + " " + (n - count);
    }
    count += numChapters;
  }
  return null; // n is out of range
}

async function getChapterHTML(chapterIndex) {
  const reference = getNthChapter(chapterIndex);
  if (!reference) return "<p>Invalid chapter index.</p>";
  const url = `https://bible-api.com/${encodeURIComponent(
    reference
  )}?translation=web`;
  const response = await fetch(url);
  const data = await response.json();
  let html = `<h2 class="text-2xl font-semibold mb-2">${reference}</h2>`;
  html += `<div class="text-sm text-gray-500 mb-4">${data.translation_id.toUpperCase()}</div>`;
  html += '<div class="space-y-2">';
  data.verses.forEach((verse) => {
    html += `<p><span class=\"font-bold\">${
      verse.verse
    }</span> ${verse.text.trim()}</p>`;
  });
  html += "</div>";
  return html;
}

// On script load, fetch and display the chapter for today
getChapterHTML(((daysSinceJuly272025() + 124) % getTotalChapters()) + 1).then(
  (html) => {
    const container = document.getElementById("bible-chapter");
    if (container) {
      container.innerHTML = html;
    }
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
