import {Observable} from 'rxjs';

export function createNewObservable(url: string) {
  return new Observable<any>(observer => {
    fetch(url).then(res => res.json()).then(body => {
      observer.next(body);
      observer.complete();
    }).catch(err => observer.error(err));
  });
}
