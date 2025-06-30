import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SaleApiService } from 'src/app/commons/services/api/sale/sale-api.service';
import { IResponseListSales, IResponseSalev2 } from 'src/app/commons/services/api/sale/sale-api-model.interface';

@Injectable()
export class AccountBuyPageService {
	private _saleApiService = inject(SaleApiService);
	private _formBuilder = inject(FormBuilder);

	formGroup = this._getFormGroup();

	getDataEvents(existingData: IResponseSalev2[], responseEvents: IResponseSalev2[]): IResponseSalev2[] {
		if (existingData && existingData.length > 0) {
			let newArray = responseEvents.filter((eventResponse) => {
				return existingData.some((event) => event.idSale === eventResponse.idSale);
			});

			if (newArray.length === 0) {
				newArray = existingData.concat(responseEvents);
			} else {
				newArray = existingData
					.filter((event) => {
						return !responseEvents.some((eventResponse) => eventResponse.idSale === event.idSale);
					})
					.concat(newArray);
			}
			return newArray;
		}
		console.log(responseEvents);
		return responseEvents;
	}

	/**
	 * En esta función vamos a retornar el evento que deseamos guardar o modificar; en el caso de las imagenes puede que al momento de seleccionar el evento para poder modificarlo solo modifiquen atributos de texto o número por lo tanto el valor de la imagen es solo una URL asi que no se debería de enviar, recuerden que el API necesita un base64 para crear una imagen.
	 * @param method
	 * @returns
	 */

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
			dateEvent: ['', Validators.required],
			genre: ['', Validators.required],
			imageUrl: ['', Validators.required],
			title: ['', Validators.required],
			operationNumber: ['', Validators.required],
			fullName: ['', Validators.required],
			quantity: [0, Validators.required],
			saleDate: ['', Validators.required],
			total: [0, Validators.required]
		});
	}

	get idField(): FormControl<number | null> {
		return this.formGroup.controls.id;
	}

	get dateEventField(): FormControl<string> {
		return this.formGroup.controls.dateEvent;
	}

	get imageUrlField(): FormControl<string> {
		return this.formGroup.controls.imageUrl;
	}

	get titleField(): FormControl<string> {
		return this.formGroup.controls.title;
	}

	get operationNumberField(): FormControl<string> {
		return this.formGroup.controls.operationNumber;
	}

	get fullNameField(): FormControl<string> {
		return this.formGroup.controls.fullName;
	}

	get quantityField(): FormControl<number | null> {
		return this.formGroup.controls.quantity;
	}

	get saleDateField(): FormControl<string> {
		return this.formGroup.controls.saleDate;
	}

	get totalField(): FormControl<number | null> {
		return this.formGroup.controls.total;
	}
	//#endregion
}
