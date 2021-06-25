import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})
export class AuthService {

    isAuthenticated = false;
    private token: string;
    private tokenTimer: NodeJS.Timer;
    private userId: string;
    private authStatusListener = new Subject<boolean>();
    constructor(
        
        private http: HttpClient, 
        private router: Router
    ) {}

    getToken() {

        return this.token;
    }

    getAuthStatusListener() {

        return this.authStatusListener.asObservable();
    }

    getIsAuth() {

        return this.isAuthenticated;
    }

    getUserId() {

        return this.userId;
    }

    createUser(email:string, password:string) {

        const authData: AuthData = {email: email, password: password}
        this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response => {
            
            this.router.navigate(['/login']);
        }, error => {

            this.authStatusListener.next(false);
            console.log(error);
        })
    }

    login(email:string, password:string) {

        const authData: AuthData = {email: email, password: password}
        this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
        .subscribe(response => {

            const token = response.token;
            this.token = token;

            if(token){

                console.log(response)
                const expiresInDuration = response.expiresIn;
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(this.isAuthenticated);
                this.setAuthTimer(expiresInDuration)
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
                this.saveAuthData(token, expirationDate, this.userId)
                this.router.navigate(['/']);
            }
        }, error => {

            this.authStatusListener.next(false);
        })
    }

    autoAuthUser() {

        const authInformation = this.getAuthData();

        if(!authInformation){
            return;
        }
        
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        
        if(expiresIn > 0) {

            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn/1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {

        this.token = null;
        
        this.isAuthenticated = false;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.authStatusListener.next(false);
        this.userId = null;
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {

        console.log('Setting timer: ' + duration);
        
        this.tokenTimer = setTimeout(() => {

            this.logout();
        }, duration*1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const expirationDate = localStorage.getItem('expiration');

        if(!token || !expirationDate) {

            return null;
        }
        return {

            token: token,
            userId: userId,
            expirationDate: new Date(expirationDate)
        }
    }
}