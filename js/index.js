let excelData = null;

const getParsedData = async () => {
	const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs');

	fetch('/data.xlsx')
		.then((response) => response.blob())
		.then((blob) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				const data = event.target.result;
				const workbook = XLSX.read(data, { type: 'array' });
				// const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets['All Items'];
				const rows = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
				// process the rows here
				excelData = rows;
				const categories = new Set();
				rows.forEach((data) => {
					if (data.Categories) categories.add(data.Categories);
				});

				if (categories.values()) {
					let category = window.location.hash.substring(1);
					if (categories.has(category)) {
						window.location.href = `#${category}`;
					} else {
						const firstCategory = categories.values().next().value;
						window.location.href = `#${firstCategory}`;
					}
				}

				generateCategoryList(categories);
			};
			reader.readAsArrayBuffer(blob);
		});
};

function generateCategoryList(categories) {
	const categoryList = document.getElementById('category-container');

	categoryList.innerHTML = '';
	categories.forEach((category) => {
		const categoryDiv = document.createElement('div');

		categoryDiv.className = 'chips'; // set the class name

		let childATag = document.createElement('a');

		let currentCategory = window.location.hash.substring(1);

		if (currentCategory === category) {
			childATag.className = 'link-block button-link w-inline-block active';
			listCategoryItems(category);
		} else {
			childATag.className = 'link-block button-link w-inline-block';
		}

		childATag.setAttribute('href', `#${category}`);
		childATag.addEventListener('click', function (event) {
			var current = document.getElementsByClassName('active');

			// If there's no active class
			if (current.length > 0) {
				current[0].className = current[0].className.replace(' active', '');
			}

			childATag.className += ' active';
		});

		const aTagChildDiv = document.createElement('div');
		aTagChildDiv.innerText = category;
		childATag.appendChild(aTagChildDiv);

		categoryDiv.appendChild(childATag);

		categoryList.appendChild(categoryDiv);
	});
}

window.onhashchange = function () {
	let hashValue = window.location.hash.substring(1); // Get the value of the hash, excluding the "#" symbol

	listCategoryItems(hashValue);
};

function listCategoryItems(category) {
	const categoryInfoListContainer = document.getElementById('categoryInfoListContainer');

	categoryInfoListContainer.innerHTML = '';
	excelData.forEach((categoryItem) => {
		if (categoryItem.Categories === category) {
			const cardElement = document.createElement('div');
			cardElement.className = 'card';
			cardElement.innerHTML = `<div class="card-margin">
									<h3 class="h3">${categoryItem.Name} </h3>
									<p class="p">
										${categoryItem.Description}
									</p>
								</div>
								<div class="div-block">
									<a href=${categoryItem.Link} target="_blank" class="link-block button-link w-inline-block">
										<div class="text-block">Open</div>
										<img src="images/arrow-right-up-fill.svg" loading="lazy" alt="" class="arrow" />
									</a>
								</div>
								`;
			categoryInfoListContainer.appendChild(cardElement);
		}
	});
}
