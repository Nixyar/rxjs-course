import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {interval, noop, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
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
    const http$: Observable<any> = createNewObservable('/api/courses');

    const courses$: Observable<any> = http$.pipe(
      map(res => Object.values(res['payload'])),
      shareReplay(),
      catchError(err => of([{
        id: 3,
        description: 'RxJs In Practice Course',
        longDescription: 'Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples',
        iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
        courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
        category: 'BEGINNER',
        lessonsCount: 10,
        seqNo: 2,
        url: 'rxjs-course',
        price: 50
      }]))
    );

    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );
  }

}
