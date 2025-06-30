import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataUserService } from '../services/local/data-user.service';
import { ChannelHeaderService } from '../services/local/channel-header.service';
import { SessionStorageService } from '../services/local/storage/storage.service';
import { PATHS_AUTH_PAGES } from '../config/path-pages';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	private _dataUserService = inject(DataUserService);
	private _channelHeaderService = inject(ChannelHeaderService);
	private _sessionStorageService = inject(SessionStorageService);
	private _router = inject(Router);

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this._validSession();
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this._validSession();
	}

	private _validSession(): boolean {
		const isExpiredToken = this._dataUserService.isExpiredToken();
		if (isExpiredToken) {
			this._channelHeaderService.showUser(false);
			this._sessionStorageService.clear();
			this._router.navigateByUrl(PATHS_AUTH_PAGES.loginPage.withSlash);
			return false;
		}
		return true;
	}
}
