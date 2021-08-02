
const uploadArea = document.querySelector('#uploadArea')
const uploadZoon = document.querySelector('#uploadZoon');
const loadingText = document.querySelector('#loadingText');
const fileInput = document.querySelector('#fileInput');
const fileDetails = document.querySelector('#fileDetails');
const uploadedFile = document.querySelector('#uploadedFile');
const uploadedFileInfo = document.querySelector('#uploadedFileInfo');
const uploadedFileName = document.querySelector('.uploaded-file__name');
const uploadedFileCounter = document.querySelector('.uploaded-file__counter');

uploadZoon.addEventListener('click', function (event) {
    fileInput.click();
});

fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    uploadFile(file);
});

function uploadFile(file) {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = loadHandler;
    fileReader.onerror = errorHandler;
    const fileType = file.type;
    if (fileValidate(fileType)) {
        //do some styles
        uploadZoon.style.display = 'none'
        loadingText.style.visibility = "block";
        document.querySelector('#input-textarea').style.visibility = 'visible';
        document.querySelector('#output-textarea').style.visibility = 'visible';
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
    let allCSVLines = csv.split(/\r\n|\n/);
    let matrixBeforeProcessing = [];
    for (let i=0; i< allCSVLines.length; i++) {
        let data = allCSVLines[i].split(',');
        let val = [];
        for (let j=0; j<data.length; j++) {
            val.push(data[j]);
        }
        matrixBeforeProcessing.push(val);
    }
    document.querySelector(`#input-textarea`).innerHTML = matrixBeforeProcessing
        .map((item) => {
            return item.join(",");
        }).join("\n")
     calculateBadVal(matrixBeforeProcessing)
}

function errorHandler(evt) {
    if(evt.target.error.name === "NotReadableError") {
        alert("Cannot read file !");
    }
}

function calculateBadVal(matrix){
    for(let i = 0; i < matrix.length; i++) {
        const line = matrix[i]
        for(let j = 0; j < line.length; j++) {
            const element = matrix[i][j];
            if (element == 0){
               matrix = fixBadVal(matrix , i , j)
            }
        }
    }
    document.querySelector(`#output-textarea`).innerHTML = matrix
        .map((item) => {
            return item.join(",");
        }).join("\n")
}

function fixBadVal(matrix, i, j) {
    if (i > 0 && i + 1 < matrix.length && matrix[i - 1][j] !== 0 && matrix[i + 1][j] !== 0) {
        matrix[i][j] = (Math.round((parseInt(matrix[i-1][j]) + parseInt(matrix[i+1][j])) / 2))
    }
    if (j > 0 && j + 1 < matrix[i].length && matrix[i][j - 1] !== 0 && matrix[i][j + 1] !== 0) {
        matrix[i][j] = (Math.round((parseInt(matrix[i][j-1]) + parseInt(matrix[i][j+1 ])) / 2))
    }
    if (i > 0 && i + 1 < matrix.length && j > 0 && j + 1 < matrix[i].length && matrix[i - 1][j - 1] !== 0 && matrix[i + 1][j + 1] !== 0){
        matrix[i][j] = (Math.round((parseInt(matrix[i - 1][j - 1]) + parseInt(matrix[i + 1][j + 1])) / 2))
    }
    if (i === 0 && j + 1 === matrix.length && matrix[0][j - 1] !== 0 && matrix[i+1][j] !== 0 ){
        matrix[i][j] = (Math.round((parseInt(matrix[i][j-1]) + parseInt(matrix[i+1][j])) / 2))
    }
    if (i === 0 && j===0  && matrix[0][j + 1] !== 0 && matrix[i+1][0] !== 0 ){
        matrix[i][j] = (Math.round((parseInt(matrix[0][j + 1]) + parseInt(matrix[i+1][0])) / 2))
    }
    if (i+1 === matrix.length && j === 0 && matrix[i-1][j] !== 0 && matrix[i][j+1] !== 0){
        matrix[i][j] = (Math.round((parseInt(matrix[i-1][j]) + parseInt(matrix[i][j+1])) / 2))
    }
    if (i+1 === matrix.length && j + 1 === matrix.length && matrix[i][j-1] !== 0 && matrix[i-1][j] !== 0){
        matrix[i][j] = (Math.round((parseInt(matrix[i][j-1]) + parseInt(matrix[i-1][j])) / 2))
    }
    return matrix

}