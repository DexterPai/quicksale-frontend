import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS_AUTH_PAGES, PATH_MY_ACCOUNT_PAGES } from './../../../../config/path-pages';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
	constructor(private _router: Router) {}

	clickLogout(): void {
		void this._router.navigateByUrl(PATHS_AUTH_PAGES.questionPage.withSlash);
	}
}
