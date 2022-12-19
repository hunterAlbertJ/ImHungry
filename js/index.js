
const MEAL_KEY = "MealKey";
const randomMealBtn = document.getElementById("random-meal");
const categoriesBtn = document.getElementById("categories-button");
const filterCategory = document.getElementById("test");
const foodRow = document.getElementById('food-row');
const searchButton = document.getElementById("searchButton");

//this can be used to store the input of the search. For now just a placeholder for testing.
const category = "Seafood";



//random API call to meal, returns a object and creates card. 
randomMealBtn.addEventListener('click', () => {
	fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
		.then(res => res.json())
		.then(res => {
            clearRow()
        addMealtoDataBase(res.meals[0]);
        fullRecipe(res.meals[0]);
        //console.log(res.meals[0].idMeal);
	});
});

//category API call to get all categories and creates cars 
categoriesBtn.addEventListener('click', () => {
	fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
		.then(res => res.json())
		.then(res => {
         console.log(res.categories)
         //addMealtoDataBase(res.categories);
         clearRow();
         for (let i = 1; i < res.categories.length; i++){
             categoriesCard(res.categories[i]);
         }
	});

});

//We can use this API call for searching category and this returns all foods in that category.
filterCategory.addEventListener('click', () => {
	fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
		.then(res => res.json())
		.then(res => {
            console.log(res.meals)
            clearRow()
        for (let i = 0; i < res.meals.length; i++){
            mealCard(res.meals[i]);
        }
	});
});

searchButton.addEventListener('click', (e) => {
    let searchBarData = document.getElementById("searchBar").value
    const sanitizer = new Sanitizer();  // Default sanitizer;
    const sanitizedDiv = sanitizer.sanitizeFor("div", searchBarData);
    console.log(sanitizedDiv.innerHTML)
e.preventDefault()

}) 

//this is to populate a card with category data. 
const categoriesCard = (category) => {
        const newCard = 
        `<div data-aos="fade-up" class="col-md-3 col-sm-4 mt-2 mb-2">
        <div id=${category.idCategory} class="card h-100 text-center" style="width: 20rem;">
            <img src="${category.strCategoryThumb}" class="card-img-top" style="border-radius: 25%;" alt="imgae of meal">
            <div class="card-body">
                ${category.strCategory ? `<h5 class="card-title">${category.strCategory}</h5>` : ""}
                ${category.strCategoryDescription ? `<strong>Description:</strong> ${category.strCategoryDescription}` : ""}
            </div>
        </div>
        </div>`;
	
        foodRow.insertAdjacentHTML("beforeend", newCard);
    
}


//this is to populate a card with meal data. 
const mealCard = (meal) => {
	const ingredients = [];
	// Get all ingredients from the object. Max 20
	for(let i = 1; i <= 20; i++) {
		if(meal[`strIngredient${i}`]) {
			ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
		} else {
			break; //Loop will stop when no more indgredients.
		}
	}
	
	const newCard = `
    <div data-aos="fade-up" class="col-md-3 col-sm-6">
        <div id=${meal.idMeal} class="card m-2" style="width: 20rem;">
        <img src="${meal.strMealThumb}" class="card-img-top" style="border-radius: 25%;" alt="imgae of meal">
        <div class="card-body">
            ${meal.strMeal ? `<h5 class="card-title">${meal.strMeal}</h5>` : ""}
            ${meal.strArea ? `<strong>Area:</strong> ${meal.strArea}` : ""}
        </div>
        </div>
    </div>`;
	
        foodRow.insertAdjacentHTML("beforeend", newCard);
}

//This function creates a full recipe of a meal with all ingredients, video, instructions. 
const fullRecipe = (meal) => {
    const ingredients = [];
	// Get all ingredients from the object. Up to 20
	for(let i=1; i<=20; i++) {
		if(meal[`strIngredient${i}`]) {
			ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
		} else {
			// Stop if no more ingredients
			break;
		}
	}


    const mealCard = ` <div data-aos="fade-up" class="col-md-6 mt-3 mb-3">
    <h3>${meal.strMeal}</h3>
    <img
      src="${meal.strMealThumb}"
      class="card-img-top"
      alt="food image"
    />
    <div class="card-body">
    ${meal.strCategory ? `<p><strong>Category:</strong> ${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
    ${meal.strTags ? `<p><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</p>` : ''}
    </div>
  </div>
  <div class="col-md-6 mt-3 mb-3">
    <div>
      <div class="card-body">
      <h5>Ingredients:</h5>
      <ul>
      ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
      <p class="card-text">${meal.strInstructions}</p>
      ${meal.strYoutube ? `
            <div class="text-center">
                <h5>Video Recipe</h5>
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
    let data = JSON.parse(localStorage.getItem(MEAL_KEY));
    if (!data) {
      data = [];
    }
    return data;
  }

  function saveData(data) {
    localStorage.setItem(MEAL_KEY, JSON.stringify(data));
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

  function clearRow(){
    while(foodRow.firstElementChild){
        foodRow.firstElementChild.remove();
    };
  }