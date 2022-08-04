import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://translate.terraprint.co/'
})

export default instance