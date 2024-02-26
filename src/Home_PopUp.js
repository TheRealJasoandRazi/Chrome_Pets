document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Create_Pet_Button').addEventListener('click', function () {
        chrome.runtime.sendMessage({ message: "Create_Pet" });
    });
});