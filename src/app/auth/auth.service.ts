import {AuthData} from './models/auth-data.modele';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../share/ui.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor (private router: Router,
               private afAuth: AngularFireAuth,
               private trainingService: TrainingService,
               private uiService: UiService,
               ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscription();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    })
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(ressult => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch(err => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(err.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
   this.afAuth
     .auth
     .signInWithEmailAndPassword(authData.email, authData.password)
     .then(ressult => {
       this.uiService.loadingStateChanged.next(false);
     })
     .catch(err => {
       this.uiService.loadingStateChanged.next(false);
       this.uiService.showSnackBar(err.message, null, 3000);
     });

  }
  logout () {
    this.afAuth.auth.signOut();
  }

  isAuth () {
    return this.isAuthenticated;
  }
}
