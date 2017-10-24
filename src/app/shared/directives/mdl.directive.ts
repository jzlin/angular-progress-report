import { Directive, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Rx';

@Directive({
  selector: '[appMdl]'
})
export class MdlDirective implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    Observable.of(0, Scheduler.animationFrame)
      .take(1)
      .subscribe(() => {
        if (window && 'componentHandler' in window) {
          window['componentHandler'].upgradeDom();
        }
      });
  }

}
