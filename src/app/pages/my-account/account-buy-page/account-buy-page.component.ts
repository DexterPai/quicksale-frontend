import { Component, ViewChild, inject, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedFormCompleteModule } from '../../../commons/shared/shared-form-complete.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormGroupDirective } from '@angular/forms';
import { IResponseListSales, IResponseSalev2 } from 'src/app/commons/services/api/sale/sale-api-model.interface';
import { AccountBuyPageService } from './account-buy-page.service';
import { SaleApiService } from 'src/app/commons/services/api/sale/sale-api.service';
import { DataUserService } from 'src/app/commons/services/local/data-user.service';
import { CustomerApiService } from 'src/app/commons/services/api/customer/customer-api.service';

@Component({
	standalone: true,
	selector: 'app-account-buy-page',
	templateUrl: './account-buy-page.component.html',
	styleUrls: ['./account-buy-page.component.scss'],
	imports: [RouterModule, MatTableModule, MatMenuModule, MatPaginatorModule, SharedFormCompleteModule],
	providers: [AccountBuyPageService]
})
export class AccountBuyPageComponent implements OnInit, AfterViewInit {
	ngOnInit(): void {
		this._loadSales();
	}
	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator!;
	}

	@ViewChild('paginator') paginator: MatPaginator | undefined;
	listSales: IResponseSalev2[] = [];

	displayedColumns: string[] = ['operationNumber', 'title', 'quantity', 'total', 'saleDate', 'dateEvent', 'imageUrl'];
	dataSource = new MatTableDataSource<IResponseSalev2>();
	pageSizeOptions: number[] = [3, 5, 7];

	private _rowsPageBack = 4;
	private _numberPageBack = 1;
	private _filterPageBack = '';

	private _accountBuyPageService = inject(AccountBuyPageService);
	private _saleApiService = inject(SaleApiService);
	private _dataUserService = inject(DataUserService);
	private _customerApiService = inject(CustomerApiService);

	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	getPaginatorData(): void {
		if (!this.paginator?.hasNextPage()) {
			this._numberPageBack++;
			this._loadSales();
		}
	}

	private _loadSales(): void {
		const idCustomer = this._dataUserService.getIdCustomer() as number;

		this._customerApiService.getCustomer(idCustomer).subscribe((responseCustomer) => {
			this._saleApiService.getListSalesv2_Email(responseCustomer.object.email).subscribe((response) => {
				if (response.success) {
					console.log(response.object);
					if (response.object.length > 0) {
						this.dataSource.data = this._accountBuyPageService.getDataEvents(
							[...this.dataSource.data],
							response.object
						);
					} else {
						this._numberPageBack--;
					}
				}
			});
		});
	}
}
