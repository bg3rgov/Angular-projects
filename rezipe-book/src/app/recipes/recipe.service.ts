import { Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredients.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";
import { Subject } from "rxjs";


@Injectable()
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();

    // recipes: Recipe[] = 
    // [
    //     new Recipe(
    //         'Healthy meal', 
    //         'Healthy meat and vegitables', 
    //         'https://chefphillipdewayne.com/site/wp-content/uploads/2018/08/6.jpg', 
    //         [
    //             new Ingredient('Chicken', 1),
    //             new Ingredient('Vegetables', 3),
    //         ]
    //     ),
    //     new Recipe(
    //         'Tasty Burger',
    //         'Burger with beef, egg and cheese',
    //         'https://happilyunprocessed.com/wp-content/uploads/2018/03/Juicest-Burger-Everfeature.jpg.jpg', 
    //         [
    //             new Ingredient('Beef meat', 1),
    //             new Ingredient('eggs', 1),
    //             new Ingredient('cheese', 2)
    //         ]
    //     ),
    //     new Recipe(
    //         'Cheesecake', 
    //         'Cheesecase with strawberry', 
    //         'https://cdn.sallysbakingaddiction.com/wp-content/uploads/2019/03/no-bake-cheesecake-4.jpg', 
    //         [
    //             new Ingredient('Creamcheese', 3),
    //             new Ingredient('eggs', 5),
    //             new Ingredient('Strawberry', 12)
    //         ]
    //     )
    // ];

    private recipes: Recipe[] = [];

    constructor(private shoppingListService:ShoppingListService){}

    setRecipes(recipes: Recipe[]) {

        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {

        return this.recipes.slice();
    }

    getRecipe(index: number) {

        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {

        this.shoppingListService.addIngredients(ingredients)
    }

    addRecipe(recipe: Recipe) {

        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {

        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {

        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}