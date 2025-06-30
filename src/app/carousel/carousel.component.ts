import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
	selector: 'app-carousel',
	standalone: true,
	imports: [CommonModule, SlickCarouselModule],
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
	slides = [
		{ img: 'https://imagenes.passline.com/slider/slide-6828-5343.jpg' },
		{ img: 'https://imagenes.passline.com/slider/slide-6842-1586.jpg' },
		{ img: 'https://imagenes.passline.com/slider/slide-1011.jpg' },
		{ img: 'https://imagenes.passline.com/slider/slide-7062-1373.jpg' },
		{ img: 'https://imagenes.passline.com/slider/slide-7136-4728.jpg' },
		{ img: 'https://imagenes.passline.com/slider/slide-6801-2723.jpg' },
		{ img: 'https://imagenes.passline.com/slider/slide-7052-0292.jpg' }
	];

	slideConfig = {
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		infinite: true
	};
}
