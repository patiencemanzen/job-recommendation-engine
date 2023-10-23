import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import DatetimeService from '../Services/DatetimeService.js';
import modelDataStorage from '../Models/ModelDataStorage.js';
import { fileURLToPath } from 'url';

export default new class GPTModelService {
    /**
     * Create dataset file
     *
     * @param {Array} datasets
     * @returns
     */
    async registerDataset(jobData) {
        const datasetDirectory = 'Models';

        if (!fs.existsSync(datasetDirectory)) {
            fs.mkdirSync(datasetDirectory, { recursive: true });
        }

        const datasetID = `jobs_training_dataset`;
        const jsonlFilePath = path.join(datasetDirectory, `${datasetID}.jsonl`);
        const writeStream = fs.createWriteStream(jsonlFilePath, { flags: 'a' });

        jobData.forEach(job => {
            const prompt = "I want you to act as good assistant and as a job recommendation engine, and guess what kind of job a user might be interested in based on their qualifications, preferences, and experience, Given a jobs list, provide the following fields in a JSON dict, where applicable: title, location, and bio";
            
            const jsonLine = JSON.stringify({
                messages: [
                    { role: "system",content: prompt },
                    { role: "user", content: `${job.company} want to hire ${job.title}, with ${job.experience} located ${job.location}` },
                    { role: "assistant", content: `title: ${job.name}, description: ${job.description}, company: ${job.company}, location: ${job.location}, experience: ${job.experience}` }
                ],
            });
        
            writeStream.write(jsonLine + '\n');
        });

        writeStream.end();
        
        return datasetID;
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
            modelDataStorage.create({
                trainingFile: resolvedTrainingFileId,
                trainingFileId: trainingFileId,
                jobId: jobInfo.id,
                model: fineTune.model,
                modelToken: fineTune.model,
                date: DatetimeService.formatted(),
            });
    
            modelDataStorage.save();

            console.error(`Fine-tuning job ${status}`);
        } else {
            console.error(`Fine-tuning job ${status}`);
        } 
    }
}
