
const randomMealBtn = document.getElementById("random-meal");
const categoriesBtn = document.getElementById("categories-button")
const foodRow = document.getElementById('food-row');
const searchButton = document.getElementById("searchButton");

//const category = "Seafood"



//random API call to meal, returns a object and creates card. 
randomMealBtn.addEventListener('click', () => {
	fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
		.then(res => res.json())
		.then(res => {
        mealCard(res.meals[0]);
        console.log(res);
	});
});

categoriesBtn.addEventListener('click', () => {
	fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
		.then(res => res.json())
		.then(res => {
            console.log(res.categories)
        categoriesCard(res.categories);
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
	
        document.querySelector("#food-row").insertAdjacentHTML("beforeend", newCard);
    }
}

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

        <div id=${meal.idMeal} class="card" style="width: 20rem;">
        <img src="${meal.strMealThumb}" class="card-img-top" style="border-radius: 25%;" alt="imgae of meal">
        <div class="card-body">
            ${meal.strMeal ? `<h5 class="card-title">${meal.strMeal}</h5>` : ""}
            ${meal.strArea ? `<strong>Area:</strong> ${meal.strArea}` : ""}
        </div>
        <ul class="list-group list-group-flush">
            ${meal.strCategory ? `<li class="list-group-item"><strong>Category:</strong> ${meal.strCategory}</li>` : ""}
            ${meal.strTags ? `<li class="list-group-item"><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</li>` : ""}
        </ul>
        <div class="card-body">
            <a href="#" class="card-link">Full Recipe</a>
            <a href="${meal.strYoutube}" target="_blank" class="card-link _blank">Video Recipe</a>
        </div>
        </div>`;
	
	foodRow.innerHTML = newCard;
}
