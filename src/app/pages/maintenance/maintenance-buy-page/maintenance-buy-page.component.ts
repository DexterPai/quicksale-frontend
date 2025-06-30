import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CardEventComponent } from '../../../commons/components/card-event/card-event.component';
import { SharedFormCompleteModule } from '../../../commons/shared/shared-form-complete.module';
import { DatePipe } from '@angular/common';
import { SaleApiService } from 'src/app/commons/services/api/sale/sale-api.service';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { IResponseSalev2 } from 'src/app/commons/services/api/sale/sale-api-model.interface';
import { MaintenanceBuyPageService } from './maintenance-buy-page.service';
import { IResponsev2 } from 'src/app/commons/services/api/api-models-base.interface';
import { Observable } from 'rxjs';

@Component({
	standalone: true,
	selector: 'app-maintenance-buy-page',
	templateUrl: './maintenance-buy-page.component.html',
	styleUrls: ['./maintenance-buy-page.component.scss'],
	imports: [RouterModule, SharedFormCompleteModule, CardEventComponent, MatPaginatorModule, MatTableModule],
	providers: [DatePipe, MaintenanceBuyPageService]
})
export default class MaintenanceBuyPageComponent implements OnInit, AfterViewInit {
	private _saleApiService = inject(SaleApiService);
	private _datePipe = inject(DatePipe);
	private _formBuilder = inject(FormBuilder);
	private _maintenanceSalePageService = inject(MaintenanceBuyPageService);

	@ViewChild('paginator') paginator: MatPaginator | undefined;
	//@ViewChild(FormGroupDirective) formRef!: FormGroupDirective;

	displayedColumns: string[] = ['operationNumber', 'saleDate', 'total', 'quantity', 'status'];
	dataSource = new MatTableDataSource<IResponseSalev2>();

	listSale: IResponseSalev2[] = [];
	pageSizeOptions: number[] = [5, 10, 20];
	private _numberPageBack = 1;

	formGroup = this._formBuilder.nonNullable.group({
		dateIni: [''],
		dateFin: ['']
	});

	applyFilter(): void {
		this.dataSource.data = this.listSale;
		this._loadBuys();
	}

	ngOnInit(): void {
		this._loadBuys();
	}

	ngAfterViewInit(): void {
		this._loadBuys();
		this.dataSource.paginator = this.paginator!;
	}

	private _loadBuys(): void {
		const { dateIni, dateFin } = this.formGroup.getRawValue();
		let filter = true;

		if (dateIni != '' && dateFin != '') filter = false;

		this._getMethod(filter).subscribe((response) => {
			if (response.success) {
				if (response.object.length > 0) {
					this.dataSource.data = this._maintenanceSalePageService.getDataEvents(
						[...this.dataSource.data],
						response.object
					);
				} else {
					this._numberPageBack--;
				}
			}
		});
	}

	getPaginatorData(): void {
		if (!this.paginator?.hasNextPage()) {
			this._numberPageBack++;
			this._loadBuys();
		}
	}

	clearFilters(): void {
		this.formGroup.setValue({
			dateFin: '',
			dateIni: ''
		});
	}

	private _getMethod(filter: boolean): Observable<IResponsev2<IResponseSalev2[]>> {
		const { dateIni, dateFin } = this.formGroup.getRawValue();
		return filter
			? this._saleApiService.getListSalesv2()
			: this._saleApiService.getListSalesv2_Date(
					this._datePipe.transform(dateIni, 'yyyy-MM-dd')!,
					this._datePipe.transform(dateFin, 'yyyy-MM-dd')!
			  );
	}
}
