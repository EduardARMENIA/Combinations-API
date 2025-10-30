import express from 'express';
import CombinationService from './services/CombinationService.js'
import MySQLService from './services/MySQLService.js'
import { dataValidator } from './validators/dataValidator.js'
import { successResponse, errorResponse } from './services/ResponseService.js';
import { validate } from './middlewares/validate.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());

const db = new MySQLService();
await db.connect();

app.post('/', dataValidator, validate, async (req, res) => {
   try {
      const items = req.body.items
      const combinationsLength = req.body.length

      const combinationService = new CombinationService(db);
      let lettersWithItems = await combinationService.generateLetterCombinations(items)
      const combinations = await combinationService.generateCombinations(lettersWithItems, combinationsLength)
      const { item_id } = await combinationService.saveCombinations(items, combinations)

      return successResponse(res, { "id": item_id, "combination": combinations }, 'Combinations created successfully', 201);
   } catch (error) {
      return errorResponse(res, 'Failed to create combinations', 500);
   }
});


app.listen(port, async () => {
   console.log(`Server is running at http://localhost:${port}`);
});














