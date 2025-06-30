import { inject } from '@angular/core';
import { ChannelHeaderService } from '../services/local/channel-header.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../services/local/storage/storage.service';
import { PATHS_AUTH_PAGES, PATH_MAINTENANCE_PAGES } from '../config/path-pages';
import { DataUserService } from '../services/local/data-user.service';

export const AUTH_GUARD = (): boolean => {
	return _validSession();
};

export const MAINTENANCE_GUARD = (): boolean => {
	const dataUserService = inject(DataUserService);
	const router = inject(Router);

	if (dataUserService.isAdmin() === false) {
		router.navigateByUrl(PATHS_AUTH_PAGES.loginPage.withSlash);
		return false;
	}
	return true;
};

export const BUY_GUARD = (): boolean => {
	const dataUserService = inject(DataUserService);
	const router = inject(Router);

	if (dataUserService.isAdmin() === true) {
		router.navigateByUrl(PATH_MAINTENANCE_PAGES.withSlash);
		return false;
	}
	return true;
};

const _validSession = (): boolean => {
	const _dataUserService = inject(DataUserService);
	const _channelHeaderService = inject(ChannelHeaderService);
	const _sessionStorageService = inject(SessionStorageService);
	const _router = inject(Router);

	if (_dataUserService.isExpiredToken()) {
		_channelHeaderService.showUser(false);
		_sessionStorageService.clear();
		_router.navigateByUrl(PATHS_AUTH_PAGES.loginPage.withSlash);
		return false;
	}

	return true;
};
