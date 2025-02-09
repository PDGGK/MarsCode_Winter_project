import express from 'express';
import cors from 'cors';
import formidable from 'express-formidable';
import router from './route';
import expressIp from 'express-ip';

const app = express();
const PORT = 8001;

app.use(formidable());
app.use(cors({
  exposedHeaders: 'date'
}));
app.use(expressIp().getIpInfoMiddleware);
app.use(router);

app.listen(PORT, () => {
  console.log(`server running on localhost:${PORT}`);
});
