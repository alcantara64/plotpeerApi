
const axios = require('axios');
import HttpStatus from '../lib/status'
const crypto = require('crypto');

module.exports = class {
    constructor (baseURL, auth) {
        this.axiosInstance = axios.create({
            baseURL,
            auth: {
                username: auth.username,
                password: auth.password
            },
        });
    }

    addHeaders(headers){
        if (headers.length > 0) {
            headers.forEach(header => {
                this.axiosInstance.defaults.headers.common[header.key] = header.value;
            });
        }
    }

    async callStapi(requestBody, requestType){
        try {
            var result
            var requestDefault = {
                alias:"ws@plotpeer.com",
                version:"1.00",
                request: requestBody
            }
            switch (requestType) {
                case "POST":
                        result = await this.axiosInstance.post("", requestDefault)
                console.log("requestDefault > ", requestDefault)
                    break;
                default:
                        result = await this.axiosInstance.get()
                    break;
            }
            return result

        } catch (error) {
            throw(error)
        }
    }

    async handleStapiErrors(res, responseBody) {
        
            if (typeof responseBody == String) {
                if (responseBody.includes("401 Unauthorized")) {
                    return res.status(HttpStatus.TIMEOUT).json({ 
                        ok: false,
                        message: "Request Timeout",
                        error: "Timeout Error"
                    })
                }
                if (responseBody.includes("Request Timeout")) {
                    return res.status(HttpStatus.TIMEOUT).json({ 
                        ok: false,
                        message: "Request Timeout",
                        error: "Timeout Error"
                    })
                }
            }

            
            if (responseBody.response[0].errorcode != "0") { 
                return res.status(HttpStatus.BAD_REQUEST).json({ 
                    ok: false,
                    message: 'Could not fund wallet!',
                    error: responseBody.response[0].errormessage,
                    data: responseBody.response[0].errordata
                })
            }
    }
}
