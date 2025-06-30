import { Observable, concatMap, EMPTY } from 'rxjs';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UserApiService } from 'src/app/commons/services/api/user/user-api.service';
import { customPasswordValidator } from 'src/app/commons/validators/forms.validator';
import { ConfirmBoxEvokeService, ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { IRequestChangePassword } from './../../../commons/services/api/user/user-api-model.interface';
import { SharedFormCompleteModule } from 'src/app/commons/shared/shared-form-complete.module';
import { DataUserService } from 'src/app/commons/services/local/data-user.service';
import { CustomerApiService } from 'src/app/commons/services/api/customer/customer-api.service';

@Component({
	standalone: true,
	selector: 'app-account-change-password-page',
	templateUrl: './account-change-password-page.component.html',
	styleUrls: ['./account-change-password-page.component.scss'],
	imports: [RouterModule, SharedFormCompleteModule]
})
export class AccountChangePasswordPageComponent {
	@ViewChild(FormGroupDirective) formRef!: FormGroupDirective;
	private _email: string | undefined;
	private _token: string | undefined;

	private _formBuilder = inject(FormBuilder);
	private _userApiService = inject(UserApiService);

	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _toastEvokeService = inject(ToastEvokeService);
	private _customerApiService = inject(CustomerApiService);

	private _dataUser = inject(DataUserService);

	disabledButton = false;

	constructor() {
		this._captureData();
	}

	formGroup = this._formBuilder.nonNullable.group({
		oldPassword: ['', [Validators.required, customPasswordValidator]],
		newPassword: ['', [Validators.required, customPasswordValidator]]
	});

	clickRestore(): void {
		if (this.formGroup.valid) {
			const idCustomer = this._dataUser.getIdCustomer() as number;
			this._customerApiService.getCustomer(idCustomer).subscribe((responseCustomer) => {
				const request: IRequestChangePassword = {
					email: responseCustomer.object.email,
					currentPassword: responseCustomer.object.password,
					newPassword: this.newPasswordField.value
				};
				this._changePassword(request).subscribe((response) => {
					if (response) {
						this.formRef.resetForm();
					}
				});
			});
		}
	}

	private _changePassword(request: IRequestChangePassword): Observable<boolean> {
		return this._confirmBoxEvokeService
			.warning('Mi cuenta', '¿Esta seguro de cambiar tu contraseña?', 'Si', 'Cancelar')
			.pipe(
				concatMap((responseQuestion) =>
					responseQuestion.success ? this._customerApiService.changePassword(request) : EMPTY
				),
				concatMap((response) => {
					if (response.success) {
						this._toastEvokeService.success('Exito', 'Se cambio la contraseña correctamente');
						return this._succes(true);
					} else {
						this._toastEvokeService.danger('Error', response.mensaje);
						return this._succes(false);
					}
				})
			);
	}

	private _succes(isSucces: boolean): Observable<boolean> {
		return new Observable<boolean>((subscriber) => {
			subscriber.next(isSucces);
			subscriber.complete();
		});
	}

	private _captureData(): void {
		// capturamos los datos enviados por la opción "state"
		this._email = this._dataUser.getEmail();
		this._token = this._dataUser.getToken();
		console.log(`Token :${this._token}, Email : ${this._email}`);
		// en caso no existiera eltoken o el email enviaremos al usuario a la pagina de "Recuperar contraseña"
		if (!this._token || !this._email) {
			console.log('Token o email vacios');
		}
	}

	get oldPasswordField(): FormControl<string> {
		return this.formGroup.controls.oldPassword;
	}

	get newPasswordField(): FormControl<string> {
		return this.formGroup.controls.newPassword;
	}
}
