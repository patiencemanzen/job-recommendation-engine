import GPTModelService from '../Services/GPTModelService.js';

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

        res.json({ message: "datasets created" });
    }
}  