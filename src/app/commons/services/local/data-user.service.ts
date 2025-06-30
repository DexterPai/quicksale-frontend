import { inject, Injectable } from '@angular/core';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { IDataEmail, IDataUser } from './../../models/data-user';
import { EMAIL_WEB_STORAGE, KEYS_WEB_STORAGE } from 'src/app/commons/utils/enums';
import { SessionStorageService } from './storage/storage.service';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class DataUserService {
	private _sessionStorageService = inject(SessionStorageService);
	private _localStorageService = inject(LocalStorageService);
	// constructor(private _sessionStorageService: SessionStorageService) {}

	getToken(): string | undefined {
		const tokenUser = this._sessionStorageService.getItem<IDataUser>(KEYS_WEB_STORAGE.DATA_USER);
		return tokenUser?.token;
	}

	getEmail(): string | undefined {
		const emailUser = this._localStorageService.getItem<IDataEmail>(EMAIL_WEB_STORAGE.EMAIL_USER);
		return emailUser?.toString();
	}

	getFullName(): string | null {
		const dataUser = this._sessionStorageService.getItem<IDataUser>(KEYS_WEB_STORAGE.DATA_USER);

		if (dataUser !== null) {
			return dataUser.fullName;
		}

		return null;
	}

	getIdCustomer(): number | null {
		const dataUser = this._sessionStorageService.getItem<IDataUser>(KEYS_WEB_STORAGE.DATA_USER);

		if (dataUser !== null) {
			return dataUser.idCustomer;
		}

		return null;
	}

	isAdmin(): boolean | null {
		const dataUser = this._sessionStorageService.getItem<IDataUser>(KEYS_WEB_STORAGE.DATA_USER);

		if (dataUser !== null) {
			return dataUser.isAdmin;
		}

		return null;
	}

	isExpiredToken(): boolean {
		try {
			const dataUser = this._sessionStorageService.getItem<IDataUser>(KEYS_WEB_STORAGE.DATA_USER);

			if (dataUser !== null) {
				//&& dataUser.token
				//const decoded = jwtDecode<JwtPayload>(dataUser.token);
				//const tokenExpired = Date.now() > decoded.exp! * 1000;

				return false;
			} else return true;
		} catch (error) {
			console.error(error);
			return true;
		}
	}

	existsStorage(): boolean {
		return this._sessionStorageService.getItem<IDataUser>(KEYS_WEB_STORAGE.DATA_USER) !== null;
	}
}
