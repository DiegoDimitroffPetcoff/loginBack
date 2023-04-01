const bcrypt = require ('bcrypt');
function validatePass(user, password) {


    return bcrypt.compareSync( password, user)

    
}
module.exports = validatePass