import {Exercise} from './exercise.modele';
import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {UiService} from '../share/ui.service';

@Injectable({providedIn: 'root'})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availabaleExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private sbSub: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UiService) {}

  getAvailabaleExercises () {
   this.sbSub.push(this.db
      .collection('availabaleExercises')
      .snapshotChanges()
      .pipe(map(docArr => {
        return  docArr.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories']
          }
        })
      }))
      .subscribe((exercises: Exercise[]) => {
        this.availabaleExercises = exercises;
        this.exercisesChanged.next([...this.availabaleExercises]);
      }, error => {
        this.uiService.showSnackBar('Fetching Exercises falled, please try again latter', null, 3000);
      }));
  }
  startExercise(selectedId: string) {
    // this.db.doc('availabaleExercises/' + selectedId)
   this.runningExercise = this.availabaleExercises.find(ex => ex.id === selectedId);
   this.exerciseChanged.next({...this.runningExercise});
  }
  completeExercise() {
    this.addDataToDatabase
    ({...this.runningExercise, date: new Date(), state: 'completed'});
   this.runningExercise = null;
   this.exerciseChanged.next(null);
  }
  cancelExercise(progress: number) {
    this.addDataToDatabase(
      {
        ...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'}
        );
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
  getRunningExercise() {
    return {...this.runningExercise};
  }
  fetchCompletedOrCancelledExercises() {
  this.sbSub.push(this.db.collection('finishedExercises')
     .valueChanges()
     .subscribe((exercises: Exercise[]) => {
       this.finishedExercisesChanged.next(exercises);
     }));
  }
  cancelSubscription() {
    this.sbSub.forEach(sub => sub.unsubscribe());
  }
  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise)
  }
}
