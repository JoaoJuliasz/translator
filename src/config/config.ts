import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://libretranslate.de/'
})

export default instance