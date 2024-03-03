document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Create_Pet_Button').addEventListener('click', function () {
        chrome.runtime.sendMessage({ message: "Create_Pet" });
        document.getElementById('Create_Pet_Button').innerHTML = 'Create New Pet';
    });
    document.getElementById('Delete_Pet_Button').addEventListener('click', function () {
        chrome.runtime.sendMessage({ message: "Delete_Pet" });
        document.getElementById('Create_Pet_Button').innerHTML = 'Create Pet';
    });
});