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
  beginnerCourses: Course[];
  advancedCourses: Course[];

  constructor() {

  }

  ngOnInit() {
    const http$ = createNewObservable('/api/courses');

    const courses$ = http$.pipe(
      map(res => Object.values(res['payload']))
    );

    courses$.subscribe((courses: any) => {
      this.beginnerCourses = courses.filter(item => item.category === 'BEGINNER');
      this.advancedCourses = courses.filter(item => item.category === 'ADVANCED');
    }, noop, () => console.log('complete'));
  }

}
