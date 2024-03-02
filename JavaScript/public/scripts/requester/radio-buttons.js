document.addEventListener('DOMContentLoaded', function () {
    setRadioButtonsFromStorage(); // Set radio buttons based on storage on page load

    document.getElementById('sortByTitle').addEventListener('change', handleCheckboxChange);
    document.getElementById('sortByStatus').addEventListener('change', handleCheckboxChange);
    document.getElementById('sortByDate').addEventListener('change', handleCheckboxChange);
    document.getElementById('orderByAscending').addEventListener('change', handleCheckboxChange);
    document.getElementById('orderByDescending').addEventListener('change', handleCheckboxChange);

    // Function to handle checkbox changes
    function handleCheckboxChange(event) {
        console.log(event.target.id + ' checkbox changed. Checked: ' + event.target.checked);
        applySorting();
    }

    function applySorting() {
        const titleChecked = document.getElementById('sortByTitle').checked;
        const statusChecked = document.getElementById('sortByStatus').checked;
        const dateChecked = document.getElementById('sortByDate').checked;
        const ascendingChecked = document.getElementById('orderByAscending').checked;
        const descendingChecked = document.getElementById('orderByDescending').checked;

        // Store the sorting information in sessionStorage
        sessionStorage.setItem('sorting', JSON.stringify({
            titleChecked,
            statusChecked,
            dateChecked,
            ascendingChecked,
            descendingChecked
        }));

        sortData(titleChecked, statusChecked, dateChecked, ascendingChecked, descendingChecked);
    }

    function sortData(titleChecked, statusChecked, dateChecked, ascendingChecked, descendingChecked) {
        let sortOrder = '';
        
        if (ascendingChecked) {
            sortOrder = 'asc';
        } else if (descendingChecked) {
            sortOrder = 'desc';
        }

        if (titleChecked) {
            window.location.href = `/requester-home/sort?sort=title&order=${sortOrder}`;
        } else if (statusChecked) {
            window.location.href = `/requester-home/sort?sort=status&order=${sortOrder}`;
        } else if (dateChecked) {
            window.location.href = `/requester-home/sort?sort=date&order=${sortOrder}`;
        }
    }

    // Function to set radio buttons based on storage and current URL
    function setRadioButtonsFromStorage() {
        const sortingInfo = JSON.parse(sessionStorage.getItem('sorting')) || {};
        const {
            titleChecked,
            statusChecked,
            dateChecked,
            ascendingChecked,
            descendingChecked
        } = sortingInfo;

        // Set the state of sortBy radio buttons
        const sortByTitleRadio = document.getElementById('sortByTitle');
        const sortByStatusRadio = document.getElementById('sortByStatus');
        const sortByDateRadio = document.getElementById('sortByDate');

        if (titleChecked) {
            sortByTitleRadio.checked = true;
        } else if (statusChecked) {
            sortByStatusRadio.checked = true;
        } else if (dateChecked) {
            sortByDateRadio.checked = true;
        }

        // Set the state of orderBy radio buttons
        const orderByAscendingRadio = document.getElementById('orderByAscending');
        const orderByDescendingRadio = document.getElementById('orderByDescending');

        if (ascendingChecked) {
            orderByAscendingRadio.checked = true;
        } else if (descendingChecked) {
            orderByDescendingRadio.checked = true;
        }

        const currentURL = window.location.href;
        if (currentURL.includes('/requester-home') && !currentURL.includes('/requester-home/sort')) {
            sortByDateRadio.checked = true;
            orderByDescendingRadio.checked = true;
        }
    }
});