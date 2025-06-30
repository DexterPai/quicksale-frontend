import { IResponseCustomer } from './../../commons/services/api/customer/customer-api-model.interface';
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { SharedFormBasicModule } from '../../commons/shared/shared-form-basic.module';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { customPasswordValidator } from 'src/app/commons/validators/forms.validator';
import { PATHS_AUTH_PAGES } from 'src/app/commons/config/path-pages';
import { UserApiService } from 'src/app/commons/services/api/user/user-api.service';
import { IRequestRegisterv2 } from 'src/app/commons/services/api/user/user-api-model.interface';
import { PasswordStateMatcher, crossPasswordMatchingValidatior } from './register-custom-validators';
import { ChannelHeaderService } from 'src/app/commons/services/local/channel-header.service';
import { ConfirmBoxEvokeService, ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { EMPTY, Observable, concatMap } from 'rxjs';
import { CRUD_METHOD } from 'src/app/commons/utils/enums';
import { IResponse } from 'src/app/commons/services/api/api-models-base.interface';
import { FormGroupDirective } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'app-register-page',
	templateUrl: './register-page.component.html',
	styleUrls: ['./register-page.component.scss'],
	imports: [RouterModule, MatSelectModule, SharedFormBasicModule]
})
export default class RegisterPageComponent implements OnInit {
	@ViewChild(FormGroupDirective) formRef!: FormGroupDirective;
	ngOnInit(): void {
		console.log('');
	}
	readonly pathLogin = PATHS_AUTH_PAGES.loginPage.withSlash;
	private _router = inject(Router);
	private _FormBuilder = inject(FormBuilder);
	private _userApiService = inject(UserApiService);
	private _Router = inject(Router);
	private _channelHeaderService = inject(ChannelHeaderService);
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _toastEvokeService = inject(ToastEvokeService);

	passwordStateMatcher = new PasswordStateMatcher();
	disabledButton = false;

	formGroup = this._FormBuilder.nonNullable.group(
		{
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			//typeDocument: ['1'],
			documentNumber: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, customPasswordValidator]],
			confirmPassword: ['', Validators.required],
			age: this._FormBuilder.control<number | null>(null)
		},
		{
			validators: crossPasswordMatchingValidatior
		}
	);

	saveCustomer(): Observable<boolean> {
		return this._confirmBoxEvokeService
			.warning('Usuario', '¿Esta seguro de guardar la información?', 'Si', 'Cancelar')
			.pipe(
				concatMap((responseQuestion) =>
					responseQuestion.success ? this._userApiService.registerv2(this._getRequest()) : EMPTY
				),
				concatMap((response) => {
					if (response.success) {
						this._toastEvokeService.success('Exito', 'La información ha sido guardada.');
						return this._succes(true);
					}

					return this._succes(false);
				})
			);
	}

	private _getRequest(): IRequestRegisterv2 {
		const request: IRequestRegisterv2 = <IRequestRegisterv2>{
			fullName: this.firtsField.value + ' ' + this.lastNameField.value,
			dni: this.documentNumberField.value,
			age: this.ageField.value,
			email: this.emailField.value,
			password: this.passwordField.value,
			status: 'Activo',
			roles: 'User'
		};

		return request;
	}

	private _succes(isSucces: boolean): Observable<boolean> {
		return new Observable<boolean>((subscriber) => {
			subscriber.next(isSucces);
			subscriber.complete();
		});
	}

	clickRegister(): void {
		if (this.formGroup.valid) {
			this.saveCustomer().subscribe((response) => {
				if (response) {
					this.formRef.resetForm();
					this._Router.navigateByUrl(this.pathLogin);
					this._channelHeaderService.showUser(false);
				}
			});
		}
	}

	get firtsField(): FormControl<string> {
		return this.formGroup.controls.firstName;
	}

	get lastNameField(): FormControl<string> {
		return this.formGroup.controls.lastName;
	}

	/*
	get typeDocumentField(): FormControl<string | null> {
		return this.formGroup.controls.typeDocument;
	}
	*/

	get documentNumberField(): FormControl<string> {
		return this.formGroup.controls.documentNumber;
	}

	get emailField(): FormControl<string> {
		return this.formGroup.controls.email;
	}

	get passwordField(): FormControl<string> {
		return this.formGroup.controls.password;
	}

	get confirmPasswordField(): FormControl<string> {
		return this.formGroup.controls.confirmPassword;
	}

	get ageField(): FormControl<number | null> {
		return this.formGroup.controls.age;
	}
}
