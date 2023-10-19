import fs from 'fs';
import path from 'path';

class DatasetService {
    /**
     * Create dataset jsonl file for training model purpose
     * 
     * @param {Object} jobData 
     * @returns 
     */
    createFile(jobData) {
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
}

export default new DatasetService;
