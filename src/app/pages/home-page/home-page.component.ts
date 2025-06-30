/* eslint-disable prettier/prettier */
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CardEventComponent } from '../../commons/components/card-event/card-event.component';
import { CarouselComponent } from 'src/app/carousel/carousel.component';
import { SharedFormCompleteModule } from '../../commons/shared/shared-form-complete.module';
import { HomeApiService } from 'src/app/commons/services/api/home/home-api.service';
import { CategoryApiService } from 'src/app/commons/services/api/category/category-api.service';
import { EventApiService } from 'src/app/commons/services/api/event/event-api.service';
import { ICardEvent } from 'src/app/commons/models/components.interface';
import { IHomeGenres, IHomeCategory, IHomeEvent } from 'src/app/commons/services/api/home/home-api.interface';
import { PATHS_AUTH_PAGES, PATH_BUY_PAGES } from 'src/app/commons/config/path-pages';
import { Router } from '@angular/router';
import { DemoCorsService } from 'src/app/commons/services/api/demo-cors/demo-cors.service';
import { DataUserService } from 'src/app/commons/services/local/data-user.service';
import { FormBuilder } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss'],
	imports: [SharedFormCompleteModule, CardEventComponent, CarouselComponent]
})
export class HomePageComponent implements OnInit {
	@ViewChild('cardDummy') cardDummy?: CardEventComponent;

	//private _homeApiService = inject(HomeApiService);
	private _eventApiService = inject(EventApiService);
	private _categoryApiService = inject(CategoryApiService);
	private _router = inject(Router);
	private _formBuilder = inject(FormBuilder);
	private _dataUserService =  inject(DataUserService);
	//private _demoCorsService = inject(DemoCorsService);

	listConcerts: ICardEvent[] = [];
	listGenres: IHomeGenres[] = [];
	listCategory: IHomeCategory[] = [];
	listEvents: ICardEvent[] = [];
	data: any[] = [];

	formGroup = this._formBuilder.nonNullable.group({
		dcbCategory: [0]
	});

	cardEventDummy: ICardEvent = {
		date: '20/03/2023',
		description: 'xxxx',
		genre: 'ROCK',
		place: 'ccccc',
		hour: '22:00',
		idEvent: 1,
		price: 200,
		title: 'ESTO ES UN DEMO',
		urlImage: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
	};

	ngOnInit(): void {
		this._loadHome();
	}

	clickCard(event: ICardEvent): void {
		if (!this._dataUserService.isExpiredToken())
			this._router.navigate([PATH_BUY_PAGES.buyPage.withSlash], { state: { event } });
		else
			this._router.navigateByUrl(PATHS_AUTH_PAGES.loginPage.withSlash);
	}

	private _loadHome() {
		this._eventApiService.getHome().subscribe((response)=>{
			this.listEvents = response.getDataCardEvent();
		});

		this._categoryApiService.getCategorys().subscribe((response) => {
			this.listCategory = response.object;
			//console.log(this.listCategory);
		});
	}

	applyFilter(): void {
		const { dcbCategory } = this.formGroup.getRawValue();

		
		if(dcbCategory != 0)
		{
			this._eventApiService.getHomexCategory(dcbCategory).subscribe((response)=>{
				this.listEvents = response.getDataCardEvent();
			});
		}
		else{
			this._eventApiService.getHome().subscribe((response)=>{
				this.listEvents = response.getDataCardEvent();
			});
		}
	}
}
