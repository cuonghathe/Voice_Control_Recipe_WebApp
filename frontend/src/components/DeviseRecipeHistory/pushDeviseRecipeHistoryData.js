export default function pushDeviseRecipeHistoryData (recipeId){
  const recipeHistoryLimit = 20;
  const recipeHistoryInfoStr = localStorage.getItem("recipeHistoryInfo");
  if(!recipeHistoryInfoStr){
    localStorage.setItem("recipeHistoryInfo", JSON.stringify([recipeId]));
  } else {
    let recipesIdArr = JSON.parse(recipeHistoryInfoStr);
    if(recipesIdArr.includes(recipeId)){
      recipesIdArr = recipesIdArr.filter(Id => Id != recipeId)
    }

    if(recipesIdArr.length > recipeHistoryLimit){
      recipesIdArr.pop();
    }
    
    recipesIdArr.unshift(recipeId);
    localStorage.setItem("recipeHistoryInfo", JSON.stringify(recipesIdArr))
  }
}
