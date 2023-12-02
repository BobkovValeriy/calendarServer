const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

mongoose.connect("mongodb+srv://darkmito17051990:3f3o3r3e3v3e3r@cluster0.j2b302a.mongodb.net/calendar", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Схема для месяца
const monthSchema = new mongoose.Schema({
    name: { type: Number, required: true }, // номер месяца (0-11)
    workDays: [{ type: Date, required: true, unique: true }], // массив рабочих дней (даты)
});

// Схема для года
const yearSchema = new mongoose.Schema({
    name: { type: Number, required: true }, // год
    months: [monthSchema], // массив месяцев
});

const Year = mongoose.model("Year", yearSchema);

app.get("/years", async (req, res) => {
    try {
        const years = await Year.find();
        res.json(years);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/years", async (req, res) => {
    try {
        const { name, months } = req.body;
        const newYear = new Year({ name, months });
        await newYear.save();
        res.json(newYear);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
