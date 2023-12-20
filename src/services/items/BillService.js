import Base from '../MainService'
const resources = 'Bill'
export default {
    GetOrder(param) {
        return Base.get(`${resources}/get-order-paging`, { params: param })
    },
    CreateBill(param) {
        return Base.post(`${resources}/create-bill`, param)
    },
    
}
