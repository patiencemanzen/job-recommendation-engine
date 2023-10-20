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
        const filePath = path.join(__dirname, '..', 'Models', `jobs_training_dataset.jsonl`);
        const resolvedTrainingFileId = await training_file_id;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_APP_KEY });
        const finetunefile = await openai.files.create({ 
            file: fs.createReadStream(filePath), 
            purpose: 'fine-tune' 
        });

        const finetunefilelId = finetunefile.id;
        console.log("Finetune Dataset Uploaded");

        const fineTune = await openai.fineTuning.jobs.create({ 
            training_file: finetunefilelId, 
            model: 'gpt-3.5-turbo' 
        });

        this.asyncModelState(fineTune.id, resolvedTrainingFileId);
    }

    /**
     * Request with Job id and check Model Status 
     * whether "in_progress" or "completed"
     * 
     * @param {String} modelJobId 
     * @param {String} trainingFileId 
     * @returns 
     */
    async asyncModelState(modelJobId, trainingFileId) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_APP_KEY });
        let status = 'in_progress';

        while (status !== 'succeeded') {
            const jobInfo = await openai.fineTuning.jobs.retrieve(modelJobId);
                status = jobInfo.status;
            
            if (status !== 'succeeded') {
                console.log(`Job is still in progress as ${status}. Checking again...`);
                await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds before checking again
            }
        }

        if (status === 'succeeded') {
            const fineTunedModelId = jobInfo.data.model_id;

            modelDataStorage.create({
                trainingFile: resolvedTrainingFileId,
                trainingFileId: finetunefilelId,
                jobId: fineTune.id,
                model: fineTune.model,
                modelToken: fineTunedModelId,
                date: DatetimeService.formatted(),
            });
    
            modelDataStorage.save();

            console.error(`Fine-tuning job ${status}`);
        } else {
            console.error(`Fine-tuning job ${status}`);
        } 
    }
}
