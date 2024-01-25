var query = '';
var searchValue = document.getElementsByClassName("search");
var recipes = document.getElementsByClassName("recipes")[0];
var aRecipeDiv = document.getElementsByClassName("a-recipe")[0];
aRecipeDiv.style.display = "none";
searchValue[0].addEventListener("change",(event)=>{
  query = event.target.value;
fetchData();
})
async function fetchData(){
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        recipes.innerHTML = "";
        printRecipesUI(data.meals);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
}
function printRecipesUI(recipe){
  var notFound = document.getElementsByClassName("not-found")[0];
    if(recipe !== null){
        recipe.map(item =>{
            var recipeUI = document.createElement("div");
            recipeUI.className = "recipe";
            var recipeImage = document.createElement("img");
            recipeImage.src = "https://www.themealdb.com/images/media/meals/1529444830.jpg";
            var recipeName = document.createElement("h3");
            var viewRecipe = document.createElement("h4");
            viewRecipe.id = "view-item";
            viewRecipe.innerText = "View Recipe";
            recipeName.innerText= item.strMeal;
            recipeImage.src = item.strMealThumb;
            recipeUI.id = item.idMeal;
            recipeUI.append(recipeImage);
            recipeUI.append(recipeName);
            recipeUI.append(viewRecipe);
            recipes.append(recipeUI);
        })
        notFound.style.display = "none";
    }
    if(recipe === null){
      notFound.innerText = "No recipes found for the specified ingredients. Please try different ingredients.";
      notFound.style.display = "block";
      return;
    }
    var view = document.querySelectorAll("#view-item");
    viewData(view);
}
fetchData();
var sideBar = document.getElementsByClassName("pages")[0];
var menu = document.getElementById("menu");
let mediaQueries = window.matchMedia("(max-width: 1300px)");
function viewData(view){
  view.forEach(v => {
    v.addEventListener("click",event=>{
     var recipeId =  event.target.parentElement.id;
     var recipeUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;
     fetch(recipeUrl)
                .then(response => response.json())
                .then(data => {
                    recipeData(data.meals[0]);
                })
                .catch(error => {
                    console.error('Error fetching recipe details:', error);
                });
    })
  })
}
function aRecipeHTML(recipe,measure,ingredient,tags){

  var recipeHTML = `
                <h3 class="recipe-name">${recipe.strMeal}</h3>
                <i class="material-icons" id="a-recipe-close" style="color: aliceblue;">close</i>
                <div class="recipe-container">
                    <div class="title-image">
                        <img src=${recipe.strMealThumb} id= ${recipe.idMeal} class="recipe-image"/>
                    </div>
                    <div class="areas">
                        <h3>Areas</h3>
                        <p class="recipe-area">${recipe.strArea}</p>
                    </div>
                    <div class="category">
                        <h3>Category</h3>
                        <p class="recipe-category">${recipe.strCategory}</p>
                    </div>
                    <div class="ingredients">
                        <h3>Ingredients</h3>
                        ${
                          ingredient.map(ing => `<p class="recipe-ingredient">${ing}</p>`).join('')
                        }
                        
                    </div>
                    <div class="measures">
                        <h3>Measures</h3>
                        ${
                          measure.map(m => `<p class="recipe-measure">${m}</p>`).join('')
                        }
                    </div>
                    <div class="instructions">
                        <h3>Instruction</h3>
                        <p class="recipe-instructions">${recipe.strInstructions}</p>
                    </div>
                    <div class="other-social">
                        <h3>Social</h3>
                        <p class="recipe-source"><a href = ${recipe.strSource} target = "_blank">Visit Source</a></p>
                        <p class="recipe-youtube"><a href = ${recipe.strYoutube} target = "_blank">Watch Video in Youtube</a></p>
                        ${
                          ingredient.map(ing => `<span class="recipe-tags">${ing}</span>`).join('')
                        }
                    </div>
                </div>`
                return recipeHTML;
}
function recipeData(recipe){
  var measureArr = [];
  var tagsArr = recipe.strTags ? recipe.strTags.split(",") : "No Tags";
  var ingredientArr = [];
  for(var measure in recipe){
    if(recipe[measure] !== null){
      if(measure.includes("strMeasure") && recipe[measure].trim() !== "" ){
        measureArr.push(recipe[measure]);
      }
    }
   }
   for(var ingredient in recipe){
    if(ingredient.includes("strIngredient") && recipe[ingredient] !== null && recipe[ingredient] !== ""){
      ingredientArr.push(recipe[ingredient]);
    }
   }
   var recipeHTML = aRecipeHTML(recipe,measureArr,ingredientArr,tagsArr);
   aRecipeDiv.innerHTML = recipeHTML;
   recipes.style.display = "none";
   aRecipeDiv.style.removeProperty("display");
   var a_recipe_close = document.getElementById("a-recipe-close");
   a_recipe_close.addEventListener("click",(event)=>{
   aRecipeDiv.style.display = "none";
   recipes.style.display = "flex";
})
}

function handleScroll() {
    if (!mediaQueries.matches && window.innerWidth > 1300 && menu.innerText == "menu") {
      sideBar.style.display = "block";
    }
    else if(window.innerWidth < 1300 && menu.innerText == "menu"){
      sideBar.style.display = "none";
    }
    else if(window.innerWidth < 1300 && menu.innerText == "close"){
      menu.innerText = "menu";
      sideBar.style.display = "none";
    }
}

function handleMenuClick() {
  menu.innerText = menu.innerHTML === "menu" ? "close" : "menu";
  if(window.innerWidth){
    if (menu.innerText === "menu") {
        sideBar.style.display = "none";
    } else  {
        sideBar.style.display = "block";
    }
  }
 
}
if(mediaQueries.matches){
  sideBar.style.display = "none";
} 
window.addEventListener('resize', handleScroll);
menu.addEventListener("click", handleMenuClick);

var contact = document.getElementById("contact");
var contactForm = document.getElementById("contact-form");
contact.addEventListener("click",()=>{
  contactForm.style.display = "block";
  var contactHTML = `
          <div class="contact">
          <h1>Contact Us</h1>
            <input type="text"placeholder="Name" id="name" />
            <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890"  />
            <input type="submit" onClick = onSubmit(); id="submit" />
          </div>`
  contactForm.innerHTML = contactHTML;
  recipes.style.display = "none";
  aboutContent.style.display = "none";
})
var home = document.getElementById("home");
home.addEventListener("click",()=>{
  recipes.style.display = "flex";
  contactForm.style.display = "none";
  aboutContent.style.display = "none";
})
var aboutContent = document.getElementById("about");
aboutContent.style.display = "none";
var about = document.getElementById("about-data");
about.addEventListener("click",()=>{
  aboutContent.style.display = "block";
  recipes.style.display = "none";
  contactForm.style.display = "none";
})

function onSubmit(){
  var name = document.getElementById("name").value;
  // var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  if(name === "" || phone ===""){
    return;
  }
    const message = `Hello ${name}, Thanks for filling out the contact form.Will be in touch!`;

    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappLink, '_blank');
}