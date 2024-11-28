function validateAlumniDetails() {
    var name = document.getElementById('name').value;
    var name1 = document.getElementById('name1').value;
    var name2 = document.getElementById('name2').value;
    var add = document.getElementById('add').value;
    var cat = document.getElementById('cat').value;
    var pno = document.getElementById('no').value;
    var nameWarning = document.getElementById('nameWarning');
    var name1Warning = document.getElementById('name1Warning');
    var name2Warning = document.getElementById('name2Warning');
    var catWarning = document.getElementById('catWarning');
    var addWarning = document.getElementById('addWarning');
    var overallWarning = document.getElementById('overallWarning');

    // Reset all warnings
    nameWarning.style.display = 'none';
    name1Warning.style.display = 'none';
    name2Warning.style.display = 'none';
    noWarning.style.display = 'none';
    addWarning.style.display = 'none';
    catWarning.style.display = 'none';
    overallWarning.style.display = 'none';

    var isValid = true;

    if (!name) {
        nameWarning.style.display = 'inline';
        isValid = false;
    }
    if (!name1) {
        name1Warning.style.display = 'inline';
        isValid = false;
    }
    if (!name2) {
        name2Warning.style.display = 'inline';
        isValid = false;
    }
    if (!add) {
        addWarning.style.display = 'inline';
        isValid = false;
    }
    if (!cat) {
        catWarning.style.display = 'inline';
        isValid = false;
    }
    if (!pno) {
        noWarning.style.display = 'inline';
        isValid = false;
    }

    if (isValid) {
        window.location.href = "admission.html";
    } else {
        overallWarning.style.display = 'block';
    }
}