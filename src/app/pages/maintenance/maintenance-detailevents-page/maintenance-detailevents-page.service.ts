import {
	IRequestCreateUpdateDetailsEvent,
	IResponseDetailsEvent
} from './../../../commons/services/api/details-event/detailsevent-api-model.interface';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmBoxEvokeService, ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { concatMap, EMPTY, Observable, tap } from 'rxjs';
import { IResponsev2 } from '../../../commons/services/api/api-models-base.interface';
import { CRUD_METHOD, STATUS_CRUD } from '../../../commons/utils/enums';
import { IResponseEvent } from 'src/app/commons/services/api/event/event-api-model.interface';
import { DetailsEventApiService } from 'src/app/commons/services/api/details-event/detailsevent-api.service';

@Injectable()
export class MaintenanceDetaileventsPageService {
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _toastEvokeService = inject(ToastEvokeService);
	private _formBuilder = inject(FormBuilder);
	private _detailsEventApiService = inject(DetailsEventApiService);

	formGroup = this._getFormGroup();

	deleteEvent(idDetailsEvent: number): Observable<boolean> {
		return this._confirmBoxEvokeService
			.warning('Detalle Evento', '¿Esta seguro de eliminar el detalle evento?', 'Si', 'Cancelar')
			.pipe(
				concatMap((responseQuestion) =>
					responseQuestion.success ? this._detailsEventApiService.deleteDetailsEvent(idDetailsEvent) : EMPTY
				),
				concatMap((response) => {
					if (response.success) {
						this._toastEvokeService.success('Exito', 'El detalle evento a sido eliminado');
						return this._succes(true);
					}
					return this._succes(false);
				})
			);
	}

	updateForm(idEvent: number): Observable<IResponsev2<IResponseDetailsEvent>> {
		//GGET
		return this._detailsEventApiService.getDetailsEvent(idEvent).pipe(
			tap((response) => {
				if (response.success) {
					const detailseventResponse = response.object;
					this.idField.setValue(detailseventResponse.idDetailsEvents);
					this.titleField.setValue(detailseventResponse.title);
					this.descriptionField.setValue(detailseventResponse.description);
					this.commentsField.setValue(detailseventResponse.comments);
					this.urlImageRefField.setValue(detailseventResponse.urlImageRef);
					this.eventField.setValue(detailseventResponse.event.idEvent);
					this.statusField.setValue(detailseventResponse.status ? STATUS_CRUD.ACTIVO : STATUS_CRUD.INACTIVO);
				}
			})
		);
	}

	getDataDetailsEvents(
		existingData: IResponseDetailsEvent[],
		responseEvents: IResponseDetailsEvent[]
	): IResponseDetailsEvent[] {
		if (existingData && existingData.length > 0) {
			/**
			 * Buscamos si los item de la respuesta existen en la data actual de la tabla, si existieran entonces nos quedamos con esos nuevos item para tener los datos actualizados
			 */
			let newArray = responseEvents.filter((eventResponse) => {
				return existingData.some((event) => event.idDetailsEvents === eventResponse.idDetailsEvents);
			});

			/**
			 * Si no existiera alguna coincidencias entonces los items de la respuesta son nuevos asi que lo agregamos a la data existente.
			 *
			 * Si existiera coincidencias entonces solo queda filtrar los item que son distintos entre ambas listas, una vez obtenido esa diferencia la concatenamos con los datos actualizados de los registros existentes
			 */
			if (newArray.length === 0) {
				newArray = existingData.concat(responseEvents);
			} else {
				newArray = existingData
					.filter((event) => {
						return !responseEvents.some((eventResponse) => eventResponse.idDetailsEvents === event.idDetailsEvents);
					})
					.concat(newArray);
			}
			// si quisieran ordenar los eventos de manera decendente por id, podemos usar la función sort
			// newArray = newArray.sort((a, b) => b.id - a.id);
			return newArray;
		}

		return responseEvents;
	}

	saveEvent(method: CRUD_METHOD): Observable<boolean> {
		return this._confirmBoxEvokeService
			.warning('Detalle Evento', '¿Esta seguro de guardar la información?', 'Si', 'Cancelar')
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

	private _getRequest(method: CRUD_METHOD): IRequestCreateUpdateDetailsEvent {
		let id = 0;

		if (this.eventField.value != null) id = this.eventField.value;

		const requestEvent: IResponseEvent = <IResponseEvent>{
			idEvent: id
		};

		const request: IRequestCreateUpdateDetailsEvent = <IRequestCreateUpdateDetailsEvent>(<unknown>{
			title: this.titleField.value,
			description: this.descriptionField.value,
			comments: this.commentsField.value,
			urlImageRef: this.urlImageRefField.value,
			status: this.statusField.value ? 'Activo' : 'Inactivo',
			event: requestEvent
		});

		return request;
	}

	private _getMethod(
		method: CRUD_METHOD,
		request: IRequestCreateUpdateDetailsEvent
	): Observable<IResponsev2<IResponseDetailsEvent>> {
		const idEvent = this.idField.value as number;
		return method === CRUD_METHOD.SAVE
			? this._detailsEventApiService.createDetailsEvent(request)
			: this._detailsEventApiService.updateDetailsEvent(idEvent, request);
	}

	private _succes(isSucces: boolean): Observable<boolean> {
		return new Observable<boolean>((subscriber) => {
			subscriber.next(isSucces);
			subscriber.complete();
		});
	}

	private _getFormGroup() {
		return this._formBuilder.nonNullable.group({
			idDetailsEvents: [0, Validators.required],
			description: ['', Validators.required],
			title: ['', Validators.required],
			comments: ['', Validators.required],
			urlImageRef: ['', Validators.required],
			event: this._formBuilder.control<number | null>(null),
			status: [0, Validators.required]
			//fileName: ['', Validators.required]
		});
	}

	get idField(): FormControl<number | null> {
		return this.formGroup.controls.idDetailsEvents;
	}

	get titleField(): FormControl<string> {
		return this.formGroup.controls.title;
	}

	get descriptionField(): FormControl<string> {
		return this.formGroup.controls.description;
	}

	get commentsField(): FormControl<string> {
		return this.formGroup.controls.comments;
	}

	get statusField(): FormControl<number> {
		return this.formGroup.controls.status;
	}

	get urlImageRefField(): FormControl<string> {
		return this.formGroup.controls.urlImageRef;
	}

	get eventField(): FormControl<number | null> {
		return this.formGroup.controls.event;
	}
}
