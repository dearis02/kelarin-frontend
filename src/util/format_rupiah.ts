export function formatRupiah(val: string) {
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0
	}).format(BigInt(val));
}
