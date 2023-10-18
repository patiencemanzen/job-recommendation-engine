const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const apiRoutes = require('./Routes/api');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/api/', apiRoutes);

app.get('/api/secure', authMiddleware, (req, res) => {
  // This route is protected by the authentication middleware.
  res.json({ message: 'You have access to this route.' });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
