const call= require('../common/call')

const api ={

    __url__users__:`http://www.mocky.io/v2/5808862710000087232b75ac`,

    __url__policies__:`http://www.mocky.io/v2/580891a4100000e8242b75c5`,

    /**
     * Returns All the clients available in the data base
     * 
     * @returns {Array} clients data
     * 
     */

    getUsersData() {

        return (async () => {
            try{
                const response = await call(`${this.__url__users__}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                return response.data

            }catch(error){
                return error.response
            }
        })()
    },
    
    /**
     * Returns All policies available in the data base
     * 
     * 
     * @returns {Array} policies data
     */

    getAllPolicies() {

        return (async () => {
            try{
                const response = await call(`${this.__url__policies__}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                return response.data

            }catch(error){
                return error.response
            }
        })()
    }
}

module.exports= api