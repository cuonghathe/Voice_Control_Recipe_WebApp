import cloudinary from "../../Cloudinary/cloudinary.js";
import recipeDB from "../../models/recipe/recipeModel.js";
import reviewDB from "../../models/review/reviewModel.js";

const ITEM_PER_PAGE = 9;
const appendiceLengthLimit = 600;


const adjustMeasurements = (ingredients, originalServings, newServings) => {
  const original = parseFloat(originalServings) || 1;
  const newServing = parseFloat(newServings) || 1;
  
  return ingredients.map(ingredient => {
    const currentQuantity = parseFloat(ingredient.quantity) || 0;
    const adjustedQuantity = (currentQuantity * newServing) / original;
    return { 
      ...ingredient, 
      quantity: adjustedQuantity 
    };
  });
};

// Tao cong thuc
export const createRecipe = async (req, res) => {
  // Xử lý files từ multer fields
  const recipeImgFile = req.files && req.files.recipeImg ? req.files.recipeImg[0] : null;
  const instructionImgFiles = req.files && req.files.instructionImg ? req.files.instructionImg : [];
  
  
  const { recipename, description, instructions, ingredients, cookingTime, servingSize, appendices} = req.body;
  
  if (!recipename || !description || !instructions || !ingredients || !cookingTime || !servingSize) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  let parsedAppendices = appendices ? JSON.parse(appendices) : [];
  
  let recipeImgUrl = "";
  if (recipeImgFile) {
    const recipeImgUpload = await cloudinary.uploader.upload(recipeImgFile.path);
    recipeImgUrl = recipeImgUpload.secure_url;
  }

  const parsedInstructions = JSON.parse(instructions);

  const formattedInstructions = await Promise.all(
    parsedInstructions.map(async (item, index) => {
      let instructionImgUrl = "";
      
      if (typeof item === "string") {
        if (instructionImgFiles[index]) {
          const instructionUpload = await cloudinary.uploader.upload(instructionImgFiles[index].path);
          instructionImgUrl = instructionUpload.secure_url;
        }
        return { name: item, instructionImg: instructionImgUrl };
      }
      

      if (instructionImgFiles[index]) {
        const instructionUpload = await cloudinary.uploader.upload(instructionImgFiles[index].path);
        instructionImgUrl = instructionUpload.secure_url;
      } else if (item.instructionImg) {
        instructionImgUrl = item.instructionImg;
      }
      
      return { 
        name: item.name || item, 
        instructionImg: instructionImgUrl 
      };
    })
  );

  
  try {
    const recipeData = new recipeDB({
      userId: req.userId,
      recipename,
      description,
      instructions: formattedInstructions,
      ingredients: JSON.parse(ingredients),
      cookingTime,
      recipeImg: recipeImgUrl,
      servingSize,
      appendices: parsedAppendices
    });

    await recipeData.save();
    res.status(200).json({ message: "Tạo công thức thành công", recipeData });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

// sua cong thuc
export const updateRecipe = async (req, res) => {
  const { recipeid } = req.params;
  
  const recipeImgFile = req.files && req.files.recipeImg ? req.files.recipeImg[0] : null;
  const instructionImgFiles = req.files && req.files.instructionImg ? req.files.instructionImg : [];
  
  const { recipename, description, instructions, ingredients, cookingTime, servingSize, appendices } = req.body;

  if (!recipename || !description || !instructions || !ingredients || !cookingTime || !servingSize) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  let parsedIngredients, parsedInstructions, parsedAppendices;

  try {
    parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
    parsedInstructions = typeof instructions === "string" ? JSON.parse(instructions) : instructions;
    parsedAppendices =  typeof appendices === "string" ? JSON.parse(appendices) : appendices;
  } catch (error) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }

  try {
    const existingRecipe = await recipeDB.findById(recipeid);
    if (!existingRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Upload recipe image nếu có file mới
    let recipeImgUrl = existingRecipe.recipeImg;
    if (recipeImgFile) {
      const recipeImgUpload = await cloudinary.uploader.upload(recipeImgFile.path);
      recipeImgUrl = recipeImgUpload.secure_url;
    }

    // Upload instruction images và map với instructions
    const formattedInstructions = await Promise.all(
      parsedInstructions.map(async (item, index) => {
        let instructionImgUrl = "";
        
        // Nếu có file mới upload ở index này
        if (instructionImgFiles[index]) {
          const instructionUpload = await cloudinary.uploader.upload(instructionImgFiles[index].path);
          instructionImgUrl = instructionUpload.secure_url;
        } else {
          // Không có file mới
          if (typeof item === "string") {
            // Nếu item là string, kiểm tra xem instruction cũ có ảnh không
            instructionImgUrl = existingRecipe.instructions[index]?.instructionImg || "";
          } else if (item.instructionImg) {
            // Nếu item đã có instructionImg, giữ lại
            instructionImgUrl = item.instructionImg;
          } else if (existingRecipe.instructions[index]?.instructionImg) {
            // Giữ lại ảnh cũ từ recipe hiện tại
            instructionImgUrl = existingRecipe.instructions[index].instructionImg;
          }
        }
        
        return {
          name: typeof item === "string" ? item : item.name,
          instructionImg: instructionImgUrl
        };
      })
    );

    const servingSizeNum = parseFloat(servingSize) || existingRecipe.servingSize;
    
    const adjustedIngredients = adjustMeasurements(
      parsedIngredients,
      existingRecipe.servingSize,
      servingSizeNum
    );

    const updateRecipe = await recipeDB.findByIdAndUpdate(
      { _id: recipeid },
      {
        recipename,
        description,
        instructions: formattedInstructions,
        ingredients: adjustedIngredients,
        cookingTime,
        recipeImg: recipeImgUrl,
        servingSize: servingSizeNum,
        appendices: parsedAppendices,
      },
      { new: true }
    );

    await updateRecipe.save();
    res.status(200).json({ message: "Sửa thành công", updateRecipe });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};


//xoa cong thuc
export const deleteRecipe = async (req, res) => {
  const { recipeid } = req.params;
  try {
    const deleteRecipe = await recipeDB.findByIdAndDelete({ _id: recipeid });
    res.status(200).json({ message: "Xóa thành công", deleteRecipe })
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error })
  }

}

// Tìm kiếm công thức
export const searchRecipe = async (req, res) => {
  try {
    const allRecipeData = await recipeDB.find({
      "$or": [
        { recipename: { $regex: req.params.key, $options: "i" } }
      ]
    });

    const recipesWithReviewCount = await Promise.all(
      allRecipeData.map(async (recipe) => {
        const reviews = await reviewDB.find({ recipeid: recipe._id });

        const averageRating = reviews.length > 0
          ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1)
          : 0;

        return {
          ...recipe.toObject(), 
          averageRating: Number(averageRating),
          reviewCount: reviews.length
        };
      })
    );

    res.json(recipesWithReviewCount);
    
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllRecipes = async (req, res) => {
  try {
    const allRecipeData = await recipeDB.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: 'userData'
        }
      }
    ]);

    const recipesWithReviewCount = await Promise.all( 
      allRecipeData.map(async (recipe) => {
        const minimumQuantity = 2;
        const reviews = await reviewDB.find({ recipeid: recipe._id });

        const calculateAverageRating = () => {
          if (reviews.length < minimumQuantity) return "0.0";
          const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
          return (total / reviews.length).toFixed(1);
        };

        const averageRating = calculateAverageRating();
        const reviewCount = reviews.length;

        return { ...recipe, averageRating, reviewCount };
      })
    );

    const count = await recipeDB.countDocuments();
    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      allRecipeData: recipesWithReviewCount,
      Pagination: {
        totalRecipeCount: count,
        pageCount
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};



export const getSingleRecipeData = async (req, res) => {
  const { recipeid } = req.params;

  try {
    const recipe = await recipeDB.findOne({ _id: recipeid }).populate('userId', 'username');
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

export const getRandomRecipeData = async (res) => {
  
}






const recipeAuthController = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipe,
  getAllRecipes,
  getSingleRecipeData
};

export default recipeAuthController;