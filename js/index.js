
const randomMealBtn = document.getElementById("random-meal");
const categoriesBtn = document.getElementById("categories-button")
const filterCategory = document.getElementById("test");
const foodRow = document.getElementById('food-row');
const searchButton = document.getElementById("searchButton");

//this can be used to store the input of the search. For now just a placeholder for testing. 
const category = "Seafood"



//random API call to meal, returns a object and creates card. 
randomMealBtn.addEventListener('click', () => {
	fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
		.then(res => res.json())
		.then(res => {
        fullRecipe(res.meals[0]);
        console.log(res);
	});
});

//category API call to get all categories and creates cars 
categoriesBtn.addEventListener('click', () => {
	fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
		.then(res => res.json())
		.then(res => {
            console.log(res.categories)
        categoriesCard(res.categories);
	});

});

//We can use this API call for searching category and this returns all foods in that category.
filterCategory.addEventListener('click', () => {
	fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
		.then(res => res.json())
		.then(res => {
            console.log(res)
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

const categoriesCard = (category) => {
    for (let i = 1; i < category.length; i++){
        
        const newCard = `
        <div data-aos="fade-up"id=${category[i].idCategory} class="card text-center mt-3" style="width: 20rem;">
        <img src="${category[i].strCategoryThumb}" class="card-img-top" style="border-radius: 25%;" alt="imgae of meal">
        <div class="card-body">
            ${category[i].strCategory ? `<h5 class="card-title">${category[i].strCategory}</h5>` : ""}
            ${category[i].strCategoryDescription ? `<strong>Description:</strong> ${category[i].strCategoryDescription}` : ""}
        </div>
        </div>`;
	
        foodRow.insertAdjacentHTML("afterbegin", newCard);
    }
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
        color: blue;
    }  
    h3{
        font-style: italic;
        font-size: 40px;
    }
    ul{
        color: darkblue;
        list-style-type: none;
        columns:100px 2;

    }
    p{
        color: white;
        font-size:25px;
    }
    p1{
        color:blue;
    }
  </style>

  <div class="col-md-6 mt-3 mb-3">
    <div class="card" style="height: auto">
      <div class="card-body">
      <h5>Ingredients:</h5>
      <ul>
      ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
      <p1 class="card-text">${meal.strInstructions}</p1>
      <br>
      <br>
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