import Base from '../MainService'
const resources = 'Product'
export default {
    //category---------------------------------------------------------------------
    GetCategoryPaging(param) {
        return Base.get(`${resources}/get-category-paging`, { params: param })
    },
    GetListParent() {
        return Base.get(`${resources}/get-list-parent`)
    },
    GetProductHashMap() {
        return Base.get(`${resources}/get-product-hashmap`)
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
    GetProductPaging(param) {
        return Base.get(`${resources}/get-product-paging`, { params: param })
    },
    CreateProduct(param) {
        return Base.post(`${resources}/create-product`, param)
    },
    UpdateProduct(param) {
        return Base.put(`${resources}/update-product`, param)
    },
    DeleteProduct(param) {
        return Base.delete(`${resources}/delete-product?Id=${param}`)
    },
    //-----------------------------------------------------------------------------
    //image----------------------------------------------------------------------
    GetProductImage(param) {
        return Base.get(`${resources}/get-product-image`, { params: param })
    },
    CreateProductImage(param) {
        return Base.post(`${resources}/create-product-image`, param)
    },
    DeleteProductImage(param) {
        return Base.delete(`${resources}/delete-product-image?Id=${param}`)
    },
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
}
