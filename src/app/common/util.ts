import {Observable} from 'rxjs';

export function createHttpObservable(url: string) {
  return new Observable<any>(observer => {
    fetch(url).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return observer.error(res?.status);
      }
    }).then(body => {
      observer.next(body);
      observer.complete();
    }).catch(err => observer.error(err));
  });
}
