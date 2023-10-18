import fs from 'fs';
import path from 'path';
import OpenAI, { toFile } from 'openai';
import DatetimeService from '../Services/DatetimeService.js';
import DatasetService from '../Services/DatasetService.js';
import modelDataStorage from '../Models/ModelDataStorage.js';
import { fileURLToPath } from 'url';

export default new class GPTModelService {
    /**
     * Create dataset file
     *
     * @param {Array} datasets
     * @returns
     */
    async registerDataset(datasets) {
        return DatasetService.createFile(datasets);
    }

    /**
     * Train the model with stored datasets
     *
     * @param {String} training_file_id
     */
    async finetuneModel(training_file_id) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const resolvedTrainingFileId = await training_file_id;
        const filePath = path.join(__dirname, '..', 'Models', `jobs_training_dataset.jsonl`);

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_APP_KEY,
        });

        const finetunefile = await openai.files.create({ 
            file: fs.createReadStream(filePath), 
            purpose: 'fine-tune' 
        });

        const finetunefilelId = finetunefile.id;
        const fineTune = await openai.fineTuning.jobs.create({ training_file: finetunefilelId, model: 'gpt-3.5-turbo' })

        modelDataStorage.create({
            trainingFile: resolvedTrainingFileId,
            trainingFileId: finetunefilelId,
            modelId: fineTune.id,
            model: fineTune.model,
            date: DatetimeService.formatted(),
        });

        modelDataStorage.save();
    }
}
