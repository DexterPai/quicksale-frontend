import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { IResponsev2 } from './../api-models-base.interface';
import { IRequestCreateUpdateEvent, IResponseEvent } from './event-api-model.interface';
import { ResponseHomev2 } from '../event/event-api.class';
import { IResponseHomev2 } from '../home/home-api.interface';

export const URL_EVENT = environment.host + '/event';

@Injectable({
	providedIn: 'root'
})
export class EventApiService {
	constructor(private _httpClient: HttpClient) {}

	createEventv1(request: IRequestCreateUpdateEvent): Observable<IResponsev2<IRequestCreateUpdateEvent>> {
		return this._httpClient.post<IResponsev2<IRequestCreateUpdateEvent>>(URL_EVENT, request);
	}

	getHome(): Observable<ResponseHomev2> {
		return this._httpClient.get<IResponseHomev2>(URL_EVENT).pipe(map((response) => new ResponseHomev2(response)));
	}

	getHomexCategory(idCategory: number): Observable<ResponseHomev2> {
		const url = `${URL_EVENT}/filter/${idCategory}`;

		return this._httpClient.get<IResponseHomev2>(url).pipe(map((response) => new ResponseHomev2(response)));
	}

	getEvents(): Observable<IResponsev2<IResponseEvent[]>> {
		return this._httpClient.get<IResponsev2<IResponseEvent[]>>(URL_EVENT);
	}

	//-----Nuevos----//
	createEvent(request: IRequestCreateUpdateEvent): Observable<IResponsev2<IResponseEvent>> {
		return this._httpClient.post<IResponsev2<IResponseEvent>>(URL_EVENT, request);
	}

	getEvent(id: number): Observable<IResponsev2<IResponseEvent>> {
		const url = `${URL_EVENT}/${id}`;
		return this._httpClient.get<IResponsev2<IResponseEvent>>(url);
	}

	updateEvent(id: number, request: Partial<IRequestCreateUpdateEvent>): Observable<IResponsev2<IResponseEvent>> {
		const url = `${URL_EVENT}`;
		request.idEvent = id;
		return this._httpClient.put<IResponsev2<IResponseEvent>>(url, request);
	}
	deleteEvent(id: number): Observable<IResponsev2<number>> {
		const url = `${URL_EVENT}/eliminar/${id}`;
		console.log(url);
		return this._httpClient.delete<IResponsev2<number>>(url);
	}
}
