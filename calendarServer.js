const express = require("express");
const mongoose = require("mongoose");
const Year = require("./models/yearShema"); // Импортируем схему Year

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

// Метод GET для получения списка рабочих дней в конкретном месяце и году
app.get("/workdays", async (req, res) => {
  try {
    // Извлекаем данные из параметров запроса
    const { year, month } = req.query;

    // Используем модель Year для поиска года с указанным именем (годом)
    const foundYear = await Year.findOne({ name: year });

    if (!foundYear) {
      // Если год не найден, отправляем пустой массив
      res.json([]);
      return;
    }

    // Извлекаем данные о рабочих днях из месяца с указанным номером
    const foundMonth = foundYear.months.find((m) => m.month === month);

    if (!foundMonth) {
      // Если месяц не найден, отправляем пустой массив
      res.json([]);
      return;
    }

    // Отправляем массив рабочих дней месяца в качестве JSON-ответа
    res.json(foundMonth.workDays.map((workDay) => workDay.value));
  } catch (error) {
    // Если произошла ошибка, логируем ее и отправляем 500 Internal Server Error
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Метод POST для создания или обновления рабочих дней в месяце конкретного года
app.post("/workdays", async (req, res) => {
  try {
    // Извлекаем данные из тела запроса
    const { year, month, workDays } = req.body;

    // Используем модель Year для поиска года с указанным именем (годом)
    const foundYear = await Year.findOne({ name: year });

    if (!foundYear) {
      // Если год не найден, создаем новый год с указанным именем
      const newYear = new Year({ name: year, months: [] });
      await newYear.save();
    }

    // Обновляем или создаем месяц в году
    const updatedYear = await Year.findOneAndUpdate(
      { name: year, "months.month": month },
      {
        $set: {
          "months.$.workDays": workDays.map((value) => ({ value })),
        },
      },
      { new: true }
    );


    // Отправляем обновленный год в качестве JSON-ответа
    res.json(updatedYear);
  } catch (error) {
    // Если произошла ошибка, логируем ее и отправляем 500 Internal Server Error
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
