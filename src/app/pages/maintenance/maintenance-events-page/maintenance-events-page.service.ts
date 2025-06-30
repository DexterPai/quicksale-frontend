import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmBoxEvokeService, ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { concatMap, EMPTY, Observable, tap } from 'rxjs';
import { IResponsev2 } from '../../../commons/services/api/api-models-base.interface';
//import {
//	IRequestCreateUpdateConcert,
//	IResponseConcert
//} from '../../../commons/services/api/concerts/concert-api-model.interface';
//import { ConcertApiService } from '../../../commons/services/api/concerts/concert-api.service';
import { CRUD_METHOD, STATUS_CRUD } from '../../../commons/utils/enums';
import { EventApiService } from 'src/app/commons/services/api/event/event-api.service';
import {
	IRequestCreateUpdateEvent,
	IResponseEvent
} from 'src/app/commons/services/api/event/event-api-model.interface';
import { IHomeCategory } from 'src/app/commons/services/api/home/home-api.interface';

@Injectable()
export class MaintenanceEventsPageService {
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _toastEvokeService = inject(ToastEvokeService);
	//private _concertApiService = inject(ConcertApiService);
	private _datePipe = inject(DatePipe);
	private _formBuilder = inject(FormBuilder);
	private _eventApiService = inject(EventApiService);

	formGroup = this._getFormGroup();

	deleteEvent(idEvent: number): Observable<boolean> {
		console.log(idEvent);
		return this._confirmBoxEvokeService.warning('Genero', '¿Esta seguro de eliminar el Evento?', 'Si', 'Cancelar').pipe(
			concatMap((responseQuestion) => (responseQuestion.success ? this._eventApiService.deleteEvent(idEvent) : EMPTY)),
			concatMap((response) => {
				if (response.success) {
					this._toastEvokeService.success('Exito', 'El evento a sido eliminado');
					return this._succes(true);
				}
				return this._succes(false);
			})
		);
	}

	updateForm(idEvent: number): Observable<IResponsev2<IResponseEvent>> {
		//GGET
		return this._eventApiService.getEvent(idEvent).pipe(
			tap((response) => {
				console.log(response);
				if (response.success) {
					const eventResponse = response.object;

					this.idField.setValue(eventResponse.idEvent);
					this.titleField.setValue(eventResponse.title);
					this.descriptionField.setValue(eventResponse.description);
					this.dateField.setValue(new Date(eventResponse.dateEvent));
					//this.hourField.setValue(this._datePipe.transform(eventResponse.dateEvent, 'HH:mm')!);
					this.imageField.setValue(eventResponse.image);
					this.placeField.setValue(eventResponse.place);
					this.ticketsQuantityField.setValue(eventResponse.ticketsQuantity);
					this.priceField.setValue(eventResponse.unitPrice),
						this.genreField.setValue(eventResponse.category.idCategory),
						this.statusField.setValue(eventResponse.status ? STATUS_CRUD.ACTIVO : STATUS_CRUD.INACTIVO);
				}
			})
		);
	}

