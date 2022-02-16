import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, mergeMap, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, of} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createNewObservable} from '../common/util';
import {any} from 'codelyzer/util/function';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;
  courseId = this.route.snapshot.params['id'];

  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(private route: ActivatedRoute) {


  }

  ngOnInit() {
    this.course$ = createNewObservable(`/api/courses/${this.courseId}`);
  }

  ngAfterViewInit() {
    const initialLessons$ = this.loadLessons();

    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
      map(event => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => this.loadLessons(val)),
    );

    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createNewObservable(`/api/lessons?courseId=${this.courseId}&pageSize=${100}&filter=${search}`).pipe(
      map(value => Object.values(value['payload']))
    );
  }

}
