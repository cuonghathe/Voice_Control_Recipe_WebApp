export default function formatRecipeData(recipeData) {
  const ingredientsFormatted = recipeData.ingredients.map((ingredient, index) => `Nguyên liệu ${index + 1}: ${ingredient.name} ${ingredient.quantity} ${ingredient.measurement}`).join('\n');
  const instructionsFormatted = recipeData.instructions.map((step, index) => `Bước ${index + 1}: ${step}`).join('\n');
  const appendicesFormatted = recipeData.appendices.map((appendix, index) => `Phụ lục ${index + 1}: ${appendix.keyWord} ${appendix.defintion}`).join('\n');
  const formattedString = `
    Tên món ăn: ${recipeData.recipename}
    Thời gian nấu: ${recipeData.cookingTime}
    Kích cỡ phần ăn: ${recipeData.servingSize}
    Mô tả: ${recipeData.description}
    
    Nguyên liệu:
    ${ingredientsFormatted}
    
    Hướng dẫn:
    ${instructionsFormatted}

    Phụ lục:
    ${appendicesFormatted}
  `;

  return formattedString;
}


