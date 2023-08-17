import Base from '../MainService'
const resources = 'Product'
export default {
    //category---------------------------------------------------------------------
    GetCategoryPaging(query) {
        return Base.get(`${resources}/get-category-paging`, { params: query })
    },
    GetListParent() {
        return Base.get(`${resources}/get-list-parent`)
    },
    CreateCategory(param) {
        return Base.post(`${resources}/create-product-category`, param)
    },
    UpdateCategory(param) {
        return Base.put(`${resources}/update-product-category`, param)
    },
    DeleteCategory(param) {
        return Base.delete(`${resources}/delete-product-category?CategoryId=${param}`)
    },
    //-----------------------------------------------------------------------------
    //product----------------------------------------------------------------------
    GetProductPaging(query) {
        return Base.get(`${resources}/get-product-paging`, { params: query })
    },
}
