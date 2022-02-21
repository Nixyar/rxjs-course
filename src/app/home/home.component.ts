import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, finalize, map, retry, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createNewObservable} from '../common/util';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {

  }

  ngOnInit() {
    const http$: Observable<Course[]> = createNewObservable('/api/courses');

    const courses$: Observable<any> = http$.pipe(
      catchError(err => {
        console.log(err);
        return throwError(err);
      }),
      retryWhen(err => err.pipe(delayWhen(() => timer(1000)))),
      finalize(() => {
        console.log('HTTP Request finalize');
      }),
      tap(() => console.log('Http request executed')),
      map(res => Object.values(res['payload'])),
      shareReplay()
    );

    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );
  }

}
