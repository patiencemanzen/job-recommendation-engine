import fs from 'fs';
import path from 'path';
import datetimeService from '../Services/DatetimeService.js';

class DatasetService {
    createFile(jobData) {
        const currentDate = datetimeService.formatted();
        const datasetDirectory = 'Models';

        if (!fs.existsSync(datasetDirectory)) {
            fs.mkdirSync(datasetDirectory, { recursive: true });
        }

        const datasetID = `jobs_training_dataset`;
        const jsonlFilePath = path.join(datasetDirectory, `${datasetID}.jsonl`);
        const writeStream = fs.createWriteStream(jsonlFilePath, { flags: 'a' });

        jobData.forEach(job => {
            const jsonLine = JSON.stringify({
                messages: [
                    { role: "system",content: "Given a jobs list, provide the following fields in a JSON dict, where applicable: title, description"},
                    { role: "user", content: `${job.company} want to hire ${job.title}, with ${job.experience} located ${job.location}`},
                    { role: "assistant", content: `title: ${job.name}, description: ${job.description}, company: ${job.company}, location: ${job.location}, experience: ${job.experience}`}
                ],
            });
        
            writeStream.write(jsonLine + '\n');
        });

        writeStream.end();
        return datasetID;
    }
}

export default new DatasetService;
