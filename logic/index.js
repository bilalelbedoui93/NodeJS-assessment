const validate = require('../common/validate')
const api = require('../API-mocky')
const { User } = require('../data')
const bcrypt = require('bcrypt');


const logic = {

    /**
     * this is the function to register new users of the app
     * 
     * 
     * @param {String} fullname the user fullname
     * @param {String} email  the user email 
     * @param {String} password the user password
     * 
     * @throws {Error} if the email provided already exists 
     * 
     * @returns the confirmation that the user has been properly created 
     */
    createUser(fullname, email, password) {

        validate.arguments([
            { name: 'fullname', value: fullname, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return (async () => {

            let user = await User.findOne({ email })
            if (user) throw Error(`The user with the email ${email} already exists`)

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)

            try {
                user = await User.create({
                    fullname,
                    email,
                    password: hash
                })

            } catch (error) {
                throw new Error(error);
            }
        })()
    },

    /**
     * allows the user to authenticate
     * 
     * @param {String} email the user email
     * @param {String} password the user password
     * 
     * @returns the user ID, and the organization ID if he represents a company 
     */
    authenticateUser(email, password) {

        validate.arguments([
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return (async () => {
            try {

                let user = await User.findOne({ email })
                if (!user) throw new Error(`User with the email ${email} doesn't exist`)

                const validPassword = await bcrypt.compare(password, user.password)
                if (!validPassword) throw new Error('Wrong credentials!')

                return { id: user._id.toString() };

            } catch (err) {
                throw Error(err.message);
            }
        })()
    },

    /**
     * Returns user information providing the id number
     * Authorization: user & admin
     * 
     * @param {String} id 
     * 
     * @throws {Error} if the data base is empty 
     * @throws {Error} if the user has not been found providing the id number
     * 
     * @returns {Object} user data
     */

    getUserDataById(id) {

        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                const { clients } = await api.getUsersData()

                if (!clients) throw Error('No_users_found')

                let user
                clients.map(client => {
                    if (client.id === id) {
                        user = client
                    }
                })


                if (!user) throw Error(`User with id ${id} does not exist`)
                return user
            } catch (error) {
                throw Error(error)
            }
        })()
    },

    /**
     * Returns user information providing the user name
     * Authorization: user & admin
     * 
     * @param {String} name 
     * 
     * @throws {Error} if the data base is empty 
     * @throws {Error} if the user has not been found providing the user name
     * 
     * @returns {Object} user data
     */

    getUserDataByName(name) {

        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                const { clients } = await api.getUsersData()

                if (!clients) throw Error('No_users_found')

                let user
                clients.map(client => {
                    if (client.name.toLowerCase() === name.toLowerCase()) {
                        user = client
                    }
                })
                if (!user) throw Error(`User with name ${name} does not exist`)

                return user
            } catch (error) {
                throw Error(error)
            }
        })()
    },

    /**
    * Returns all policies that belong to a user, providing the user name
    * Authorization: admin
    * 
    * @param {String} name 
    * 
    * @throws {Error} if the role is not 'admin'
    * @throws {Error} if the policies data base is empty
    * 
    * @returns {Object} user data
    */

    getPoliciesByUserName(name) {

        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                const { id, role } = await this.getUserDataByName(name)

                if (role !== 'admin') throw Error('You are not allowed to access to this information')

                const response = await api.getAllPolicies()

                if (!response) throw Error('No_policies_found')

                let userPolicies = []

                response.policies.map(policy => {
                    if (policy.clientId === id) userPolicies.push(policy)
                })

                return userPolicies
            } catch (error) {
                throw Error(error)
            }
        })()

    },

    /**
    * Returns the user data linked to a policy number
    * Authorization: admin
    * 
    * @param {String} policyId 
    * 
    * @throws {Error} if the policies data base is empty
    * @throws {Error} if the policy id provided doesn't exist
    * @throws {Error} if the role is not 'admin'
    * 
    * @returns {Object} user data
    */

    getUserByPolicyId(policyId) {
        validate.arguments([
            { name: 'policyId', value: policyId, type: 'string', notEmpty: true }
        ])

        return (async () => {

            try {

                const response = await api.getAllPolicies()

                if (!response) throw Error('No_users_found')

                let userId

                response.policies.map(item => {
                    if (item.id === policyId) userId = item.clientId
                })

                if (!userId) throw Error(`the policy ${policyId} not found in our databse`)

                const user = await this.getUserDataById(userId)

                if (user.role !== 'admin') throw Error('You are not allowed to access to this information')

                return user

            } catch (error) {
                throw Error(error)
            }
        })()
    }
}

module.exports = logic