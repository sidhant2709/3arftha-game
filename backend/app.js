import express from "express";
import dotenv from "dotenv";
dotenv.config()
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import questionsRoutes from './routes/questionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'
import queryRoutes from './routes/queryRoutes.js'
import gamesRoutes from './routes/gameRoutes.js'
import trialGameRoutes from "./routes/trialGameRoutes.js";
// import rateLimit from 'express-validator'
import csrf from "csrf"
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';


const csrfProtection = csrf({ cookie: true });
const app = express();



app.use(cors({
    origin: "*", // Adjust as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // necessary for sessions, otherwise cookies won't work
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// app.use(csrfProtection)


const __dirname = path.resolve();

app.get('/admin/js/config.js', (req, res) => {
    const config = `
        const BASE_URL = "${process.env.NODE_ENV === 'production'
            ? 'https://your-production-domain.com/api'
            : 'http://localhost:9090/api'}";
    `;
    res.setHeader('Content-Type', 'application/javascript');
    res.send(config);
});

app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));
app.use('/user', express.static(path.join(__dirname, '../frontend/user')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/queires',queryRoutes);
app.use('/api/games',gamesRoutes)
app.use("/api/trial-game", trialGameRoutes);


// const loginLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 5,
//     message: 'Too many login attempts, please try again later.',
//   });

await connectDB();

let port=process.env.PORT || 9090

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});