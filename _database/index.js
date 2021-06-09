const {connect} = require("mongoose");
const {MONGO_URI} = process.env;

(async function () {
    try {
        await connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology : true,
            useFindAndModify : true
        });
        console.log('Connected to Database Server');
    } catch (error) {
        console.log(error)
    }
})();




