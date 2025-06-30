import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SharedFormBasicModule } from '../../commons/shared/shared-form-basic.module';

@Component({
	standalone: true,
	selector: 'app-questions-frequently-page',
	templateUrl: './questions-frequently-page.component.html',
	styleUrls: ['./questions-frequently-page.component.scss'],
	imports: [RouterModule, MatSelectModule, SharedFormBasicModule]
})
export default class QuestionsFrequentlyPageComponent {
	abrirPDF(): void {
		const pdfPath = 'assets/pdf/questionsFrequently.pdf';
		window.open(pdfPath, '_blank');
	}
}
