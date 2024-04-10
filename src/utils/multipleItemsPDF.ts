import dayjs from 'dayjs';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

type Totals = {
    title: string;
    value: number;
};

type Dates = {
    initialDate: string;
    finalDate: string;
};
type PrintToFileType = {
    title: string;
    tableHeaders: string[];
    tableBody: string[];
    dates: Dates;
    totalTitle: string;
};

type PrintToFileTypeMultiple = {
    title: string;
    tableHeaders: string[];
    tableBody: string[][];
    dates: Dates;
    totalTitle: string;
};

const initialHTML = `

<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body>
  <div style="padding: 2rem;">
`;

const generateHTML = async ({
    title,
    tableHeaders,
    tableBody,
    dates,
    totalTitle,
}: PrintToFileType) => {
    const html = `
    <section style="height: 50vh;">
  <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
	<section style="flex: 1;">
		<p style=" font-family: Helvetica Neue; font-weight: bold;">
		Compra y venta de leche Colindres
		</p>
		<div style="line-height: 1px;">
			<p> <bold> Tel: </bold> 84964176 </p>
			<p> ${title} </p>
		</div>
	</section>
	<section style="flex: 1; display: flex; align-items: start; justify-content: center;">
		<img src="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/milch.png" alt="Logo" style="width: 80px; height: 80px;">
	</section>
    <section style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: start; line-height: 1px;">
    <div>
	<h3> Fechas </h3>
	<p> <b>Desde:</b> ${dayjs(dates.initialDate).format('DD/MM/YYYY')} </p>
	<p> <b>Hasta:</b> ${dayjs(dates.finalDate).format('DD/MM/YYYY')} </p>
    </div>
    </section>
  </div>
    <table style="margin-top: 2rem;">
    	<tr>
		${tableHeaders.map((header) => `<th>${header}</th>`).join('')}
	</tr>
	${tableBody
        .slice(0, -1)
        .map(
            (row) =>
                `<tr>${row.map((cell) => `<td style="white-space: nowrap;">${cell}</td>`).join('')}</tr>`,
        )
        .join('')}
    </table>
    <div style="display: flex; text-align: end;">
    	<p style="text-width: bold;">${totalTitle} : </p>
	<p style="margin-left: 2px;"> ${Number(
        tableBody[tableBody.length - 1],
    ).toLocaleString('es-NI', {
        style: 'currency',
        currency: 'NIO',
    })} </p>
    </div>
	</section>
`;

    return html;
};

const documentCSS = `
  </div>
  </body>
</html>
<style>
table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  text-align: center;
}

table td, table th {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

table tr:nth-child(even){background-color: #f2f2f2;}

table tr:hover {background-color: #ddd;}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #74B7FD;
  color: #000;
  text-align: center;
}
</style>
`;

const multipleItemsPrintToFile = async (data: PrintToFileTypeMultiple) => {
    let html = initialHTML;
    for (const item of data.tableBody) {
        const itemHtml = await generateHTML({
            title: data.title,
            tableHeaders: data.tableHeaders,
            tableBody: item,
            dates: data.dates,
            totalTitle: data.totalTitle,
        });
        html += itemHtml;
    }

    html += documentCSS;

    const { uri } = await Print.printToFileAsync({ html });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};

export default multipleItemsPrintToFile;
