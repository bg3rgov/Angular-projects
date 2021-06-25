import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{

    isAuthenticated = false;

    private userSub: Subscription;
    constructor(private authService: AuthService, private dataStorageService: DataStorageService) {}

    ngOnInit() {

        this.userSub = this.authService.user.subscribe(user => {
            
            //user ? false : true; 
            this.isAuthenticated = !!user;
        })
    }

    onSaveData() {

        this.dataStorageService.storeRecipes();
    }

    onFetchData() {

        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout() {

        this.authService.logout();
    }

    ngOnDestroy() {

        this.userSub.unsubscribe();
    }
}