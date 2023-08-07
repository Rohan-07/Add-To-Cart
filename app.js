class CartItems {
	constructor(
		itemId,
		itemName,
		itemBundle = 1,
		itemOriginalPrice,
		itemDiscount,
		isPopular = false
	) {
		this.itemId = itemId;
		this.itemName = itemName;
		this.itemBundle = itemBundle;
		this.itemOriginalPrice = itemOriginalPrice;
		this.itemDiscount = itemDiscount;
		this.isPopular = isPopular;
	}

	getTotalAmount() {
		return this.itemBundle * this.itemOriginalPrice;
	}

	getTotalDiscountedAmount = () => {
		const totalAmount = this.getTotalAmount();
		return totalAmount - totalAmount * (this.itemDiscount / 100);
	};

	renderCustomOptions(bundleCounter) {
		return `
        <span class="label-count">#${bundleCounter}</span>
            <select name="" id="">
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
            <option value="xxl">XL</option>
            <option value="xxl">XXL</option>
            <option value="xxxl">XXXL</option>
        </select>
        <select name="" id="">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
        </select>`;
	}

	renderItem() {
		let bundleCounter = 1;
		let customiseOptions = "";

		while (bundleCounter <= this.itemBundle) {
			customiseOptions += this.renderCustomOptions(bundleCounter);
			bundleCounter++;
		}

		let itemContent = `
        <div id="item-${this.itemId}" class="item">
		<div class="info-group">
            <div class="item-content">
                <input type="radio" name="cart-item" />
                <div class="item-info">
                    <p class="medium-font">${this.itemName}</p>
                    <p
                        class="semi-bold-font"
                    >DKK ${this.getTotalDiscountedAmount().toFixed(2)}</p>
                </div>
            </div>
			${
				this.isPopular
					? '<s class="old-price"> DKK ' +
					  this.getTotalAmount().toFixed(2) +
					  "</s>"
					: ""
			}
            <p class="semi-bold-font ${this.isPopular ? "popular" : ""}">${
			this.itemDiscount
		}% OFF</p>
		</div>
                        <div class="customize">
                            <p></p>
							<p class="label-txt">Size</p>
							<p class="label-txt">Colour</p>
                            ${customiseOptions}
                        </div>
        </div>`;

		itemContent = itemContent.replace(/\n|\t/g, "");
		return itemContent;
	}
}

let items = [];
const tax = 15;
let totalAmount = tax + 0;
let itemContainer = document.getElementById("items-container");

// Customise items as per need.
items.push(new CartItems(1, "1 Pair", 1, 195.0, 50));
items.push(new CartItems(2, "2 Pair", 2, 195.0, 40, true));
items.push(new CartItems(3, "3 Pair", 3, 250.0, 60));

// Generating HTML based on the above configuration
items.forEach((item) => {
	itemContainer.innerHTML += item.renderItem();
	totalAmount = totalAmount + item.getTotalDiscountedAmount();
});

// By default only activating popularItem. If no popular item found make the first one as default
let popularItem = items.find((item) => item.isPopular);
if (popularItem) {
	activateItem(popularItem.itemId);
} else {
	activateItem(items[0].itemId);
}

// Function to add the "active" class to the clicked item and show customization options
function activateItem(itemId) {
	const itemElement = document.getElementById(`item-${itemId}`);
	itemElement.classList.add("active");

	// Activate the corresponding radio button
	const itemRadio = document.querySelector(
		`#item-${itemId} input[type="radio"]`
	);

	itemRadio.checked = true;

	// Show customization options
	const customizeDiv = document.querySelector(`#item-${itemId} .customize`);
	customizeDiv.style.display = "grid";

	// Show the updated amount
	let totalAmount = items
		.find((item) => item.itemId === itemId)
		.getTotalDiscountedAmount();

	document.getElementById("total-amount").innerText = `DKK ${(
		totalAmount + tax
	).toFixed(2)}`;

	// Deactivate other items and hide their customization options
	deactivateOtherItems(itemId);
}

// Function to remove the "active" class from all items except the clicked one and hide customization options
function deactivateOtherItems(itemId) {
	const items = document.querySelectorAll(".item");
	items.forEach((item) => {
		if (item.id !== `item-${itemId}`) {
			item.classList.remove("active");

			// Hide customization options for other items
			const customizeDiv = item.querySelector(".customize");
			customizeDiv.style.display = "none";
		}
	});
}

// Add event listeners to the radio buttons and item elements
items.forEach((item) => {
	const itemId = item.itemId;
	const itemRadio = document.querySelector(
		`#item-${itemId} input[type="radio"]`
	);
	const itemElement = document.getElementById(`item-${itemId}`);

	itemRadio.addEventListener("input", () => {
		activateItem(itemId);
	});

	itemElement.addEventListener("click", () => {
		activateItem(itemId);
	});
});
