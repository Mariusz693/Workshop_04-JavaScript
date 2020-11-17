// const apiService = new ApiService();
// apiService.getTasks(
//     function (tasks){
//         console.log(tasks);
//     },
//     function (error){
//         console.log(error);
//     }
// );
// const newTask = new Task("My new task", "Some description", "open");
// apiService.saveTasks(
//     newTask,
//     function (savedTask){
//         console.log(savedTask);
//     },
//     function (error){
//         console.log(error);
//     }
// );

// document.addEventListener("DOMContentLoaded", function (){
//     const domElement = new DomElements();
//     const newTask = new Task("My new task", "Some desc", "open");
//     domElement.createTaskElement(newTask);
// })

document.addEventListener("DOMContentLoaded", function (){
    new DomElements();
})