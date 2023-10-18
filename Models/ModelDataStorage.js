import fs from 'fs'; // Use fs.promises for async file operations
import path from 'path';
import { fileURLToPath } from 'url';

class ModelDataStorage {
  constructor(filename) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.filename = path.join(__dirname, '..', 'Models', filename);
    this.data = [];
  }

  async loadData() {
    try {
      const fileData = fs.readFile(this.filename, { encoding: 'utf8' }, (err, data) => {
        this.data = JSON.parse(data);
      });
    } catch (error) {
      this.data = [];
    }
  }

  create(item) {
    this.data.push(item);
  }

  async save() {
    const jsonData = JSON.stringify(this.data, null, 2);
    fs.writeFile(this.filename, jsonData, (err, data) => {});
  }

  all() {
    return this.data;
  }

  latest() {
    if (this.data.length === 0) return null;
    const sortedData = [...this.data].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedData[0];
  }
}

const storage = new ModelDataStorage('models.json');
await storage.loadData();

export default storage;
