class DomElements {
    constructor() {
        this.appEl = document.querySelector(".todo-app");
        this.apiService = new ApiService();
        this.loadAll();
        this.addEventToNewTaskForm();
        this.addEventToShowNewOperationForm();
        this.addEventToSubmitOperationForm();
        this.addShowAddOperationTime();
        this.addFinishTaskEvent();
        this.addDeleteTaskEvent();
        this.addDeleteOperationEvent();
    }
    loadAll(){
        this.apiService.getTasks(
            (tasks) => {
                tasks.map((task) => {
                    this.createTaskElement(task);
                });
            },
            (error) => {
                console.log(error);
            }
        );
    }

    createTaskElement(task){

        let taskSectionEl = document.createElement("section");
        taskSectionEl.classList.add('task');
        taskSectionEl.dataset.id = task.id;
        taskSectionEl.dataset.title = task.title;
        taskSectionEl.dataset.description = task.description;
        taskSectionEl.dataset.status = task.status;

        let taskHeaderEl = document.createElement('h2');
        taskHeaderEl.innerText = task.title;
        taskSectionEl.appendChild(taskHeaderEl);

        let listEl = document.createElement('ul');
        listEl.classList.add('list-group', 'todo');
        taskSectionEl.appendChild(listEl);

        let listFirstEl = document.createElement('li');
        listFirstEl.classList.add('list-group-item', 'active', 'task-description');
        listFirstEl.innerText = task.description;
        listEl.appendChild(listFirstEl);

        if (task.status === "open"){
            let deleteTaskButton = document.createElement('a');
            deleteTaskButton.classList.add('btn', 'float-right', 'btn-danger');
            deleteTaskButton.innerText = "Delete";
            listFirstEl.appendChild(deleteTaskButton);

            let finishButton = document.createElement('a');
            finishButton.classList.add('btn', 'btn-secondary', 'float-right', 'close-task');
            finishButton.innerText = "Finish";
            listFirstEl.appendChild(finishButton);

            let addOperationButton = document.createElement('a');
            addOperationButton.classList.add('btn', 'btn-secondary', 'float-right', 'add-operation');
            addOperationButton.innerText = "Add operation";
            listFirstEl.appendChild(addOperationButton);
        }
        if (task.status === "closed"){
            let deleteTaskButton = document.createElement('a');
            deleteTaskButton.classList.add('btn', 'float-right', 'btn-danger');
            deleteTaskButton.innerText = "Task finished - Delete";
            listFirstEl.appendChild(deleteTaskButton);
        }
        this.appEl.appendChild(taskSectionEl);
        this.addEventToLoadOperations(taskSectionEl);
    }
    addEventToNewTaskForm(){
        let formEl = document.querySelector('form');
        formEl.addEventListener('submit', (event) => {
            event.preventDefault();
            let titleEl = event.currentTarget.querySelector('input[name=title]');
            let descriptionEl = event.currentTarget.querySelector('input[name=description]');
            let task = new Task(titleEl.value, descriptionEl.value, "open");
            this.apiService.saveTasks(
                task,
                (savedTask) => {
                    this.createTaskElement(task);
                    titleEl.value = "";
                    descriptionEl.value = "";
                },
                (error) => {
                    console.log(error);
                }
            );
            // window.location.reload();
        });
    }
    timeSpentToString(timeSpent) {
      let hours = Math.floor(timeSpent / 3600);
      let minutes = Math.floor((timeSpent % 3600) / 60);
      let seconds = (timeSpent % 3600) % 60;

      return `${hours}h ${minutes}m ${seconds}s`;
    }
    createOperationElement(operation, taskOperationsElement){
        let operationEl = document.createElement('div');
        operationEl.classList.add('list-group-item', 'task-operation');
        operationEl.dataset.id = operation.id;
        operationEl.dataset.text = operation.description;
        operationEl.dataset.time = operation.timeSpend;
        operationEl.innerText = operation.description;
        taskOperationsElement.appendChild(operationEl);

        const taskStatus = operationEl.parentElement.dataset.status;

        if (taskStatus === 'open'){
            let deleteOperationButton = document.createElement('a');
            deleteOperationButton.classList.add('btn', 'float-right', 'btn-danger', 'delete-operation');
            deleteOperationButton.innerText = "Delete";
            operationEl.appendChild(deleteOperationButton);

            let addTimeManualInput = document.createElement('input');
            addTimeManualInput.classList.add('float-right', 'add-time-input', 'd-none');
            addTimeManualInput.setAttribute('name', 'time');
            addTimeManualInput.setAttribute('placeholder', 'Time in spend minutes');
            operationEl.appendChild(addTimeManualInput);

            let manualTimeButton = document.createElement('a');
            manualTimeButton.classList.add('btn', 'btn-primary', 'float-right', 'add-time');
            manualTimeButton.innerText = "Add time";
            operationEl.appendChild(manualTimeButton);

            let timeSpendEl = document.createElement('span');
            timeSpendEl.classList.add('badge', 'badge-primary', 'badge-pill');
            timeSpendEl.innerText = this.timeSpentToString(operation.timeSpend);
            operationEl.appendChild(timeSpendEl);
            if (operation.timeSpend <= 0){
                timeSpendEl.classList.add('d-none');
            }
        }
    }
    addEventToLoadOperations(taskOperationsElement){
        const h2El = taskOperationsElement.firstElementChild;
        const taskId = taskOperationsElement.dataset.id;
        h2El.addEventListener('click', (event) => {
            const clickedEl = event.target;
            if (clickedEl.parentElement.dataset.loaded === 'true'){
                return;
            }
            this.apiService.getOperationsForTask(
                taskId,
                (operations) => {
                    operations.forEach((operation) => {
                        this.createOperationElement(operation, taskOperationsElement);
                    });
                    clickedEl.parentElement.dataset.loaded = 'true';
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
    addOperationFormVisible(taskOperationsElement){
        if (taskOperationsElement.dataset.operationForm === 'true'){
            taskOperationsElement.removeChild(taskOperationsElement.lastElementChild)
            taskOperationsElement.removeAttribute('data-operation-form');
            return;
        };
        taskOperationsElement.dataset.operationForm = 'true';
        let operationEl = document.createElement('li');
        operationEl.classList.add('list-group-item', 'task-operation', 'task-operation-form');
        taskOperationsElement.appendChild(operationEl);

        let inputDescription = document.createElement('input');
        inputDescription.setAttribute('type', 'text');
        inputDescription.setAttribute('name', 'description');
        inputDescription.setAttribute('placeholder', 'Operation description');
        inputDescription.classList.add('form-control');
        operationEl.appendChild(inputDescription);

        let inputSubmit = document.createElement('input');
        inputSubmit.setAttribute('type', 'submit');
        inputSubmit.setAttribute('value', 'Add');
        inputSubmit.classList.add('btn', 'btn-primary');
        operationEl.appendChild(inputSubmit);
    }
    addEventToShowNewOperationForm(){
        document.querySelector('div.todo-app').addEventListener('click', (event) => {
            if (event.target.classList.contains('add-operation')){
                event.preventDefault();
                let currentEl = event.target;
                let operationFormParent = currentEl.parentElement.parentElement;
                this.addOperationFormVisible(operationFormParent);
            }
        })
    }
    addEventToSubmitOperationForm(){
        document.querySelector('div.todo-app').addEventListener('click', (event) => {
            if (event.target.parentElement.classList.contains('task-operation-form') && event.target.classList.contains('btn')){
                event.preventDefault();
                let currentEl = event.target;
                let description = currentEl.previousElementSibling.value;
                let taskId = currentEl.parentElement.parentElement.parentElement.dataset.id;
                let operation = new Operation(description);
                this.apiService.addOperationForTask(
                    taskId,
                    operation,
                    (savedOperation) => {
                        this.createOperationElement(
                            operation,
                            currentEl.parentElement.parentElement.parentElement
                        );
                        this.addOperationFormVisible(
                            currentEl.parentElement.parentElement
                        );
                    },
                    (error) => {
                        console.log(error);
                    }
                )
            }
        })
    }
    updateOperationTimer(time, operationElement){
        if (time > 0){
            operationElement.querySelector('span.badge').innerText = this.timeSpentToString(time);
            operationElement.querySelector('span.badge').classList.remove('d-none');
        } else {
            operationElement.querySelector('span.badge').innerText = 0;
            operationElement.querySelector('span.badge').classList.add('d-none')
        }
    }
    addShowAddOperationTime(){
        document.querySelector('div.todo-app').addEventListener('click', (event) => {
            if (event.target.classList.contains('add-time') && !event.target.classList.contains('btn-success')){
                event.preventDefault();
                let element = event.target;
                element.previousElementSibling.classList.remove('d-none');
                element.innerText = "Save";
                element.classList.add('btn-success');
            } else if (event.target.classList.contains('add-time') && event.target.classList.contains('btn-success')){
                event.preventDefault();
                let element = event.target;
                const taskId = element.parentElement.parentElement.parentElement.dataset.id;
                const operationId = element.parentElement.dataset.id;
                const timeToAdd = parseInt(element.previousElementSibling.value) * 60;

                const description = element.parentElement.dataset.text;
                const currentTime = parseInt(element.parentElement.dataset.time);

                const operation = new Operation(description, currentTime + timeToAdd);
                operation.id = operationId;

                this.apiService.updateOperation(
                    operation,
                    (operationsUpdated) => {
                        element.parentElement.dataset.time = operationsUpdated.timeSpend;
                        this.updateOperationTimer(
                            operationsUpdated.timeSpend,
                            element.parentElement
                        );
                    },
                    (error) => {
                        console.log(error);
                    }
                )

                element.previousElementSibling.classList.add('d-none');
                element.previousElementSibling.value = "";
                element.innerText = "Add time";
                element.classList.remove('btn-success');
            }
        });
    }
    addFinishTaskEvent(){
        document.querySelector('div.todo-app').addEventListener('click', (event) => {
            if (event.target.classList.contains('close-task')){
                event.preventDefault();
                let element = event.target;

                const taskEl = element.parentElement.parentElement.parentElement;
                const taskId = taskEl.dataset.id;
                const taskTitle = taskEl.dataset.title;
                const taskDescription = taskEl.dataset.description;

                const task = new Task(taskTitle, taskDescription);
                task.id = taskId;
                task.status = 'closed';

                this.apiService.updateTask(
                    task,
                    (updatedTask) => {
                        element.nextElementSibling.classList.add('d-none');
                        element.parentElement.parentElement.parentElement
                            .querySelectorAll('.btn', 'input')
                            .forEach((elem) => elem.classList.add('d-none'));
                    },
                    (error) => {
                        console.log(error)
                    }
                );
            }
        });
    }
    addDeleteTaskEvent(){
        document.querySelector('div.todo-app').addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-danger') && !event.target.classList.contains('delete-operation')){
                event.preventDefault();
                let element = event.target;
                let parentEl = element.parentElement;
                const taskId = element.parentElement.parentElement.parentElement.dataset.id;

                this.apiService.deleteTask(
                    taskId,
                    (deletedTask) => {
                        console.log(deletedTask)
                    },
                    (error) => {
                        console.log(error)
                    }
                );
                element.parentElement.parentElement.parentElement.remove();
            }
        });
    }
    addDeleteOperationEvent(){
        document.querySelector('div.todo-app').addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-danger') && event.target.classList.contains('delete-operation')){
                event.preventDefault();
                let element = event.target;
                const operationId = element.parentElement.dataset.id;

                this.apiService.deleteOperation(
                    operationId,
                    (deletedOperation) => {
                        console.log(deletedOperation)
                    },
                    (error) => {
                        console.log(error)
                    }
                );
                element.parentElement.remove();
            }
        });
    }
}