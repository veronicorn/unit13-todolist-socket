const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todosSchema = new Schema({
    text: {
        type: String,
        lowercase: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
});

const todos = mongoose.model("Todo", todosSchema);

module.exports = todos;