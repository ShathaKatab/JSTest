

// Select Upload-Area
const uploadArea = document.querySelector('#uploadArea')
const dropZoon = document.querySelector('#dropZoon');
const loadingText = document.querySelector('#loadingText');
const fileInput = document.querySelector('#fileInput');
const fileDetails = document.querySelector('#fileDetails');
const uploadedFile = document.querySelector('#uploadedFile');
const uploadedFileInfo = document.querySelector('#uploadedFileInfo');
const uploadedFileName = document.querySelector('.uploaded-file__name');
const uploadedFileIconText = document.querySelector('.uploaded-file__icon-text');
const uploadedFileCounter = document.querySelector('.uploaded-file__counter');

dropZoon.addEventListener('click', function (event) {
    fileInput.click();
});

fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    uploadFile(file);
});

// Upload File Function
function uploadFile(file) {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = loadHandler;
    fileReader.onerror = errorHandler;
    const fileType = file.type;
    if (fileValidate(fileType)) {
        dropZoon.classList.add('drop-zoon--Uploaded');
        loadingText.style.display = "block";
        uploadedFile.classList.remove('uploaded-file--open');
        uploadedFileInfo.classList.remove('uploaded-file__info--active');
        fileReader.addEventListener('load', function () {
            setTimeout(function () {
                uploadArea.classList.add('upload-area--open');
                fileDetails.classList.add('file-details--open');
                uploadedFile.classList.add('uploaded-file--open');
                uploadedFileInfo.classList.add('uploaded-file__info--active');
            }, 500);

            uploadedFileName.innerHTML = file.name;
            progressMove();
        });
        fileReader.readAsDataURL(file);
    } else {
        this;
    };
};

function progressMove() {
    // Counter Start
    let counter = 0;

    // After 600ms
    setTimeout(() => {
        // Every 100ms
        let counterIncrease = setInterval(() => {
            // If (counter) is equle 100
            if (counter === 100) {
                // Stop (Counter Increase)
                clearInterval(counterIncrease);
            } else { // Else
                // plus 10 on counter
                counter = counter + 10;
                // add (counter) vlaue inisde (uploadedFileCounter)
                uploadedFileCounter.innerHTML = `${counter}%`
            }
        }, 100);
    }, 600);
};

function loadHandler(event) {
    let csv = event.target.result;
    processData(csv);
}


function fileValidate(fileType) {
    let isCSV = fileType.includes('csv');
    if (isCSV.length !== 0) {
            return true;
    } else {
        return alert('Please make sure to upload CSV File Type');
    };
};

function processData(csv) {
    let allTextLines = csv.split(/\r\n|\n/);
    let lines = [];
    for (let i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
        var tarr = [];
        for (var j=0; j<data.length; j++) {
            tarr.push(data[j]);
        }
        lines.push(tarr);
    }
    console.log(lines,'lines');
}

function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}