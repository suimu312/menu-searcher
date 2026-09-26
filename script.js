const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const mealsContainer = document.getElementById('meals');
const mealDetails = document.getElementById('meal-details');
const backBtn = document.getElementById('back-btn');
const errorContainer = document.getElementById('error-container');

// 返回按钮
backBtn.addEventListener('click', () => {
    mealDetails.style.display = 'none';
    mealsContainer.style.display = 'grid';
});

// 点击菜品卡片打开详情
document.querySelectorAll('.meal').forEach(item => {
    item.addEventListener('click', () => {
        mealsContainer.style.display = 'none';
        mealDetails.style.display = 'block';
    });
});

// 搜索按钮
searchBtn.addEventListener('click', searchMeal);
searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') searchMeal();
});

function searchMeal(){
    const searchTerm = searchInput.value.trim();
    if(!searchTerm) return;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    .then(res => res.json())
    .then(data => {
        if(!data.meals){
            errorContainer.classList.remove('hidden');
            mealsContainer.innerHTML = '';
            return;
        }
        errorContainer.classList.add('hidden');
        renderMeals(data.meals);
    })
    .catch(err => {
        errorContainer.classList.remove('hidden');
    })
}

// 渲染菜品列表
function renderMeals(meals){
    mealsContainer.innerHTML = '';
    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal';
        mealDiv.dataset.mealId = meal.idMeal;
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-info">
                <h3 class="meal-title">${meal.strMeal}</h3>
                <div class="meal-category">${meal.strCategory}</div>
            </div>
        `;
        mealDiv.addEventListener('click', ()=> getMealDetail(meal.idMeal));
        mealsContainer.appendChild(mealDiv);
    })
}

// 获取单个菜品详情并渲染
function getMealDetail(id){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        const content = document.querySelector('.meal-details-content');

        // 收集食材
        let ingredientsHtml = '';
        for(let i = 1; i <=20; i++){
            const ing = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if(ing && ing.trim()){
                ingredientsHtml += `<li><i class="fa-solid fa-check-circle"></i> ${measure} ${ing}</li>`
            }
        }

        content.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
            <h2 class="meal-details-title">${meal.strMeal}</h2>
            <div class="meal-details-category">
                <span>${meal.strCategory}</span>
            </div>
            <div class="meal-details-instructions">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="meal-details-ingredients">
                <h3>Ingredients</h3>
                <ul class="ingredients-list">
                    ${ingredientsHtml}
                </ul>
            </div>
            <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
                <i class="fa-brands fa-youtube"></i> Watch Video
            </a>
        `;
        mealsContainer.style.display = 'none';
        mealDetails.style.display = 'block';
    })
}
