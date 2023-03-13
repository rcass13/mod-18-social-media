const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', require('./routes/api/user-routes'));
app.use('/api/thoughts', require('./routes/api/thoughts-routes'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network', { // 'mongodb://localhost/social-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('debug', true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
