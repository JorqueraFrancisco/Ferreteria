import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(public firebase: FirebaseService, private router:Router){}
  

  canActivate(){   

    return this.firebase.isAuth()
    .pipe(take(1))
    .pipe(map(authState => !!authState))
    .pipe(tap(auth => {
      if (!auth) {
        this.router.navigateByUrl('/login');
      }
    }));
  }

}


