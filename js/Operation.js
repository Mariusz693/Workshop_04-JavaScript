class Operation{
    constructor(description, timeSpend) {
        this.id = null;
        this.description = description;
        this.timeSpend = timeSpend === undefined ? 0 : timeSpend;
    }
}