import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Course} from '../model/course';
import {createHttpObservable} from './util';
import {map, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

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

  findCourseForId(courseId: number) {
    return this.courses$.pipe(
      map(courses => courses
        .find(course => course.id === courseId))
    );
  }

  changeCategory(category: string) {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category === category))
    );
  }

  saveCourse(courseId: number, changesCourse) {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex((course) => course.id === +courseId);
    const newCoursesArr = courses.slice(0);
    newCoursesArr[courseIndex] = {
      ...courses[courseIndex],
      ...changesCourse
    };
    this.subject.next(newCoursesArr);
    return fromPromise(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changesCourse),
      headers: {'content-type': 'application/json'}
    }));
  }
}
