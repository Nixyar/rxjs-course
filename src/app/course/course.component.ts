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
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createNewObservable} from '../common/util';


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

    this.lessons$ = createNewObservable(`/api/lessons?courseId=${this.courseId}&pageSize=${100}`).pipe(
      map(value => Object.values(value['payload']))
    );
  }

  ngAfterViewInit() {
    fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
      map(event => event.target.value),
      debounceTime(1500),
      distinctUntilChanged()
    ).subscribe();
  }


}
