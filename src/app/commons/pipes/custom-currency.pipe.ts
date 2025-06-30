import { formatCurrency, getLocaleCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	standalone: true,
	name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
	transform(value: number, digistInfo: string): unknown {
		const localeCurrencySymbol = getLocaleCurrencySymbol('es-PE');
		const valueReturn = formatCurrency(value, 'es-PE', localeCurrencySymbol!, 'PEN', digistInfo);
		return valueReturn;
	}
}
