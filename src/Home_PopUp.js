let size_value;
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Create_Pet_Button').addEventListener('click', function () {
        chrome.runtime.sendMessage({ message: "Create_Pet", size: size_value});
        document.getElementById('Create_Pet_Button').innerHTML = 'Create New Pet';
    });
    document.getElementById('Delete_Pet_Button').addEventListener('click', function () {
        chrome.runtime.sendMessage({ message: "Delete_Pet" });
        document.getElementById('Create_Pet_Button').innerHTML = 'Create Pet';
        //updates the text on the create button
    });
});
document.getElementsByName("size-input")[0].addEventListener('change', getvalue);

function getvalue(){
   size_value = this.value;
}
