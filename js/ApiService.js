class ApiService{
    constructor() {
        this.apikey = "69fee287-fe56-4873-b454-09f35ea2dcc2";
        this.url = "https://todo-api.coderslab.pl";
    }
    createTaskFromResponseData(data){
        const task = new Task(data.title, data.description, data.status);
        if (data.id){
            task.id = data.id;
        }
        return task;
    }
    createOperationFromResponseData(data){
        const operation = new Operation(data.description, data.timeSpend)
        if (data.id){
            operation.id = data.id;
        }
        return operation;
    }
    getTasks(successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/tasks", {
            headers: {
                Authorization: this.apikey,
            },
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (typeof successCallbackFn === "function"){
                    const tasksToProcess = responseData.data;
                    const tasks = tasksToProcess.map((element) => {
                        return this.createTaskFromResponseData(element);
                    });
                    successCallbackFn(tasks);
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            });
    }
    saveTasks(task, successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/tasks", {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(task),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (typeof successCallbackFn === "function"){
                    const newTask = this.createTaskFromResponseData(responseData.data);
                    successCallbackFn(newTask);
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            })
            .finally(() => {
                window.location.reload();
            });
    }
    updateTask(task, successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/tasks/" + task.id, {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(task),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (typeof successCallbackFn === "function"){
                    const updateTask = this.createTaskFromResponseData(responseData.data);
                    successCallbackFn(updateTask);
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            });
    }
    deleteTask(taskId, successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/tasks/" + taskId, {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json"
            },
            method: "DELETE",
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (typeof successCallbackFn === "function"){
                    console.log("Delete task");
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            });
    }
    getOperationsForTask(taskId, successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/tasks/" + taskId + "/operations", {
            headers: {
                Authorization: this.apikey,
            },
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (typeof successCallbackFn === "function"){
                    const operations = responseData.data.map((element) => {
                        return this.createOperationFromResponseData(element);
                    })
                    successCallbackFn(operations);
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            });
    }
    addOperationForTask(taskId, operation, successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/tasks/" + taskId + "/operations", {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(operation),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (typeof successCallbackFn === "function"){
                    const newOperation = this.createOperationFromResponseData(responseData.data);
                    successCallbackFn(newOperation);
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            })
            .finally(() => {
                window.location.reload();
            });
    }
    getOperation(operationId, successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/operations/" + operationId, {
            headers: {
                Authorization: this.apikey
            },
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (typeof successCallbackFn === "function"){
                    const operation = this.createOperationFromResponseData(responseData.data);
                    successCallbackFn(operation);
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            });
    }
    updateOperation(operation, successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/operations/" + operation.id, {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(operation),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                console.log(operation);
                if (typeof successCallbackFn === "function"){
                    const operation = this.createOperationFromResponseData(responseData.data);
                    successCallbackFn(operation);
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            });
    }
    deleteOperation(operationId, successCallbackFn, errorCallbackFn){
        fetch(this.url + "/api/operations/" + operationId, {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json"
            },
            method: "DELETE",
        })
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (typeof successCallbackFn === "function"){
                    console.log("Delete operation");
                }
            })
            .catch((error) => {
                if (typeof errorCallbackFn === "function"){
                    errorCallbackFn(error);
                }
            });
    }
}