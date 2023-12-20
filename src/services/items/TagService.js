import Base from '../MainService'
const resources = 'Tag'
export default {
    //-----------------------------------------------------------------------------
    //tag----------------------------------------------------------------------
    GetTag(param) {
        return Base.get(`${resources}/get-tag`, { params: param })
    },
    CreateTag(param) {
        return Base.post(`${resources}/create-tag`, param)
    },
    DeleteTag(param) {
        return Base.delete(`${resources}/delete-tag?Id=${param}`)
    },
    //-----------------------------------------------------------------------------
    //product tag----------------------------------------------------------------------
    GetProductTag(param) {
        return Base.get(`${resources}/get-product-tag`, { params: param })
    },
    GetProductByTag(param) {
        return Base.get(`${resources}/get-product-by-tag`, { params: param })
    },
    CreateProductTag(param) {
        return Base.post(`${resources}/create-product-tag`, param)
    },
    DeleteProductTag(param) {
        return Base.delete(`${resources}/delete-product-tag?Id=${param}`)
    },
    //-----------------------------------------------------------------------------
    //tag category---------------------------------------------------------------------
    GetTagCategory(param) {
        return Base.get(`${resources}/get-tag-category`, { params: param })
    },
    GetTagCategorySelect() {
        return Base.get(`${resources}/get-tag-category-select`)
    },
    CreateTagCategory(param) {
        return Base.post(`${resources}/create-tag-category`, param)
    },
    DeleteTagCategory(param) {
        return Base.delete(`${resources}/delete-tag-category?Id=${param}`)
    },
}
