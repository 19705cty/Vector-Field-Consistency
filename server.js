import router from './routes/index.js';
import express from 'express';
const app = express()

app.get('/', (req, res) => {
  res.send('Api is ok')
})

// include all routes
app.use(router);
app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: `Can't find ${req.originalUrl} on this server`
    });
    next();
});


const port = 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
