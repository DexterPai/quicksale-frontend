import { IResponseEvent } from './../../commons/services/api/event/event-api-model.interface';
import { IResponseCustomer } from './../../commons/services/api/customer/customer-api-model.interface';
import { IResponsePayment } from './../../commons/services/api/payment/payment-api-model.interface';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CardEventComponent } from '../../commons/components/card-event/card-event.component';
import { SharedFormCompleteModule } from '../../commons/shared/shared-form-complete.module';
import { CustomCurrencyPipe } from 'src/app/commons/pipes/custom-currency.pipe';
import { ICardEvent } from 'src/app/commons/models/components.interface';
import { IResponseDetailsEvent } from 'src/app/commons/services/api/details-event/detailsevent-api-model.interface';
import { DetailsEventApiService } from 'src/app/commons/services/api/details-event/detailsevent-api.service';
import { ConfirmBoxEvokeService, ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { EMPTY, Observable, concatMap } from 'rxjs';
import { IResponsev2 } from 'src/app/commons/services/api/api-models-base.interface';
import { IRequestCreateSalev2, IResponseSalev2 } from 'src/app/commons/services/api/sale/sale-api-model.interface';
import { SaleApiService } from 'src/app/commons/services/api/sale/sale-api.service';
import { PaymentApiService } from 'src/app/commons/services/api/payment/payment-api.service';
import { DataUserService } from 'src/app/commons/services/local/data-user.service';
type StatusBuy = 'INFO' | 'BUY' | 'VOUCHER';

@Component({
	standalone: true,
	selector: 'app-buy-page',
	templateUrl: './buy-page.component.html',
	styleUrls: ['./buy-page.component.scss'],
	imports: [RouterModule, SharedFormCompleteModule, CardEventComponent, CustomCurrencyPipe]
})
export default class BuyPageComponent {
	listPayments: IResponsePayment[] = [];
	currentDate = new Date();
	statusBuy: StatusBuy = 'INFO';
	cardEvent?: ICardEvent;
	detailsEvent?: IResponseDetailsEvent;
	saleResponse?: IResponseSalev2;
	totalPrice = 0.0;
	totalPriceDinamic = 0.0;

	private _router = inject(Router);
	private _detailsEventApiService = inject(DetailsEventApiService);
	private _saleApiService = inject(SaleApiService);
	private _paymentApiService = inject(PaymentApiService);
	private _formBuilder = inject(FormBuilder);
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _toastEvokeService = inject(ToastEvokeService);
	private _dataUserService = inject(DataUserService);

	constructor() {
		this._captureData();
	}

	//VALIDACIONES
	formGroup = this._formBuilder.nonNullable.group({
		quantity: [1, Validators.required],
		dcbPayment: [Validators.required]
	});

	clickBuy(statusBuy: StatusBuy): void {
		this.statusBuy = statusBuy;
	}

	calculeTotal(event: Event): void {
		const text = (event.target as HTMLInputElement).value;
		const quantity: number = +(text == '' ? '1' : text);
		this.totalPriceDinamic = quantity * this.totalPrice;
	}

	private _captureData(): void {
		// capturamos los datos del evento seleccionado enviados por la opción "state"
		const navigation = this._router.getCurrentNavigation();
		//console.log(navigation?.extras?.state);

		if (navigation?.extras?.state && navigation.extras.state['event']) {
			this.cardEvent = navigation.extras.state['event'] as ICardEvent;
			this._detailsEventApiService.getDetailsEvent(this.cardEvent.idEvent).subscribe((response) => {
				this.detailsEvent = response.object;
				this.totalPrice = this.detailsEvent.event.unitPrice;
				this.totalPriceDinamic = this.detailsEvent.event.unitPrice;
			});
			this._paymentApiService.getPayments().subscribe((response) => {
				this.listPayments = response.object;
			});
		}

		if (!this.cardEvent) {
			void this._router.navigateByUrl('/');
		}
	}

	clickSave(): void {
		if (this.formGroup.valid) {
			this.saveEvent().subscribe((response) => {
				if (response) {
					console.log(response);
				}
			});
		}
	}

	saveEvent(): Observable<boolean> {
		return this._confirmBoxEvokeService
			.warning('Evento', '¿Esta seguro de guardar la información?', 'Si', 'Cancelar')
			.pipe(
				concatMap((responseQuestion) => (responseQuestion.success ? this._getMethod(this._getRequest()) : EMPTY)),
				concatMap((response) => {
					if (response.success) {
						this._saleApiService.getSalev2(response.object.idSale).subscribe((responseSale) => {
							this.saleResponse = responseSale.object;
						});
						this._toastEvokeService.success('Exito', 'La información ha sido guardada.');
						this.clickBuy('VOUCHER');
						return this._succes(true);
					}

					return this._succes(false);
				})
			);
	}

	private _getMethod(request: IRequestCreateSalev2): Observable<IResponsev2<IRequestCreateSalev2>> {
		return this._saleApiService.createSale(request);
	}

	private _succes(isSucces: boolean): Observable<boolean> {
		return new Observable<boolean>((subscriber) => {
			subscriber.next(isSucces);
			subscriber.complete();
		});
	}

	private _getRequest(): IRequestCreateSalev2 {
		const event: IResponseEvent = <IResponseEvent>{
			idEvent: this.cardEvent?.idEvent
		};
		const customer: IResponseCustomer = <IResponseCustomer>{
			idCustomer: this._dataUserService.getIdCustomer()
		};
		const payment: IResponsePayment = <IResponsePayment>(<unknown>{
			idPayment: this.formGroup.controls.dcbPayment.value
		});

		const request: IRequestCreateSalev2 = <IRequestCreateSalev2>{
			idSale: 0,
			saleDate: this.currentDate,
			operationNumber: '',
			quantity: this.formGroup.controls.quantity.value,
			total: this.totalPriceDinamic,
			event: event,
			customer: customer,
			payment: payment
		};
		return request;
	}
}
