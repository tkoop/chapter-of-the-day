import { books } from "./books.js";

function getTotalChapters() {
  return 1189; //books.reduce((sum, [_, numChapters]) => sum + numChapters, 0);
}

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

function daysSinceJuly272025() {
  const start = new Date(2025, 6, 27); // July is month 6 (0-based)
  const now = new Date();
  // Zero out the time for both dates
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
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

async function getSupportedTranslations() {
  const response = await fetch("https://api.scripture.api.bible/v1/bibles", {
    headers: { "api-key": window.API_BIBLE_KEY },
  });
  const data = await response.json();
  if (!data.data) return [];

  console.log(data.data[0]);
  // Return an array of objects with id, abbreviation, and name
  return data.data.map((bible) => ({
    id: bible.id,
    abbreviation: bible.abbreviation,
    name: bible.name,
    language: bible.language.name,
  }));
}

async function loadChapter(bibleId) {
  const data = await getChapterHTML(
    ((daysSinceJuly272025() + 124) % getTotalChapters()) + 1,
    bibleId
  );
  document.getElementById("bible-chapter-ref").textContent = data.ref;
  document.getElementById("bible-chapter").innerHTML = data.content;
}

// On script load, fetch and display the chapter for today
(async () => {
  const translations = await getSupportedTranslations();
  const select = document.createElement("select");
  select.id = "bible-chapter-translation-select";
  select.className =
    "text-sm text-gray-500 border rounded px-2 py-1 max-w-[180px] truncate";
  // Group translations by language name
  const translationsByLang = {};
  translations.forEach((t) => {
    const langName = t.language || "Other";
    if (!translationsByLang[langName]) translationsByLang[langName] = [];
    translationsByLang[langName].push(t);
  });

  Object.entries(translationsByLang).forEach(([lang, group]) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = lang;
    // Sort group by t.name (translation name)
    group.sort((a, b) => a.language.localeCompare(b.language));
    group.forEach((t) => {
      const option = document.createElement("option");
      option.value = t.id;
      option.textContent = t.abbreviation + " - " + t.name;
      if (t.id === "bba9f40183526463-01") option.selected = true;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  });
  const translationDiv = document.getElementById("bible-chapter-translation");
  translationDiv.textContent = "";
  translationDiv.appendChild(select);

  select.addEventListener("change", (e) => {
    loadChapter(select.value);
  });

  // Initial load
  loadChapter(select.value);
})();
