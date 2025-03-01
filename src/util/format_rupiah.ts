export function formatRupiah(val: string, withCurrencySymbol = true) {
	const formatted = Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		currencyDisplay: 'narrowSymbol'
	}).format(BigInt(val));

	if (withCurrencySymbol) {
		return formatted;
	} else {
		return formatted.replace('Rp', '');
	}
}

export function formatRupiahRange(val1: string | number, val2: string | number) {
	const formatted = Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		currencyDisplay: 'narrowSymbol'
	}).formatRange(BigInt(val1), BigInt(val2));

	return formatted.replace('-', ' - ');
}
