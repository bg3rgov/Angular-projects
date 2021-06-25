import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthResponceData } from './auth.service';

import {AlertComponent} from '../shared/alert/alert.component'
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{

  constructor(
    private authService: AuthService, 
    private router: Router,
    private componentFactortResolver: ComponentFactoryResolver,

  ) {}

  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private closeSub: Subscription;

  onSwitchMode() {

    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {

    if(!form.valid){
      return;
    }

    console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponceData>;

    this.isLoading = true;
    if(this.isLoginMode) {
      
      authObs = this.authService.login(email, password);
    } else {

      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(resData => {

      console.log(resData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {

      this.error = errorMessage;
      this.showErrorAlert(errorMessage);
      this.isLoading = false;
    });

    form.reset();
  }

  onHandleError() {

    this.error = null;
  }

  private showErrorAlert(message: string) {

    const alertCmpFactory = this.componentFactortResolver.resolveComponentFactory(AlertComponent);
    
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {

      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {

    if(this.closeSub) {

      this.closeSub.unsubscribe();
    }
  }
}