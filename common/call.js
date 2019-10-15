const axios = require('axios')

function call(url, options) {
    const { method , headers, data, timeout = 0 } = options

        return (async () => {
            try {
                const result = await axios({
                    url,
                    method,
                    headers,
                    data,
                    timeout
                })
                return result
            } catch (err) {
                if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') throw new ConnectionError('cannot connect')

                if (!err.response) throw err
                const { response: { data: { error } } } = err
                if (error) err.message = error
                throw err
            }
        })()
}

module.exports=call