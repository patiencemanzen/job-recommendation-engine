class JobsController {
    store(req, res) {
      res.json({ message: 'Hello, World!' });
    }
}
  
module.exports = new JobsController();
  