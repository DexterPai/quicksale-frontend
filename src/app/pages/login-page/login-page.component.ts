import { Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { PATHS_AUTH_PAGES, PATH_MAINTENANCE_PAGES, PATH_MY_ACCOUNT_PAGES } from 'src/app/commons/config/path-pages';
import { ChannelHeaderService } from 'src/app/commons/services/local/channel-header.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UserApiService } from 'src/app/commons/services/api/user/user-api.service';
import { IDataUser } from 'src/app/commons/models/data-user';
import { IResponseLogin, IResponseLoginv2 } from 'src/app/commons/services/api/user/user-api-model.interface';
import { SessionStorageService } from 'src/app/commons/services/local/storage/storage.service';
import { EMAIL_WEB_STORAGE, KEYS_WEB_STORAGE } from 'src/app/commons/utils/enums';
import { LocalStorageService } from 'src/app/commons/services/local/storage/local-storage.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
	private _Router = inject(Router);
	private _channelHeaderService = inject(ChannelHeaderService);
	private _formBuilder = inject(FormBuilder);
	private _userApiService = inject(UserApiService);
	private _sessionStorageService = inject(SessionStorageService);
	private _localStorageService = inject(LocalStorageService);
	//constructor(private _Router: Router, private _channelHeaderService: ChannelHeaderService) {}

	title = 'INICIO DE SESIÓN';
	readonly pathRecovery = PATHS_AUTH_PAGES.recoverPasswordPage.withSlash;
	readonly pathRegister = PATHS_AUTH_PAGES.registerPage.withSlash;
	mensaje = '';

	ngOnInit(): void {
		console.log('Method not implemented.');
	}

	//VALIDACIONES
	formGroup = this._formBuilder.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required]
	});

	clickLogin(): void {
		if (this.formGroup.valid) {
			const { email, password } = this.formGroup.getRawValue();
			/*
			this._userApiService.login({ userName: email, password }).subscribe({
				next: (response) => {
					this._saveDataUserAndRedirect(response);
					console.log(response);
				},
				error: () => {
					//console.log('dasda');
					this.disabledButton = false;
				}
			});*/

			this._userApiService.loginv2({ email, password }).subscribe({
				next: (response) => {
					this._saveDataUserAndRedirectv2(response);
				},
				error: () => {
					//console.log('dasda');
					//this.disabledButton = false;
				}
			});
		}
		//OBTENER EL VALOR DE UN COMPONENTE
		//console.log(this.formGroup.controls.email.value);

		//VALIDACIONES SI ES VALIDO EL FORMULARIO
		//console.log(this.formGroup.invalid);
		//console.log(this.formGroup.pending);
		//console.log(this.formGroup.disabled);
	}

	private _saveDataUserAndRedirectv2(response: IResponseLoginv2): void {
		const dataUser: IDataUser = {
			idCustomer: response.id,
			token: 'token_test',
			fullName: response.name,
			isAdmin: response.roles == 'admin'
		};
		const { email, password } = this.formGroup.getRawValue();
		this._sessionStorageService.setItem(KEYS_WEB_STORAGE.DATA_USER, dataUser);
		this._localStorageService.setItem(EMAIL_WEB_STORAGE.EMAIL_USER, email);

		if (dataUser.fullName != '') {
			this._redirectUser(dataUser.isAdmin);
			const valueStorage = this._sessionStorageService.getItem<IDataUser>(KEYS_WEB_STORAGE.DATA_USER);
		} else {
			this.mensaje = response.mensaje;
		}
	}

	private _saveDataUserAndRedirect(response: IResponseLogin): void {
		const dataUser: IDataUser = {
			idCustomer: 0,
			token: response.token,
			fullName: response.fullName,
			isAdmin: response.roles[0] === 'Administrador'
		};
		const { email, password } = this.formGroup.getRawValue();
		this._sessionStorageService.setItem(KEYS_WEB_STORAGE.DATA_USER, dataUser);
		this._localStorageService.setItem(EMAIL_WEB_STORAGE.EMAIL_USER, email);
		this._redirectUser(dataUser.isAdmin);
		const valueStorage = this._sessionStorageService.getItem<IDataUser>(KEYS_WEB_STORAGE.DATA_USER);
		console.log(valueStorage);
	}

	private _redirectUser(isAdmin: boolean): void {
		const url = isAdmin ? PATH_MAINTENANCE_PAGES.withSlash : PATH_MY_ACCOUNT_PAGES.withSlash;
		this._Router.navigateByUrl(url);
		this._channelHeaderService.showUser(true);
	}
}
