export interface WordItem {
  word: string;
  definition: string;
}

export const getRandomWord = async (length: number): Promise<WordItem | null> => {
  try {
    const res = await fetch(`/words/${length}.json`);
    if (!res.ok) throw new Error("Dosya okunamadı");

    const data: WordItem[] = await res.json();
    if (data.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    console.error(`Kelime yüklenemedi: ${error}`);
    return null;
  }
};
