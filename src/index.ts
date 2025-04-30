import express, {Request, Response} from "express";
import cors from 'cors';
import compileRoute from "./routes/compile";



const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use("/contract", compileRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
