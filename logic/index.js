const validate = require('../common/validate')
const api = require('../API-mocky')

const logic = {

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

}

module.exports = logic