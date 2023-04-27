const getParsedData = async () => {
	const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs');

	fetch('../data.xlsx')
		.then((response) => response.blob())
		.then((blob) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				const data = event.target.result;
				const workbook = XLSX.read(data, { type: 'array' });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets['All Items'];
				const rows = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
				// process the rows here
				console.log(workbook, rows);
				const categories = new Set();
				rows.forEach((data) => {
					if (data.Categories) categories.add(data.Categories);
				});
				console.log(categories);
			};
			reader.readAsArrayBuffer(blob);
		});
};
