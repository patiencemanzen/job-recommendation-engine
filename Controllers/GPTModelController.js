import GPTModelService from '../Services/GPTModelService.js';
import JobRecommendService from '../Services/JobRecommendService.js';

export default new class GPTModelController {
    /**
     * Store Request Datasets and Train the Model
     * 
     * @param {*} req 
     * @param {*} res 
     */
    store(req, res) {
        const datasetfile = GPTModelService.registerDataset(req.body.datasets);
        
        GPTModelService.finetuneModel(datasetfile);

        res.json({ message: "GPT model created and uploaded" });
    }

    /**
     * With Current trained model, 
     * get user recommendations
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async recommendations(req, res) {
        const recommendations = await JobRecommendService.populateJobs({
            title: req.body.title,
            location: req.body.location,
            description: req.body.description,
        });

        res.json({ recommendations });
    }
}  