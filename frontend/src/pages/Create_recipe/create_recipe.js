import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DescriptionBox from "../../components/DescriptionBox/DescriptionBox";
import LoadingPopup from "../../components/LoadingPopup";
import "./Create_recipe.scss";

const CreateRecipe = () => {
  const [recipename, setRecipename] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState([""]);
  const [ingredients, setIngredients] = useState([{ name: "", measurement: "", quantity: 0 }]);
  const [cookingTime, setCookingTime] = useState("");
  const [servingSize, setServingSize] = useState(1);
  const [file, setFile] = useState(null);
  const [instructionFiles, setInstructionFiles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const ingredientDes = `Bạn cần nhập đủ thông tin về nguyên liệu để có thể tạo công thức, nhấn nút thêm để thêm mới nguyên liệu muốn nhập
  hoắc nhấn nút X nếu muốn loại bỏ nguyên liệu đó`

  const instructionDes = `Bạn chỉ cần nhập bước làm để có thể tạo công thức, nếu muốn thêm hình ảnh về bước làm hãy đảm bảo chúng là định
  dạng .jpg, .jpeg, .png`

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleInstructionFileChange = (index, file) => {
    const newFiles = [...instructionFiles];
    newFiles[index] = file;
    setInstructionFiles(newFiles);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", measurement: "", quantity: 0 }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleRemoveInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("recipename", recipename);
    formData.append("description", description);
    formData.append("instructions", JSON.stringify(instructions));
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("cookingTime", cookingTime);
    formData.append("servingSize", servingSize);
    if (file) {
      formData.append("recipeImg", file);
    }

    instructionFiles.forEach(file => {
      if (file) formData.append("instructionImg", file);
    });

    try {
      await axios.post("http://localhost:5000/recipe/api/create", formData, {
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      navigate("/Recipes");
    } catch (error) {
      console.error("Lỗi tạo công thức:", error);
      setError(error.response?.data?.error || "Lỗi tạo công thức");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create_recipe_body">
      <LoadingPopup isLoading={isLoading} />
      
      <section>
        <Container className="form_container">
          <div className="form_data">
            <div className="form_heading">
              <h1>Tạo công thức</h1>
            </div>

            <form onSubmit={handleSubmit} className="summit_form">
              <div className="form_input">
                <label htmlFor="recipename">Tên</label>
                <input
                  type="text"
                  name="recipename"
                  id="recipename"
                  placeholder="Tên công thức"
                  value={recipename}
                  onChange={(e) => setRecipename(e.target.value)}
                />
              </div>

              <div className="form_input">
                <label htmlFor="description">Mô tả</label>
                <Form.Control
                  name="description"
                  rows={3}
                  as="textarea"
                  id="description"
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form_input">
                <div className="label_with_des">
                  <label htmlFor="ingredients">Nguyên liệu</label>
                  <DescriptionBox description={ingredientDes}/>
                </div>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-row">
                    <input
                      type="text"
                      placeholder="Nhập nguyên liệu"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                      className="mr-2"
                    />
                    <input
                      type="number"
                      placeholder="Số lượng"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                      className="mr-2"
                    />
                    <select
                      value={ingredient.measurement}
                      onChange={(e) => handleIngredientChange(index, "measurement", e.target.value)}
                      className="mr-2"
                      placeholder="Đơn vị"
                    >
                      <option value="Gram">g</option>
                      <option value="Kilo gram">kg</option>
                      <option value="Lit">L</option>
                      <option value="Mililit">ml</option>
                      <option value="Cái">cái</option>
                      <option value="Gói">gói</option>
                      <option value="Củ">củ</option>
                      <option value="Quả">quả</option>
                      <option value="Lon">lon</option>
                      <option value="Thìa bột canh">thìa bột canh</option>
                      <option value="Muỗng">muỗng</option>
                    </select>
                    <Button variant="danger" onClick={() => handleRemoveIngredient(index)}>X</Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddIngredient} className="button">
                  Thêm
                </Button>
              </div>

              <div className="form_input_instructions">
                <div className="label_with_des">
                  <label htmlFor="instructions">Hướng dẫn bước làm</label>
                  <DescriptionBox description={instructionDes}/>
                </div>
                {instructions.map((instruction, index) => (
                  <div key={index} className="instruction-column">
                    <br></br>
                    <label>Bước {index + 1}</label>
                    <Form.Control
                      type="text"
                      as="textarea"
                      placeholder="Nhập hướng dẫn"
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                    />
                    <div className="form_input_img">
                      <input
                        type="file"
                        name={`instructionImg`}
                        onChange={(e) => handleInstructionFileChange(index, e.target.files[0])}
                      />
                    </div>
                    <Button variant="danger" onClick={() => handleRemoveInstruction(index)}>X</Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddInstruction} className="button">
                  Thêm
                </Button>
              </div>

              <div className="form_input">
                <label htmlFor="cookingTime">Thời gian nấu</label>
                <input
                  type="text"
                  name="cookingTime"
                  id="cookingTime"
                  placeholder="Thời gian nấu"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                />
              </div>

              <div className="form_input">
                <label htmlFor="servingSize">Suất ăn</label>
                <input
                  type="number"
                  name="servingSize"
                  id="servingSize"
                  placeholder="Số lượng suất ăn"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                />
              </div>

              <div className="form_input">
                <label htmlFor="file">Ảnh công thức</label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={handleFileChange}
                />
              </div>

              {typeof error === "object" ? <p className="error">{error.message}</p> : <p className="error">{error}</p>}

              <Button type="submit">Tạo công thức</Button>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CreateRecipe;