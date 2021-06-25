import { Ingredient } from "../shared/ingredients.model";
import { Subject } from "rxjs";

export class ShoppingListService {

    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    selectedIngredient = new Subject<Ingredient>()

    private ingredients: Ingredient[] = [
        new Ingredient('Peppers', 5),
        new Ingredient('Tomatoes', 2)
    ];

    getIngredient(index: number) {

        return this.ingredients[index];
    }

    getIngredients() {

        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {

        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {

        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    updateIngredient(index: number, newIngredient: Ingredient) {

        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {

        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}