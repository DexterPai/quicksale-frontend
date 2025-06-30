import { IResponseDetailsEvent } from './../../../commons/services/api/details-event/detailsevent-api-model.interface';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { ConfirmBoxEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { map, Observable } from 'rxjs';
import { SharedFormCompleteModule } from '../../../commons/shared/shared-form-complete.module';
import { CRUD_METHOD } from '../../../commons/utils/enums';
import { MaintenanceDetaileventsPageService } from './maintenance-detailevents-page.service';
import { EventApiService } from 'src/app/commons/services/api/event/event-api.service';
import { IResponseEvent } from 'src/app/commons/services/api/event/event-api-model.interface';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { DetailsEventApiService } from 'src/app/commons/services/api/details-event/detailsevent-api.service';

@Component({
	standalone: true,
	selector: 'app-maintenance-detailevents-page',
	templateUrl: './maintenance-detailevents-page.component.html',
	styleUrls: ['./maintenance-detailevents-page.component.scss'],
	imports: [RouterModule, MatTableModule, MatTabsModule, MatMenuModule, MatPaginatorModule, SharedFormCompleteModule],
	providers: [MaintenanceDetaileventsPageService, DatePipe]
})
export default class MaintenanceDetaileventsPageComponent implements OnInit, AfterViewInit {
	@ViewChild('paginator') paginator: MatPaginator | undefined;

	@ViewChild(FormGroupDirective) formRef!: FormGroupDirective;
	listEvents: IResponseEvent[] = [];
	listDetailEvents: IResponseDetailsEvent[] = [];

	//variable para el Tab
	indexTabSaveEvent = 0;

	// variables para la tabla
	displayedColumns: string[] = ['urlImageRef', 'title', 'description', 'comments', 'status', 'action'];

	dataSource = new MatTableDataSource<IResponseDetailsEvent>();
	pageSizeOptions: number[] = [2, 4, 6];
	private _rowsPageBack = 4;
	private _numberPageBack = 1;
	private _crudMethod = CRUD_METHOD.SAVE;

	private _maintenanceDetaileventsPageService = inject(MaintenanceDetaileventsPageService);
	private _detailsEventApiService = inject(DetailsEventApiService);
	private _eventApiService = inject(EventApiService);
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _storage = inject(Storage);

	idField = this._maintenanceDetaileventsPageService.idField;
	titleField = this._maintenanceDetaileventsPageService.titleField;
	descriptionField = this._maintenanceDetaileventsPageService.descriptionField;
	commentsField = this._maintenanceDetaileventsPageService.commentsField;
	urlImageRefField = this._maintenanceDetaileventsPageService.urlImageRefField;
	statusField = this._maintenanceDetaileventsPageService.statusField;
	eventField = this._maintenanceDetaileventsPageService.eventField;

	formGroup = this._maintenanceDetaileventsPageService.formGroup;

	canDeactivate(): Observable<boolean> | boolean {
		const values = this.formGroup.getRawValue();

		const isThereDataEntered = Object.values(values).find((item) => item);
		if (!isThereDataEntered) {
			return true;
		}

		return this._confirmBoxEvokeService
			.warning('Advertencia', 'Los datos ingresados se perderán, ¿Esta seguro que desea salir?', 'Si', 'Cancelar')
			.pipe(map((response) => response.success));
	}

	ngOnInit(): void {
		this._loadDetailEvents();
		this._loadEvents();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator!;
	}

	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	clickSave(): void {
		if (this.formGroup.valid) {
			this._maintenanceDetaileventsPageService.saveEvent(this._crudMethod).subscribe((response) => {
				if (response) {
					this.formRef.resetForm();
					this.dataSource.data = this.listDetailEvents;
					this._loadDetailEvents();
				}
			});
		}
	}

	clickClear(): void {
		this._crudMethod = CRUD_METHOD.SAVE;
		this.formRef.resetForm();
	}

	clickUpdate(idDetailsEvents: number): void {
		console.log(idDetailsEvents);
		this._maintenanceDetaileventsPageService.updateForm(idDetailsEvents).subscribe((response) => {
			if (response.success) {
				this.indexTabSaveEvent = 0;
				this._crudMethod = CRUD_METHOD.UPDATE;
			}
		});
	}

	clickDelete(idDetailsEvents: number): void {
		this._maintenanceDetaileventsPageService.deleteEvent(idDetailsEvents).subscribe((response) => {
			if (response) {
				this.dataSource.data = this.dataSource.data.filter((item) => item.idDetailsEvents !== idDetailsEvents);
			}
		});
	}

	onFileSelected(event: Event): void {
		const htmlInput: HTMLInputElement = event.target as HTMLInputElement;
		if (htmlInput && htmlInput.files && htmlInput.files.length > 0) {
			const reader = new FileReader();
			const file = htmlInput.files[0];
			reader.readAsDataURL(htmlInput.files[0]);
			reader.onload = () => {
				const resultImageFile = reader.result!.toString();

				this.urlImageRefField.setValue(resultImageFile);
				const imgRef = ref(this._storage, `images/${file.name}`);

				uploadBytes(imgRef, file)
					.then((response) => {
						getDownloadURL(imgRef)
							.then((response) => {
								this.urlImageRefField.setValue(response);
							})
							.catch((error) => {
								console.log(error);
							});
					})
					.catch((error) => {
						console.log(error);
					});
			};
		}
	}

	getPaginatorData(): void {
		if (!this.paginator?.hasNextPage()) {
			this._numberPageBack++;
			this._loadEvents();
		}
	}

	private _loadDetailEvents(): void {
		this._detailsEventApiService.getDetailsEvents().subscribe((response) => {
			if (response.success) {
				if (response.object.length > 0) {
					this.dataSource.data = this._maintenanceDetaileventsPageService.getDataDetailsEvents(
						[...this.dataSource.data],
						response.object
					);
				} else {
					this._numberPageBack--;
				}
			}
		});
	}

	private _loadEvents(): void {
		this._eventApiService.getEvents().subscribe((response) => {
			if (response && response.object) {
				this.listEvents = response.object;
			}
		});
	}
}
