import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {noop, Observable} from 'rxjs';
import {response} from 'express';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const http$ = new Observable(observer => {
      fetch('/api/courses').then(res => res.json()).then(body => {
        observer.next(body);
        observer.complete();
      }).catch(err => observer.error(err));
    });

    http$.subscribe((courses: any) => {
      console.log(courses);
    }, noop, () => console.log('complete'));
  }

}
