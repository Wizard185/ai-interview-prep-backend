import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./db/mongo.js";

await connectDB();

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});