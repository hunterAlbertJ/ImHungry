
const FAV_KEY = "MealKey";
const randomMealBtn = document.getElementById("random-meal");
const categoriesBtn = document.getElementById("categories-button");
const foodRow = document.getElementById('food-row');
const searchButton = document.getElementById("searchButton");
const favoriteButton = document.getElementById("favorite-button");

//this can be used to store the input of the search. For now just a placeholder for testing.
const category = "Seafood";



//random API call to meal, returns a object and creates card. 
randomMealBtn.addEventListener('click', () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(res => {
      clearRow()
      fullRecipe(res.meals[0]);
      let toDelete = document.getElementById("pictures");
      toDelete.innerHTML="";
      //console.log(res.meals[0].idMeal);
    });
});

//category API call to get all categories and creates cars 
categoriesBtn.addEventListener('click', () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then(res => res.json())
    .then(res => {
      console.log(res.categories)
      clearRow();
      for (let i = 1; i < res.categories.length; i++) {
        categoriesCard(res.categories[i]);
      }
      let toDelete = document.getElementById("pictures");
      toDelete.innerHTML="";
    });

});

//We can use this API call for searching category and this returns all foods in that category.
favoriteButton.addEventListener('click', () => {
    let data = loadDataFromDB();
    clearRow()
      for (let i = 0; i < data.length; i++) {
        mealCard(data[i]);
      }
      let toDelete = document.getElementById("pictures");
      toDelete.innerHTML="";
    });


searchButton.addEventListener('click', (e) => {
  let searchBarData = document.getElementById("searchBar").value
  const sanitizer = new Sanitizer();  // Default sanitizer;
  const sanitizedDiv = sanitizer.sanitizeFor("div", searchBarData);
  console.log(sanitizedDiv.innerHTML)
  e.preventDefault()
  let toDelete = document.getElementById("pictures");
      toDelete.innerHTML="";

})

