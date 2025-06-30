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
//import { IResponseConcert } from '../../../commons/services/api/concerts/concert-api-model.interface';
//import { ConcertApiService } from '../../../commons/services/api/concerts/concert-api.service';
//import { IResponseGenre } from '../../../commons/services/api/genre/genre-api-model.interface';
//import { GenreApiService } from '../../../commons/services/api/genre/genre-api.service';
import { SharedFormCompleteModule } from '../../../commons/shared/shared-form-complete.module';
import { CRUD_METHOD } from '../../../commons/utils/enums';
import { MaintenanceEventsPageService } from './maintenance-events-page.service';
import { IResponseCategory } from 'src/app/commons/services/api/category/category-api-model.interface';
import { CategoryApiService } from 'src/app/commons/services/api/category/category-api.service';
import { EventApiService } from 'src/app/commons/services/api/event/event-api.service';
import { IResponseEvent } from 'src/app/commons/services/api/event/event-api-model.interface';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
	standalone: true,
	selector: 'app-maintenance-events-page',
	templateUrl: './maintenance-events-page.component.html',
	styleUrls: ['./maintenance-events-page.component.scss'],
	imports: [RouterModule, MatTableModule, MatTabsModule, MatMenuModule, MatPaginatorModule, SharedFormCompleteModule],
	providers: [MaintenanceEventsPageService, DatePipe]
})
export default class MaintenanceEventsPageComponent implements OnInit, AfterViewInit {
	@ViewChild('paginator') paginator: MatPaginator | undefined;

	@ViewChild(FormGroupDirective) formRef!: FormGroupDirective;

	listCategorys: IResponseCategory[] = [];

	//variable para el Tab
	indexTabSaveEvent = 0;

	// variables para la tabla
	displayedColumns: string[] = [
		'image',
		'title',
		'description',
		'dateEvent',
		'ticketsQuantity',
		'price',
		'genre',
		'status',
		'action'
	];

	dataSource = new MatTableDataSource<IResponseEvent>();
	pageSizeOptions: number[] = [2, 4, 6];
	private _rowsPageBack = 4;
	private _numberPageBack = 1;
	private _crudMethod = CRUD_METHOD.SAVE;

	private _categoryApiService = inject(CategoryApiService);
	private _maintenanceEventsPageService = inject(MaintenanceEventsPageService);
	private _eventApiService = inject(EventApiService);
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _storage = inject(Storage);

	//#region getters Form
	idField = this._maintenanceEventsPageService.idField;
	titleField = this._maintenanceEventsPageService.titleField;
	descriptionField = this._maintenanceEventsPageService.descriptionField;
	dateField = this._maintenanceEventsPageService.dateField;
	//hourField = this._maintenanceEventsPageService.hourField;
	ticketsQuantityField = this._maintenanceEventsPageService.ticketsQuantityField;
	priceField = this._maintenanceEventsPageService.priceField;
	placeField = this._maintenanceEventsPageService.placeField;
	genreField = this._maintenanceEventsPageService.genreField;
	statusField = this._maintenanceEventsPageService.statusField;
	imageField = this._maintenanceEventsPageService.imageField;
	//fileNameField = this._maintenanceEventsPageService.fileNameField;
	//#region

	// constructor(
	// 	private _genreApiService: GenreApiService,
	// 	private _maintenanceEventsPageService: MaintenanceEventsPageService,
	// 	private _eventApiService: ConcertApiService,
	// 	private _confirmBoxEvokeService: ConfirmBoxEvokeService
	// ) {}

	formGroup = this._maintenanceEventsPageService.formGroup;

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
		this._loadEvents();
		this._loadCategorys();
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
			this._maintenanceEventsPageService.saveEvent(this._crudMethod).subscribe((response) => {
				if (response) {
					this.formRef.resetForm();
					this._loadEvents();
				}
			});
		}
	}

	clickClear(): void {
		this._crudMethod = CRUD_METHOD.SAVE;
		this.formRef.resetForm();
	}

	clickUpdate(idEvent: number): void {
		this._maintenanceEventsPageService.updateForm(idEvent).subscribe((response) => {
			if (response.success) {
				this.indexTabSaveEvent = 0;
				this._crudMethod = CRUD_METHOD.UPDATE;
			}
		});
	}

	clickDelete(idEvent: number): void {
		this._maintenanceEventsPageService.deleteEvent(idEvent).subscribe((response) => {
			if (response) {
				this.dataSource.data = this.dataSource.data.filter((item) => item.idEvent !== idEvent);
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

				this.imageField.setValue(resultImageFile);
				const imgRef = ref(this._storage, `images/${file.name}`);

				uploadBytes(imgRef, file)
					.then((response) => {
						getDownloadURL(imgRef)
							.then((response) => {
								this.imageField.setValue(response);
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

	private _loadEvents(): void {
		this._eventApiService.getEvents().subscribe((response) => {
			if (response.success) {
				if (response.object.length > 0) {
					this.dataSource.data = this._maintenanceEventsPageService.getDataEvents(
						[...this.dataSource.data],
						response.object
					);
				} else {
					this._numberPageBack--;
				}
			}
		});
	}

	private _loadCategorys(): void {
		this._categoryApiService.getCategorys().subscribe((response) => {
			if (response && response.object) {
				this.listCategorys = response.object;
			}
		});
	}
}
