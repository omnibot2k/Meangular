import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private _navigationChangeSub;

  constructor(
    private _router: Router,
    private _slimLoadingBarService: SlimLoadingBarService
  ) {}

  ngOnInit() {
    this._setupSlimLoadingBar();
  }

  ngOnDestroy() {
    this._navigationChangeSub.unsubscribe();
  }

  private _setupSlimLoadingBar(): void {
    this._navigationChangeSub = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this._slimLoadingBarService.start();
      } else if (event instanceof NavigationEnd
        || event instanceof NavigationError
        || event instanceof NavigationCancel) {
        this._slimLoadingBarService.complete();
      }
    }, err => this._slimLoadingBarService.complete());
  }
}
