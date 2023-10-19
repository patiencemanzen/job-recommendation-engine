import OpenAI, { toFile } from 'openai';
import modelDataStorage from '../Models/ModelDataStorage.js';

export default new class JobRecommendService {
    /**
     * OpenAI Reserved Prompt
     * @returns 
     */
    prompt() {
        return {
            system: "I want you to act as good assistant and as a job recommendation engine, and guess what kind of job a user might be interested in based on their qualifications, preferences, and experience",
            assistant: "file-6q8JlWSF8r1D5msp9CqErqgk",
            user: "Provide a list of personalized job recommendation, considering factors like location, experience, industry, and company culture, and Additionally, add shorts explain why this job is a good match for the user based on their bio, location and goals, the user have profile: "
        }
    }

    /**
     * Get all recommendations
     * 
     * @param {Object} user 
     * @returns 
     */
    async populateJobs(user) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_APP_KEY });
        const prompt = this.prompt();
        const finetunedModel = this.modelToken();

        if(finetunedModel) {
            const completion = await openai.chat.completions.create({
                model: finetunedModel,
                messages: [
                    {"role": "system", "content": prompt.system},
                    {"role": "user", "content": `${prompt.user} 
                        * Title: ${user.title}
                        * Location: ${user.location}
                        * Bio: ${user.description}`},
                ],
            });
    
            return completion.choices[0].message.content;
        }
    }

    async modelToken() {
        return modelDataStorage.latest() !== null
            ? modelDataStorage.latest().modelToken
            : "";
    }
}