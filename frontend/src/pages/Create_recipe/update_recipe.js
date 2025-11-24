import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPopup from '../../components/LoadingPopup';
import "./Create_recipe.scss";

const UpdateRecipe = () => {
  const [recipename, setRecipename] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [instructions, setInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [appendices, setAppendices] = useState([]);  
  const [cookingTime, setCookingTime] = useState('');
  const [servingSize, setServingSize] = useState(1);
  const [file, setFile] = useState(null);
  const [instructionFiles, setInstructionFiles] = useState([]);
  const [recipeImgUrl, setRecipeImgUrl] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const { recipeid } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = localStorage.getItem("authToken");
      setToken(token);
      try {
        const res = await axios.get(`http://localhost:5000/recipe/api/singleRecipe/${recipeid}`);
        const recipe = res.data;
        setRecipename(recipe.recipename || '');
        setDescription(recipe.description || '');

        setInstructions(Array.isArray(recipe.instructions) ?
          recipe.instructions.map(instruction => ({
            name: instruction.name || '',
            image: instruction.instructionImg || '',
          })) :
        []);

        console.log(recipe.instructions)


        setIngredients(Array.isArray(recipe.ingredients) ?
          recipe.ingredients.map(ing => ({
            name: ing.name || '',
            measurement: ing.measurement || '',
            quantity: ing.quantity || 1
          })) :
        []);

        setAppendices(Array.isArray(recipe.appendices) ?
          recipe.appendices.map(appendix => ({
            keyWord: appendix.keyWord || '',
            defintion: appendix.defintion || '',
          })) :
        []);

        setCookingTime(recipe.cookingTime || '');
        setServingSize(recipe.servingSize || 1);
        setRecipeImgUrl(recipe.recipeImg || '');
      } catch (err) {
        setError("Không thể tải công thức");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeid]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('recipename', recipename);
    formData.append('description', description);
    
    const formattedInstructions = instructions.map(instruction => ({
      name: instruction.name || '',
      instructionImg: instruction.image || ''
    }));
    formData.append('instructions', JSON.stringify(formattedInstructions));
    
    const formattedIngredients = ingredients.map(ing => ({
      ...ing,
      quantity: parseFloat(ing.quantity) || 0
    }));

    formData.append('ingredients', JSON.stringify(formattedIngredients));
    formData.append('cookingTime', cookingTime);
    formData.append('servingSize', parseFloat(servingSize) || 1);
    formData.append("appendices", JSON.stringify(appendices));
    if (file) {
      formData.append('recipeImg', file);
    }

    instructionFiles.forEach(file => {
      if (file) formData.append("instructionImg", file);
    });

    try {
      await axios.put(`http://localhost:5000/recipe/api/update/${recipeid}`, formData, {
        headers: {
          'Authorization': ` ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
    } catch (err) {
      setError(err.response?.data?.error || "Cập nhật thất bại");
    } finally {
      setIsLoading(false)
      navigate(`/recipe/${recipeid}`);
    }
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, { name: '', image: '' }]);
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = { ...newInstructions[index], name: value };
    setInstructions(newInstructions);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', measurement: '', quantity: 1 }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddAppendix = () => {
    setAppendices([...appendices, { keyWord: "", defintion: "" }]);
  };

  const handleAppendixChange = (index, field, value) => {
    const newAppendices = [...appendices];
    newAppendices[index][field] = value;
    setAppendices(newAppendices);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleRemoveInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleRemoveAppendix = (index) => {
    setAppendices(appendices.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInstructionFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...instructionFiles];
      newFiles[index] = file;
      setInstructionFiles(newFiles);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className='create_recipe_body'>
      <LoadingPopup isLoading={isLoading} />

      <section>
        <Container className='form_container'>
          <div className="form_data">
            <div className="form_heading">
              <h1>Cập nhật công thức</h1>
            </div>

            <form onSubmit={handleUpdate} className='summit_form'>
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
                <textarea
                  name="description"
                  id="description"
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form_input">
                <label htmlFor="ingredients">Nguyên liệu</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-row">
                    <input
                      type="text"
                      placeholder="Nhập nguyên liệu"
                      value={ingredient.name || ""}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="mr-2"
                    />
                    <input
                      type="number"
                      placeholder="Số lượng"
                      value={ingredient.quantity || ""}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      className="mr-2"
                    />
                    <select
                      value={ingredient.measurement || ""}
                      onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)}
                      className="mr-2"
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
                <label htmlFor="instructions">Hướng dẫn</label>
                {instructions.map((instruction, index) => (
                  <div key={index} className="instruction-row">
                    <label>Bước {index + 1}</label>
                    <input
                      type="text"
                      placeholder="Nhập hướng dẫn"
                      value={instruction.name || ''}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                    />
                    
                    <div className="form_input">
                      {instruction.image && (
                        <img
                          src={instruction.image}
                          alt="Ảnh bước làm hiện tại"
                          style={{ maxWidth: '200px', marginBottom: '10px', display: 'block' }}
                        />
                      )}

                      <input
                        type="file"
                        name={`instructionImg`}
                        onChange={(e) => handleInstructionFileChange(index, e)}
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
                  {recipeImgUrl && typeof recipeImgUrl === 'string' && (
                  <div className="form_input_img_preview">
                    <img
                      src={recipeImgUrl}
                      alt="Ảnh công thức hiện tại"
                      style={{ maxWidth: '200px', marginBottom: '10px', display: 'block' }}
                    />
                  </div>
                  )}
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={handleFileChange}/>
              </div>

              <div className="form_input_appendices">
                <div className="label_with_des">
                  <label htmlFor="appendices">Phụ lục</label>
                </div>
                {appendices.map((appendix, index) => (
                  <div key={index} className="instruction-column">
                    
                    <label>Phụ lục {index + 1}</label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập keyWord"
                      value={appendix.keyWord}
                      onChange={(e) => handleAppendixChange(index, "keyWord", e.target.value)}/>
                    
                    <Form.Control
                      type="text"
                      as="textarea"
                      placeholder="Nhập giải thích"
                      value={appendix.defintion}
                      onChange={(e) => handleAppendixChange(index, "defintion", e.target.value)}/>
                    
                    <Button variant="danger" onClick={() => handleRemoveAppendix(index)}>X</Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddAppendix} className="button">
                  Thêm
                </Button>
              </div>

              {typeof error === "object" ? <p className="error">{error.message}</p> : <p className="error">{error}</p>}

              <Button type="submit">Cập nhật công thức</Button>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default UpdateRecipe;