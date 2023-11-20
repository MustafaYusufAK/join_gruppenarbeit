function cancelNewCategory(selectTask) {
    document.getElementById('newCategoryInput').value = '';
    document.getElementById('newCategoryColor').style.backgroundColor = '';
    document.getElementById('newCategoryContainer').classList.add('d-none');
    document.getElementById('newCategoryColors').classList.add('d-none');
    document.getElementById('category').style.display = 'flex';
    if (selectTask == undefined) {
        document.getElementById('category').innerHTML = 'Select task category';
    } else {

    }
}

function confirmNewCategory() {
    let newCategory = document.getElementById('newCategoryInput').value;
    let newCategoryColor = document.getElementById('newCategoryColor').style.backgroundColor;
    let newCategoryInput = document.getElementById('newCategoryInput');

    if (newCategoryInput.value === '') {
        newCategoryInput.focus();
        showBoardCategoryNotification();
    } else if (newCategoryColor === '') {
        categoryColorNotification();
    } else {
        selectedCategory(newCategory, newCategoryColor);
        cancelNewCategory('taskCategorySelected')
    }
}


function openCategoryDropdown() {
    document.getElementById('categoryDropdown').classList.remove('d-none');
    document.getElementById('category').style.cssText = `
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        border-bottom: none;
    `;
    document.getElementById('category').onclick = closeCategoryDropdown;
}

function newCategory() {
    closeCategoryDropdown();
    document.getElementById('newCategoryContainer').classList.remove('d-none');
    document.getElementById('newCategoryColors').classList.remove('d-none');
    document.getElementById('category').style.display = 'none';
}

function newCategoryOverlay() {
    closeCategoryDropdownOverlay();
    document.getElementById('newCategoryContainerOverlay').classList.remove('d-none');
    document.getElementById('newCategoryColorsOverlay').classList.remove('d-none');
    document.getElementById('categoryOverlay').style.display = 'none';
}

function cancelNewCategoryOverlay() {
    document.getElementById('newCategoryInputOverlay').value = '';
    document.getElementById('newCategoryColorOverlay').style.backgroundColor = '';
    document.getElementById('newCategoryContainerOverlay').classList.add('d-none');
    document.getElementById('newCategoryColorsOverlay').classList.add('d-none');
    document.getElementById('categoryOverlay').style.display = 'flex';
    document.getElementById('categoryOverlay').innerHTML = 'Select task category';
}

function closeCategoryDropdown() {
    document.getElementById('categoryDropdown').classList.add('d-none');
    document.getElementById('category').style.cssText = `
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-bottom: 1px solid #D1D1D1;
    `;
    document.getElementById('category').onclick = openCategoryDropdown;
}

function selectedCategory(category, color) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('category').innerHTML = /*html*/ `
        <div id="_xak1l2uph" class="categoryContainer">
            ${category}
            <div class="categoryColor" style="background-color: ${color}; margin-left: 10px"></div>
        </div>`;
    closeCategoryDropdown();
    return color;
}

function addColorToNewCategory(color) {
    document.getElementById('newCategoryColor').style.backgroundColor = color;
}

function confirmNewCategoryOverlay() {
    let newCategory = document.getElementById('newCategoryInputOverlay').value;
    let newCategoryColor = document.getElementById('newCategoryColorOverlay').style.backgroundColor;
    let newCategoryInput = document.getElementById('newCategoryInputOverlay');
    if (newCategoryInput.value == '') {
        newCategoryInput.focus();
    } else {
        selectedCategoryOverlay(newCategory, newCategoryColor);
        document.getElementById('newCategoryInputOverlay').value = '';
        document.getElementById('newCategoryColorOverlay').style.backgroundColor = '';
        document.getElementById('newCategoryContainerOverlay').classList.add('d-none');
        document.getElementById('newCategoryColorsOverlay').classList.add('d-none');
        document.getElementById('categoryOverlay').style.display = 'flex';
    }
}

function addColorToNewCategoryOverlay(color) {
    document.getElementById('newCategoryColorOverlay').style.backgroundColor = color;
}

function assignOptionIDs() {
    const selectElement = document.getElementById('which_assigned_contact');
    const options = selectElement.getElementsByTagName('option');
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const color = option.style.backgroundColor;
        const optionID = generateUniqueID();
        option.setAttribute('data-id', optionID);
        option.setAttribute('data-color', color);
    }
}