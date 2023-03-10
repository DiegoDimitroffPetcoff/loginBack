const bcrypt = require ('bcrypt');
function validatePass(user, password) {

    console.log(user)
    console.log(password)
    return bcrypt.compareSync( password, user)

    
}
module.exports = validatePass