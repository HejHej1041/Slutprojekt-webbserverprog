const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const upload = require('./config/multer');
const { registerUser, authUser } = require('./controllers/authController');
const { protect, admin } = require('./middleware/auth');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/admin', protect, admin, (req, res) => {
    res.render('admin');
});

app.post('/admin/upload', protect, admin, upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

app.post('/register', registerUser);
app.post('/login', authUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
