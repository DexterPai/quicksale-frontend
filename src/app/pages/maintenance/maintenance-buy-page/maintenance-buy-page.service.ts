import { IResponseSalev2 } from 'src/app/commons/services/api/sale/sale-api-model.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MaintenanceBuyPageService {
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
}
