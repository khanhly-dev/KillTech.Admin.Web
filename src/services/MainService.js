import getInstanceAxios from '@/utils/request'
import apiConfig from '../config/api'

const baseDomain = apiConfig.MAIN_KILLTECH_API
const baseURL = `${baseDomain}/api`

export default getInstanceAxios(baseURL)
