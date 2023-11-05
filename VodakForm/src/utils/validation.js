/**
 * @param {string} username
 */
export function validateUsername(username) {
    const regex = /^[a-zA-Z0-9]{2,20}$/;
    return regex.test(username);
}

/**
 * @param {string} password
 */
export function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
}

/**
 * @param {string} email
 */
export function validateEmail(email) {
    const regex = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,255}$/
    return regex.test(email)
}

/**
 * @param {string} sClass
 */
export  function validateSClass(sClass) {
    const regex = /^[aceACE][1234][abcABC]$/
    return regex.test(sClass)
}
