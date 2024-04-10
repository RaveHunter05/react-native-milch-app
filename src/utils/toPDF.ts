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
    totals?: Totals[];
};

const printToFile = async ({
    title,
    tableHeaders,
    tableBody,
    dates,
    totals,
}: PrintToFileType) => {
    const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: left; padding: 2rem">
  <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
	<section style="flex: 1;">
		<h2 style=" font-family: Helvetica Neue; font-weight: bold;">
		Compra y venta de leche Colindres
		</h2>
		<h3> <bold> Tel: </bold> 84964176 </h3>
		<h3> ${title} </h3>
	</section>
	<section style="flex: 1; display: flex; align-items: center; justify-content: center;">
		<img src="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/milch.png" alt="Logo" style="width: 140px; height: 140px;">
	</section>
    <section style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: start;">
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
	${tableBody.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
    </table>

    ${
        totals?.length
            ? `
		<div>
		<h3> Totales </h3>
		<table>
			<tr>
				<th> Concepto </th>
				<th> Total </th>
			</tr>
			${totals
                .map(
                    (total) => `
				<tr>
					<td> ${total.title} </td>
					<td> ${total.value} </td>
				</tr>
			`,
                )
                .join('')}
	</div>
	    `
            : []
    }

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
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};

export default printToFile;
