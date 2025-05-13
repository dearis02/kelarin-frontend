import dayjs from 'dayjs';
import type { OrderGetByIDRes } from '../types/order';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import type { Content, ContentText, TDocumentDefinitions } from 'pdfmake/interfaces';
import { formatRupiah } from './format_rupiah';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjsTimezone from 'dayjs/plugin/timezone';
import { PaymentStatus } from '../types/payment';

dayjs.extend(dayjsTimezone);
dayjs.extend(advancedFormat);

export function generateInvoicePDF(data: OrderGetByIDRes, userName: string = '') {
	let statusTextColor = '#7F8C8D';
	let statusText = '';

	switch (data.payment?.status) {
		case PaymentStatus.PENDING:
			statusText = 'UNPAID';
			statusTextColor = '#F1C40F';
			break;
		case PaymentStatus.EXPIRED:
			statusText = 'EXPIRED';
			statusTextColor = '#7F8C8D';
			break;
		case PaymentStatus.PAID:
			statusText = 'PAID';
			statusTextColor = '#2ECC70';
			break;
		case PaymentStatus.FAILED || PaymentStatus.CANCELED:
			statusText = 'FAILED';
			statusTextColor = '#E74C3C';
			break;
	}

	const docDefPaymentLink: ContentText = {
		text: 'Click Here to Pay',
		link: data.payment?.payment_link ?? '',
		bold: true,
		color: '#0074c1',
		fontSize: 14,
		alignment: 'center',
		marginTop: 20
	};

	const content = [
		{
			image: 'kelarinLogo',
			marginTop: 10,
			marginBottom: 40,
			fit: [200, 200]
		},
		{
			columns: [
				{
					text: `REF#${data.payment?.reference}`,
					style: 'invoiceID'
				},
				{
					text: statusText,
					fontSize: 30,
					bold: true,
					color: statusTextColor,
					alignment: 'right'
				}
			]
		},

		{
			text: [
				{ text: 'Issued At: ', style: 'textBase' },
				{
					text: dayjs(data.payment?.created_at).format('DD MMMM YYYY HH:mm:ss z') + '\n',
					style: 'textBase',
					bold: true
				}
			],
			style: 'text-base',
			marginBottom: 5
		},
		{
			text: [
				{ text: 'Due Date: ', style: 'textBase' },
				{ text: dayjs(data.payment?.expired_at).format('DD MMMM YYYY HH:mm:ss z'), style: 'textBase', bold: true }
			],
			style: 'text-base'
		},

		// divider
		{ text: '', marginBottom: 50 },

		{
			text: [
				{
					text: 'Bill to Address: \n',
					bold: true
				},
				{
					text: `${userName} \n`
				},
				{
					text: data.offer.address.address + ', ' + data.offer.address.city + ', ' + data.offer.address.province
				}
			],
			style: 'textBase'
		},

		// divider
		{ text: '', marginBottom: 50 },

		{
			style: 'tableExample',
			color: '#444',
			table: {
				widths: ['*', 150],
				headerRows: 1,
				body: [
					[
						{
							text: 'Description',
							style: 'tableHeader',
							alignment: 'center',
							fillColor: '#eeeeee'
						},
						{
							text: 'Total',
							style: 'tableHeader',
							alignment: 'center',
							fillColor: '#eeeeee'
						}
					],
					[
						{
							text: `${data.offer.service_provider.name} - ${data.offer.service.name} - ${data.service_date} ${data.service_time}`
						},
						{
							text: formatRupiah(data.service_fee),
							alignment: 'center',
							style: 'textPrice'
						}
					],
					[
						{
							text: 'Sub Total',
							alignment: 'right',
							bold: true,
							color: 'black',
							fillColor: '#efefef'
						},
						{
							text: formatRupiah(data.service_fee),
							alignment: 'center',
							bold: true,
							color: 'black',
							fillColor: '#efefef'
						}
					],
					[
						{
							text: 'Platform Fee',
							alignment: 'right',
							bold: true,
							color: 'black',
							fillColor: '#efefef'
						},
						{
							text: formatRupiah(String(5000)),
							alignment: 'center',
							bold: true,
							color: 'black',
							fillColor: '#efefef'
						}
					],
					[
						{
							text: 'Total',
							alignment: 'right',
							bold: true,
							color: 'black',
							fillColor: '#efefef'
						},
						{
							text: formatRupiah(String(Number(data.service_fee) + 5000)),
							alignment: 'center',
							bold: true,
							color: 'black',
							fillColor: '#efefef'
						}
					]
				]
			}
		}
	] as Content[];

	if (data.payment?.status == PaymentStatus.PENDING) {
		content.push(docDefPaymentLink);
	}

	const docDefinition: TDocumentDefinitions = {
		info: {
			title: 'invoice-' + data.payment?.reference
		},
		displayTitle: true,
		footer: {
			text: 'Kelarin',
			color: '#2ECC70',
			alignment: 'left',
			bold: true,
			marginLeft: 40,
			fontSize: 16
		},
		content,
		styles: {
			header: {
				fontSize: 30,
				bold: true,
				margin: [0, 0, 0, 10]
			},
			subheader: {
				fontSize: 20,
				bold: true,
				margin: [0, 10, 0, 5]
			},
			tableExample: {
				margin: [0, 5, 0, 15]
			},
			tableHeader: {
				bold: true,
				fontSize: 13,
				color: 'black',
				background: ''
			},
			invoiceID: {
				bold: true,
				fontSize: 16,
				color: 'black'
			},
			textBase: {
				bold: false,
				fontSize: 14,
				color: 'black'
			},
			textPrice: {
				bold: true
			}
		},
		defaultStyle: {
			color: 'black'
		},
		images: {
			kelarinLogo: 'https://kelarin.s3.ap-southeast-3.amazonaws.com/images/public/Logo-Kelarin.png'
		}
	};

	const pdfDocGenerator = pdfMake.createPdf(docDefinition);
	pdfDocGenerator.open();
}