	getDataEvents(existingData: IResponseEvent[], responseEvents: IResponseEvent[]): IResponseEvent[] {
		if (existingData && existingData.length > 0) {
			/**
			 * Buscamos si los item de la respuesta existen en la data actual de la tabla, si existieran entonces nos quedamos con esos nuevos item para tener los datos actualizados
			 */
			let newArray = responseEvents.filter((eventResponse) => {
				return existingData.some((event) => event.idEvent === eventResponse.idEvent);
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
						return !responseEvents.some((eventResponse) => eventResponse.idEvent === event.idEvent);
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

	private _getRequest(method: CRUD_METHOD): IRequestCreateUpdateEvent {
		const requestCategory: IHomeCategory = <IHomeCategory>{
			idCategory: this.genreField.value
		};

		const request: IRequestCreateUpdateEvent = <IRequestCreateUpdateEvent>(<unknown>{
			title: this.titleField.value,
			description: this.descriptionField.value,
			dateEvent: this._datePipe.transform(this.dateField.value, 'yyyy-MM-dd'),
			image: this.imageField.value,
			place: this.placeField.value,
			ticketsQuantity: this.ticketsQuantityField.value,
			unitPrice: this.priceField.value,
			status: this.statusField.value ? 'ACtivo' : 'iNACTIVO',
			category: requestCategory
		});
		console.log(request);
		return request;
	}

	private _getMethod(method: CRUD_METHOD, request: IRequestCreateUpdateEvent): Observable<IResponsev2<IResponseEvent>> {
		const idEvent = this.idField.value as number;

		return method === CRUD_METHOD.SAVE
			? this._eventApiService.createEvent(request)
			: this._eventApiService.updateEvent(idEvent, request);
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
			title: ['', Validators.required],
			description: ['', Validators.required],
			date: [new Date(), Validators.required],
			//hour: ['', Validators.required],
			ticketsQuantity: [0, Validators.required],
			price: [0, Validators.required],
			place: ['', Validators.required],
			status: [0, Validators.required],
			genre: this._formBuilder.control<number | null>(null),
			image: ['', Validators.required]
			//fileName: ['', Validators.required]
		});
	}

	get idField(): FormControl<number | null> {
		return this.formGroup.controls.id;
	}

	get titleField(): FormControl<string> {
		return this.formGroup.controls.title;
	}

	get descriptionField(): FormControl<string> {
		return this.formGroup.controls.description;
	}

	get dateField(): FormControl<Date> {
		return this.formGroup.controls.date;
	}

	/*
	get hourField(): FormControl<string> {
		return this.formGroup.controls.hour;
	}
	*/

	get ticketsQuantityField(): FormControl<number> {
		return this.formGroup.controls.ticketsQuantity;
	}

	get priceField(): FormControl<number> {
		return this.formGroup.controls.price;
	}

	get placeField(): FormControl<string> {
		return this.formGroup.controls.place;
	}

	get genreField(): FormControl<number | null> {
		return this.formGroup.controls.genre;
	}

	get statusField(): FormControl<number> {
		return this.formGroup.controls.status;
	}

	get imageField(): FormControl<string> {
		return this.formGroup.controls.image;
	}

	/*
	get fileNameField(): FormControl<string | null> {
		return this.formGroup.controls.fileName;
	}
	*/
	//#endregion

	/*ANTIGUOS*/

	/*
	deleteEvent(idEvent: number): Observable<boolean> {
		return this._confirmBoxEvokeService.warning('Evento', '¿Esta seguro de eliminar el Evento?', 'Si', 'Cancelar').pipe(
			concatMap((responseQuestion) =>
				responseQuestion.success ? this._eventApiService.deleteConcert(idEvent) : EMPTY
			),
			concatMap((response) => {
				if (response.success) {
					this._toastEvokeService.success('Exito', 'El evento a sido eliminado');
					return this._succes(true);
				}
				return this._succes(false);
			})
		);
	}

	endEvent(idEvent: number): void {
		this._eventApiService.finalizeConcert(idEvent).subscribe((response) => {
			if (response.success) {
				this._toastEvokeService.success('Exito', 'El evento a sido finalizado');
			}
		});
	}
	*/

	/*
	updateForm(idEvent: number): Observable<IResponse<IResponseConcert>> {
		return this._eventApiService.getConcert(idEvent).pipe(
			tap((response) => {
				if (response.success) {
					const eventResponse = response.data;

					this.idField.setValue(eventResponse.id);
					this.titleField.setValue(eventResponse.title);
					this.descriptionField.setValue(eventResponse.description);
					this.dateField.setValue(new Date(eventResponse.dateEvent));
					this.hourField.setValue(this._datePipe.transform(eventResponse.dateEvent, 'HH:mm')!);
					this.placeField.setValue(eventResponse.place);
					this.ticketsQuantityField.setValue(eventResponse.ticketsQuantity);
					this.priceField.setValue(eventResponse.unitPrice),
						this.genreField.setValue(eventResponse.genreDtoResponse.id),
						this.statusField.setValue(eventResponse.status ? STATUS_CRUD.ACTIVO : STATUS_CRUD.INACTIVO);
					this.imageField.setValue(eventResponse.imageUrl);
				}
			})
		);
	}
	*/

	/*
	getDataEvents(existingData: IResponseConcert[], responseEvents: IResponseConcert[]): IResponseConcert[] {
		if (existingData && existingData.length > 0) {
			/**
			 * Buscamos si los item de la respuesta existen en la data actual de la tabla, si existieran entonces nos quedamos con esos nuevos item para tener los datos actualizados
			 
			let newArray = responseEvents.filter((eventResponse) => {
				return existingData.some((event) => event.id === eventResponse.id);
			});

			/**
			 * Si no existiera alguna coincidencias entonces los items de la respuesta son nuevos asi que lo agregamos a la data existente.
			 * Si existiera coincidencias entonces solo queda filtrar los item que son distintos entre ambas listas, una vez obtenido esa diferencia la concatenamos con los datos actualizados de los registros existentes 
			if (newArray.length === 0) {
				newArray = existingData.concat(responseEvents);
			} else {
				newArray = existingData
					.filter((event) => {
						return !responseEvents.some((eventResponse) => eventResponse.id === event.id);
					})
					.concat(newArray);
			}
			// si quisieran ordenar los eventos de manera decendente por id, podemos usar la función sort ==== newArray = newArray.sort((a, b) => b.id - a.id);
			return newArray;
		}

		return responseEvents;
	}
	*/

	/*
	private _getRequest(method: CRUD_METHOD): IRequestCreateUpdateConcert {
		const request: IRequestCreateUpdateConcert = <IRequestCreateUpdateConcert>{
			title: this.titleField.value,
			description: this.descriptionField.value,
			dateEvent: this._datePipe.transform(this.dateField.value, 'yyyy-MM-dd'),
			timeEvent: this.hourField.value,
			ticketsQuantity: this.ticketsQuantityField.value,
			unitPrice: this.priceField.value,
			idGenre: this.genreField.value,
			place: this.placeField.value
		};

		const existHttpMitocode = this.imageField.value.search('https://mitocode.blob.core.windows.net');

		if (method === CRUD_METHOD.SAVE || (method == CRUD_METHOD.UPDATE && existHttpMitocode === -1)) {
			const base64 = this.imageField.value.split(',')[1];
			request.base64Image = base64;
			request.fileName = this.fileNameField.value!;
		}

		return request;
	}

	private _getMethod(method: CRUD_METHOD, request: IRequestCreateUpdateConcert): Observable<IResponse<number>> {
		const idEvent = this.idField.value as number;

		return method === CRUD_METHOD.SAVE
			? this._eventApiService.createConcert(request)
			: this._eventApiService.updateConcert(idEvent, request);
	}
	*/
}
