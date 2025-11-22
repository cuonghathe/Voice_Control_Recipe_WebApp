import express from 'express';
import recipeUpload from "../../Config/recipeConfig/recipeConfig.js";
import recipeAuthController from '../../controllers/recipes/recipeController.js';
import userAuthenticate from '../../middleware/userAuthenticate.js';
const router = new express.Router();

// Middleware để xử lý cả recipeImg và instructionImg
const uploadFields = [
  { name: 'recipeImg', maxCount: 1 },
  { name: 'instructionImg', maxCount: 20 } // Cho phép tối đa 20 ảnh instruction
];

router.post("/create", userAuthenticate, 
  recipeUpload.fields(uploadFields), 
  recipeAuthController.createRecipe
);
router.put("/update/:recipeid", userAuthenticate, 
  recipeUpload.fields(uploadFields), 
  recipeAuthController.updateRecipe
);
router.delete("/delete/:recipeid", userAuthenticate, recipeAuthController.deleteRecipe);
router.get("/search/:key",recipeAuthController.searchRecipe)
router.get('/getRecipes', recipeAuthController.getAllRecipes);
router.get("/singleRecipe/:recipeid",recipeAuthController.getSingleRecipeData);



export default router;

