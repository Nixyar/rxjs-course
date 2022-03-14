import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {debounceTime, distinctUntilChanged, map, mergeMap, startWith, switchMap, tap, throttleTime} from 'rxjs/operators';
import {forkJoin, fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createNewObservable} from '../common/util';
import {debug, RxJsLoggingLevel, setRxJsLoggingLevel} from '../debug';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$ = new Observable<Course[]>();
  lessons$ = new Observable<Lesson[]>();
  courseId = this.route.snapshot.params['id'];

  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.course$ = createNewObservable(`/api/courses/${this.courseId}`);
    this.lessons$ = this.loadLessons();

    forkJoin([this.course$, this.lessons$]).pipe(
      tap(([course, lessons]) => {
        console.log('course', course);
        console.log('lessons', lessons);
      })
    ).subscribe();

    setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);
  }

  ngAfterViewInit() {
    fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
      map(event => event.target.value),
      debounceTime(1000),
      mergeMap(search => this.lessons$ = this.loadLessons(search)),
      tap(console.log)
    ).subscribe();
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createNewObservable(`/api/lessons?courseId=${this.courseId}&pageSize=${100}&filter=${search}`).pipe(
      map(value => Object.values(value['payload']))
    );
  }

}
