/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    const navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav', rootMargin: '0px 0px -40%',
        });
    }
    
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(document.querySelectorAll('#navbarResponsive .nav-link'));
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

let fileDetails = null;

function openFilePicker() {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

    inputElement.addEventListener('change', handleFileSelection);

    // Trigger the file picker dialog
    inputElement.click();
}

function handleFileSelection(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
        console.log('Selected file:', selectedFile.name);
        fileDetails = selectedFile;
        setFileContent();
    }
}

function setFileContent() {
    document.getElementById("file-content").scrollIntoView({behavior: "smooth"});
    document.getElementById("file-content").classList.remove("visually-hidden");
    document.getElementById("file-name").textContent = fileDetails.name;
    document.getElementById("file-picker").classList.add("visually-hidden");
    let content = document.getElementById("file-table");

    const inputElement = document.getElementById('groupInput');
    const groupSizeParagraph = document.getElementById('group-size');
    const totalCompleteGroups = document.getElementById('total-complete-groups');
    const extraGroup = document.getElementById('extra-group');

    // get total row - 1 from file
    let totalRow = 0;
    let reader = new FileReader();
    reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let range = XLSX.utils.decode_range(sheet['!ref']);
        totalRow = range.e.r;
    };
    reader.readAsArrayBuffer(fileDetails);


    inputElement.addEventListener('input', function (event) {
        const inputValue = event.target.value;
        const parsed = parseInt(inputValue, 10)
        if (parsed > 0) {
            groupSizeParagraph.textContent = inputValue;
            totalCompleteGroups.textContent = Math.floor(totalRow / inputValue);
            if (totalRow % inputValue === 0) {
                extraGroup.classList.add("visually-hidden");
            } else {
                extraGroup.classList.remove("visually-hidden");
                extraGroup.textContent = ` and 1 with size ${totalRow % inputValue}`;
            }

        } else {
            inputElement.value = 1;
        }
    });
    inputElement.value = 5;
}

function removeFile() {
    document.getElementById("file-content").classList.add("visually-hidden");
    document.getElementById("file-picker").classList.remove("visually-hidden");
    fileDetails = null;
    document.getElementById("page-top").scrollIntoView({behavior: "smooth", block: "start"});
}

function createGroups(){}