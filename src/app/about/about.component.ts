import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {noop, Observable} from 'rxjs';
import {response} from 'express';
import {createNewObservable} from '../common/util';
import {map} from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const http$ = createNewObservable('/api/courses');

    const courses$ = http$.pipe(
      map(res  => Object.values(res['payload']))
    );

    courses$.subscribe((courses: any) => {
      console.log(courses);
    }, noop, () => console.log('complete'));
  }

}
