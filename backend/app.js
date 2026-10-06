const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const applicationRoutesModule = require('./routes/applicationRoutes');

const applicationRoutes =
  typeof applicationRoutesModule === 'function'
    ? applicationRoutesModule
    : applicationRoutesModule.default ||
    applicationRoutesModule.router;

console.log('applicationRoutes type:', typeof applicationRoutes);
console.log(
  'applicationRoutes keys:',
  Object.keys(applicationRoutesModule || {})
);

const app = express();

// 1. CORS Configuration at the VERY TOP (Must execute before any rate limiters or routes)
const allowedOrigins = [
  'https://job-hub-sss-intern1.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (no origin header, e.g. curl/postman)
    if (!origin) return callback(null, true);
    // Allow all matching origins or reflect origin safely
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
// Handle preflight OPTIONS requests for all endpoints immediately
app.options('*', cors(corsOptions));

// PNA (Private Network Access) header for browser requests from public cloud to local machine
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

// 2. HTTP Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
  })
);

// 3. Global API Rate Limiter (Skip preflight OPTIONS requests)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});
app.use('/api', apiLimiter);

// 4. Strict Rate Limiter for Authentication endpoints (Skip preflight OPTIONS requests)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.'
  }
});
app.use('/api/auth', authLimiter);

// 5. Body Parser with controlled payload size
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. Secure Static File Serving with nosniff headers
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '💼 Job Hub API is running smoothly and securely!'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