//this is to populate a card with category data. 
const categoriesCard = (category) => {
  console.log(category.strCategory)
  const newCard =
    `
        <div id=${category.strCategory} class="card h-100 text-center" style="width: 100%;">
            <img src="${category.strCategoryThumb}" class="card-img-top" style="border-radius: 25%;" alt="imgae of meal">
            <div class="card-body">
                ${category.strCategory ? `<h5 class="card-title">${category.strCategory}</h5>` : ""}
                ${category.strCategoryDescription ? `<strong>Description:</strong> ${category.strCategoryDescription}` : ""}
            </div>
        </div>
       `;
  let test = document.createElement("div");
  test.setAttribute("data-aos", "fade-up");
  test.setAttribute("class", "col-md-3 col-sm-4 mt-2 mb-2")
  test.addEventListener("click", () => {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`)
    .then(res => res.json())
    .then(res => {
      console.log(res.meals)
      clearRow()
      for (let i = 0; i < res.meals.length; i++) {
        mealCard(res.meals[i]);
      }
    });
  })
  test.innerHTML = newCard;
  foodRow.appendChild(test)

}


//this is to populate a card with meal data. 
const mealCard = (meal) => {
  const ingredients = [];
  // Get all ingredients from the object. Max 20
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break; //Loop will stop when no more indgredients.
    }
  }
  console.log(meal.strMeal)
  const newCard = `
    
        <div id=${meal.idMeal} class="card" style="width: 18rem;">
        <img src="${meal.strMealThumb}" class="card-img-top" style="border-radius: 25%;" alt="imgae of meal">
        <div class="card-body">
            ${meal.strMeal ? `<h5 class="card-title">${meal.strMeal}</h5>` : ""}
            ${meal.strArea ? `<strong>Area:</strong> ${meal.strArea}` : ""}
        </div>
        </div>
    `;



  let mealCardIndividual = document.createElement("div");
  mealCardIndividual.setAttribute("data-aos", "fade-up");
  mealCardIndividual.setAttribute("class", "col-md-3 col-sm-4 col-lg-3 mt-2 mb-2")
  mealCardIndividual.addEventListener("click", () => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
    .then(res => res.json())
    .then(res => {
      console.log(res.meals)
      clearRow()
      fullRecipe(res.meals[0]);
    });
  })
  mealCardIndividual.innerHTML = newCard;
  foodRow.appendChild(mealCardIndividual)
}

//This function creates a full recipe of a meal with all ingredients, video, instructions. 
const fullRecipe = (meal) => {
    let colorOfHeart = "white";
    let data = loadDataFromDB();
    for (let i = 0; i < data.length; i++){
        if (data[i].strMeal === meal.strMeal){
            colorOfHeart = "red";
        }
    }
  const ingredients = [];
  // Get all ingredients from the object. Up to 20
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
      // Stop if no more ingredients
      break;
    }
  }


    const mealCard = ` <div class="col-md-6 mt-3 mb-3">
    <h3><br>${meal.strMeal}<br><br></h3>
    <img
      src="${meal.strMealThumb}"
      class="card-img-top"
      alt="food image"
    />
    <div class="card-body">
    ${meal.strCategory ? `<p><br><strong>Category:</strong> ${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
    ${meal.strTags ? `<p><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</p>` : ''}
    </div>
  </div>

  
  <style>
    h5{ 
        color: #9900ff;
        font-size: 25px;
        font-style: italic;
    }  
    h3{
        font-style: italic;
        font-size: 40px;
    }
    ul{
        color: #9900cc;
        list-style-type: none;
        columns:100px 2;

    }
    p{
        color: white;
        font-size:25px;
    }
    p1{
        color: #990099;
    }
  </style>

  <div class="col-md-6 mt-3 mb-3">
    <div class="card" style="height: auto">
      <div class="card-body">
      <h5>Ingredients:<hr></h5>
      <ul>
      ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
      <hr>
      <p1 class="card-text">${meal.strInstructions}</p1>
      <hr>
      ${meal.strYoutube ? `
            <div class="text-center">
                <h5>Video Recipe:</h5>
                <div class="videoWrapper">
                    <iframe width="500" height="400"
                    src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
                    </iframe>
                </div>
            </div>` : ''}
      </div>
    </div>
  </div>
  `;
  foodRow.innerHTML = mealCard;
}


function loadDataFromDB() {
  let data = JSON.parse(localStorage.getItem(FAV_KEY));
  if (!data) {
    data = [];
  }
  return data;
}

function saveData(data) {
  localStorage.setItem(FAV_KEY, JSON.stringify(data));
}

function addMealtoDataBase(mealData) {
  let data = loadDataFromDB();

  //will find mealData in DB that matches incoming meal id. if cannot find will push into db.
  let mealInLocalStorage = data.find((data) => data.idMeal === mealData.idMeal);

  if (!mealInLocalStorage) {
    data.push(mealData);
  }
  //save to database
  saveData(data);
}


  function addMealtoDataBase(mealData) {
    let data = loadDataFromDB();

    //will find mealData in DB that matches incoming meal id. if cannot find will push into db.
    let mealInLocalStorage = data.find((data) => data.idMeal === mealData.idMeal); 

    if(!mealInLocalStorage){
        data.push(mealData);
    } 
    //save to database
    saveData(data);
  }

  //clears the row that hold the cards for new results to be shown. 
  function clearRow(){
    while(foodRow.firstElementChild){
        foodRow.firstElementChild.remove();
    };
  }

  function favoriteClicked(e){
   
    let heartColor = document.getElementById("heartButton");
    
    let mealId = (heartColor.parentElement.parentElement.parentElement.id);
   
    if (heartColor.style.color === "white"){
        heartColor.style.color = "red";
        //add liked meal to database
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(res => {
        addMealtoDataBase(res.meals[0]);
    });
        
    } else {
        heartColor.style.color = "white";
        let data = loadDataFromDB();
        data = data.filter((meal) => meal.idMeal !== mealId);
        saveData(data);
    }
  }



