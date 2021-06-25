import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

import { map, tap, take, exhaustMap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
    ) {}

    storeRecipes() {

        const recipes = this.recipeService.getRecipes();
        return this.http.put(
            'https://ng-demo-8f661-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipes    
        ).subscribe(responce => {

            console.log(responce);
        })
    }

    fetchRecipes() {

        console.log('FETCH');
        
        
        return this.http
        .get<Recipe[]>('https://ng-demo-8f661-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
        .pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    }
                });
            }), 
            tap(recipes => {

                this.recipeService.setRecipes(recipes);
            })
        )
    }
}