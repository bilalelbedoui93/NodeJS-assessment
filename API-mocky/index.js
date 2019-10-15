const call= require('../common/call')

const api ={

    __url__:`http://www.mocky.io/v2/5808862710000087232b75ac`,

    /**
     * Returns All the clients available in the data base
     * 
     * @returns {Array} clients data
     * 
     */

    getUsersData() {

        return (async () => {
            try{
                const response = await call(`${this.__url__}`, {
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