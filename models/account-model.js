const pool = require("../database/")
/* *****************************
*   Get account data based on email
* *************************** */
async function getAccountByEmail(account_email, account_password){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2"
    return await pool.query(sql, [account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

module.exports = {registerAccount, getAccountByEmail}