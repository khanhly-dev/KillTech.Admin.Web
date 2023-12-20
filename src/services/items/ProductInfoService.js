import Base from '../MainService'
const resources = 'ProductInfo'
export default {
    //-----------------------------------------------------------------------------
    //tag----------------------------------------------------------------------
    GetInfo(param) {
        return Base.get(`${resources}/get-product-info-paging`, { params: param })
    },
    CreateInfo(param) {
        return Base.post(`${resources}/create-product-info`, param)
    },
    UpdateInfo(param) {
        return Base.put(`${resources}/update-product-info`, param)
    },
    DeleteInfo(param) {
        return Base.delete(`${resources}/delete-product-info?Id=${param}`)
    },
}
