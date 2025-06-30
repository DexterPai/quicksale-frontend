import {
	IRequestCreateUpdateGenre,
	IResponseGenre
} from './../../../commons/services/api/genre/genre-api-model.interface';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmBoxEvokeService, ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { concatMap, EMPTY, Observable, tap } from 'rxjs';
import { IResponse } from '../../../commons/services/api/api-models-base.interface';
import { CRUD_METHOD, STATUS_CRUD } from '../../../commons/utils/enums';
import { GenreApiService } from 'src/app/commons/services/api/genre/genre-api.service';

@Injectable()
export class MaintenanceGenresPageService {
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _toastEvokeService = inject(ToastEvokeService);
	private _genreApiService = inject(GenreApiService);
	private _formBuilder = inject(FormBuilder);

	formGroup = this._getFormGroup();

	deleteEvent(idEvent: number): Observable<boolean> {
		return this._confirmBoxEvokeService.warning('Genero', '¿Esta seguro de eliminar el Genero?', 'Si', 'Cancelar').pipe(
			concatMap((responseQuestion) => (responseQuestion.success ? this._genreApiService.deleteGenre(idEvent) : EMPTY)),
			concatMap((response) => {
				if (response.success) {
					this._toastEvokeService.success('Exito', 'El evento a sido eliminado');
					return this._succes(true);
				}
				return this._succes(false);
			})
		);
	}

	updateForm(idEvent: number): Observable<IResponse<IResponseGenre>> {
		return this._genreApiService.getGenre(idEvent).pipe(
			tap((response) => {
				if (response.success) {
					const eventResponse = response.data;
					this.idField.setValue(eventResponse.id);
					this.nameField.setValue(eventResponse.name);
					this.statusField.setValue(eventResponse.status ? STATUS_CRUD.ACTIVO : STATUS_CRUD.INACTIVO);
				}
			})
		);
	}

	getDataEvents(existingData: IResponseGenre[], responseEvents: IResponseGenre[]): IResponseGenre[] {
		if (existingData && existingData.length > 0) {
			let newArray = responseEvents.filter((eventResponse) => {
				return existingData.some((event) => event.id === eventResponse.id);
			});

			if (newArray.length === 0) {
				newArray = existingData.concat(responseEvents);
			} else {
				newArray = existingData
					.filter((event) => {
						return !responseEvents.some((eventResponse) => eventResponse.id === event.id);
					})
					.concat(newArray);
			}
			return newArray;
		}
		console.log(responseEvents);
		return responseEvents;
	}

	saveEvent(method: CRUD_METHOD): Observable<boolean> {
		return this._confirmBoxEvokeService
			.warning('Evento', '¿Esta seguro de guardar la información?', 'Si', 'Cancelar')
			.pipe(
				concatMap((responseQuestion) =>
					responseQuestion.success ? this._getMethod(method, this._getRequest(method)) : EMPTY
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

	/**
	 * En esta función vamos a retornar el evento que deseamos guardar o modificar; en el caso de las imagenes puede que al momento de seleccionar el evento para poder modificarlo solo modifiquen atributos de texto o número por lo tanto el valor de la imagen es solo una URL asi que no se debería de enviar, recuerden que el API necesita un base64 para crear una imagen.
	 * @param method
	 * @returns
	 */
	private _getRequest(method: CRUD_METHOD): IRequestCreateUpdateGenre {
		const request: IRequestCreateUpdateGenre = <IRequestCreateUpdateGenre>{
			name: this.nameField.value,
			status: this.statusField.value ? true : false
		};
		console.log(request);
		return request;
	}

	private _getMethod(method: CRUD_METHOD, request: IRequestCreateUpdateGenre): Observable<IResponse<number>> {
		const idEvent = this.idField.value as number;

		return method === CRUD_METHOD.SAVE
			? this._genreApiService.createGenre(request)
			: this._genreApiService.updateGenre(idEvent, request);
	}

	private _succes(isSucces: boolean): Observable<boolean> {
		return new Observable<boolean>((subscriber) => {
			subscriber.next(isSucces);
			subscriber.complete();
		});
	}

	//#region  load Form and getters y setters

	private _getFormGroup() {
		return this._formBuilder.nonNullable.group({
			id: [0, Validators.required],
			name: ['', Validators.required],
			status: [0, Validators.required]
		});
	}

	get idField(): FormControl<number | null> {
		return this.formGroup.controls.id;
	}

	get nameField(): FormControl<string> {
		return this.formGroup.controls.name;
	}

	get statusField(): FormControl<number> {
		return this.formGroup.controls.status;
	}
	//#endregion
}
