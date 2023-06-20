import Dexie, { Table } from "dexie";

export interface Dictionary {
  id?: number;
  english_word: string;
  part_of_speech?: string;
  malayalam_definition: string;
}

export class MySubClassedDexie extends Dexie {
  dictionary!: Table<Dictionary>;
  constructor() {
    super("myDatabase");
    this.version(1).stores({
      dictionary: "++id,english_word,part_of_speech,malayalam_definition",
    });
  }
}

export const db = new MySubClassedDexie();
