let size_value;
let pet_index = 0;
const pet_list = ["duck", "kangaroo"];

document.addEventListener('DOMContentLoaded', function () { 
    document.getElementById('Create_Pet_Button').addEventListener('click', function () {
        chrome.runtime.sendMessage({ message: "Create_Pet", size: size_value, pet: pet_list[pet_index]});
    });
    document.getElementById('Delete_Pet_Button').addEventListener('click', function () {
        chrome.runtime.sendMessage({ message: "Delete_Pet" });
    });
    document.getElementById('New_Pet_Button').addEventListener('click', function () {
        pet_index++;
        if (pet_index >= pet_list.length){
            pet_index = 0;
        }
        const prefix = "pet-walking";
        const suffix = "walking_1.png";
        document.getElementById('pet-image').setAttribute("src", `${prefix}/${pet_list[pet_index]}/${suffix}`);
    });
});

document.getElementsByName("size-input")[0].addEventListener('change', getvalue);
//doesn't work
function getvalue(){
   size_value = this.value;
}
