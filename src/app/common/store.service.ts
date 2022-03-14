import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Course} from '../model/course';
import {createHttpObservable} from './util';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class Store {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  getCourses() {
    const http$ = createHttpObservable('/api/courses');

    http$.pipe(
      map(res => Object.values(res['payload']))
    ).subscribe((res: Course[]) => this.subject.next(res));
  }

  changeCategory(category: string) {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category === category))
    );
  }
}
