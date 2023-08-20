<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import ProductApi from '../../services/items/ProductService'
import { message } from 'ant-design-vue';
import PublishStatus from '../../components/PublishStatus.vue'
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
    },
    {
        title: 'Mã sản phẩm',
        dataIndex: 'code',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
    },
    {
        title: 'Giá khuyến mãi',
        dataIndex: 'promotionPrice',
    },
    {
        title: 'Thứ tự',
        dataIndex: 'sortOrder',
    },
    {
        title: 'Tên danh mục',
        dataIndex: 'categoryName',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'publish',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];
const imageColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Đường dẫn ảnh',
        dataIndex: 'url',
    },
    {
        title: 'Sản phẩm',
        dataIndex: 'productId',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'publish',
    },
    {
        title: 'Ảnh chính',
        dataIndex: 'isBase',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
]
export default {
    data() {
        return {
            keyword: '',
            columns,
            imageColumns,
            productList: {
                items: []
            },
            currentPage: 1,
            openModal: false,
            openDraw: false,
            product: {},
            parentProductOptions: [],
            listImage: [],
            image : {},
            openModalImage: false
        }

    },
    methods: {
        async GetProduct(PageNumber, PageSize) {
            var param = {
                PageNumber: PageNumber,
                PageSize: PageSize,
                Keyword: this.keyword
            }
            const data = await ProductApi.GetProductPaging(param);
            if (data != null) {
                this.productList = data.data;
            }
        },

        async getListCategory() {
            const data = await ProductApi.GetListParent();
            if (data != null) {
                this.parentProductOptions = data.data
            }
        },

        async getListImage(productId) {
            var param = {
                productId: productId
            }
            const data = await ProductApi.GetProductImage(param);
            if (data != null) {
                this.listImage = data.data.map(x => {
                    return {
                        id: x.id,
                        url: x.url.length >= 50 ? x.url.slice(0, 50) + ' . . . . .' : x.url,
                        productId: x.productId,
                        publish: x.publish,
                        isBase: x.isBase
                    }
                })
            }
        },

        deleteProductImage(imageId) {
            ProductApi.DeleteProductImage(imageId).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.getListImage(this.product.id)
            });
        },

        createImage(){
            this.image.productId = this.product.id
            var param = {
                ProductImage: { ...this.image }
            }
            ProductApi.CreateProductImage(param).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.getListImage(this.product.id);
            })
        },

        showModal(type, record) {
            this.modalType = type;
            this.openModal = true;
            if (type == 'create') {
                this.product = {}
            }
            if (type == 'update') {
                this.product = { ...record }
            }

        },

        showModalImage() {
            this.openModalImage = true;
        },

        createProduct() {
            var param = {
                Product: { ...this.product }
            }
            ProductApi.CreateProduct(param).then(x => {
                this.GetProduct(this.currentPage, 10)
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
            })
        },

        updateProduct() {
            var param = {
                Product: { ...this.product }
            }
            ProductApi.UpdateProduct(param).then(x => {
                this.GetProduct(this.currentPage, 10)
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
            })
        },

        deleteProduct(productId) {
            ProductApi.DeleteProduct(productId).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.GetProduct(this.currentPage, 10)
            });
        },

        handleOk() {
            this.openModal = false;
            //create
            if (this.product.id == null) {
                this.createProduct();
            }
            //update
            else {
                this.updateProduct();
            }
        },

        handleCancel() {
            this.openModal = false;
            this.product = {};
        },

        handleOkImage() {
            this.openModalImage = false;
            this.createImage();
        },

        handleCancelImage() {
            this.openModalImage = false;
        },

        filterOption(input, option) {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        async showDrawer(product) {
            this.openDraw = true;
            this.product = { ...product }
            await this.getListImage(product.id);
        },
        closeDraw() {
            this.openDraw = false;
        }
    },
    async created() {
        await this.GetProduct(this.currentPage, 10);
        await this.getListCategory();
    },
    components: {
        PublishStatus,
    },
}
</script>

<template>
    <h2>Danh sách sản phẩm</h2>
    <a-row>
        <a-col style="width: 50%;">
            <a-input-search v-model:value="keyword" placeholder="Tìm kiếm" enter-button @search="GetProduct(1, 10)" />
        </a-col>
        <a-col style="width: 50%;">
            <a-button type="primary" style="float: right;" @click="showModal('create', null)">
                <plus-outlined />Thêm
            </a-button>
        </a-col>
    </a-row>
    <br>
    <a-row>
        <a-col style="width: 100%;">
            <a-table :columns="columns" :data-source="productList.items" bordered class="basic-table" :pagination="false">
                <template #bodyCell="{ column, text, record }">
                    <span v-if="column.dataIndex != 'publish'">{{ text }}</span>
                    <div v-if="column.dataIndex == 'action'">
                        <a-button type="primary" @click="showModal('update', record)">Cập nhật</a-button>
                        <a-popconfirm title="Bạn có chắc chắn muốn xoá?" @confirm="deleteProduct(record.id)">
                            <a-button type="primary" danger>Xoá</a-button>
                        </a-popconfirm>
                        <a-button type="default" @click="showDrawer(record)">Thêm ảnh</a-button>
                    </div>

                    <div v-if="column.dataIndex == 'publish'">
                        <PublishStatus type="active" v-if="record.publish == true" /><span v-if="record.publish == true">
                            Active</span>
                        <PublishStatus type="inactive" v-if="record.publish == false" /><span
                            v-if="record.publish == false"> Inactive</span>
                    </div>
                </template>
            </a-table>
            <br>
            <a-pagination v-if="productList != null && productList != undefined && productList.items.length > 0"
                v-model:current="currentPage" :total="productList.totalCount" show-less-items style="float: right;"
                @change="GetProduct(currentPage, 10)" />
        </a-col>
    </a-row>

    <!-- modal create product -->
    <a-modal :visible="openModal" title="Thêm/sửa sản phẩm" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="product" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="Tên sản phẩm" name="name"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-input v-model:value="product.name" />
            </a-form-item>

            <a-form-item label="Mã sản phẩm" name="code" :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-input v-model:value="product.code" />
            </a-form-item>

            <a-form-item label="Trạng thái" name="name" :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-radio-group v-model:value="product.publish">
                    <a-radio :style="radioStyle" :value="true">Active</a-radio>
                    <a-radio :style="radioStyle" :value="false">InActive</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="Danh mục" name="categoryId"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-select v-model:value="product.categoryId" show-search :options="parentProductOptions"
                    :filter-option="filterOption" @change="parentCategroyChange">
                </a-select>
            </a-form-item>

            <a-form-item label="Giá" name="price" :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-input-number v-model:value="product.price" :min="1" :max="9999999999999" style="width: 100%;" />
            </a-form-item>

            <a-form-item label="Giá khuyến mãi" name="promotionPrice"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-input-number v-model:value="product.promotionPrice" :min="1" :max="9999999999999" style="width: 100%;" />
            </a-form-item>

            <a-form-item label="thứ tự hiển thị" name="sortOrder"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-input-number v-model:value="product.sortOrder" :min="1" :max="9999999999999" style="width: 100%;" />
            </a-form-item>
        </a-form>
    </a-modal>

    <!-- modal list image -->
    <a-drawer :visible="openDraw" class="custom-class" root-class-name="root-class-name" title="Thêm/xoá ảnh" :width="1000"
        @close="closeDraw" placement="right" @after-open-change="afterOpenChange">
        <a-button type="primary" @click="showModalImage()">Thêm</a-button><br><br>
        <a-table :columns="imageColumns" :data-source="listImage" bordered class="basic-table" :pagination="false">
            <template #bodyCell="{ column, text, record }">
                <span v-if="column.dataIndex != 'publish' && column.dataIndex != 'isBase' && column.dataIndex != 'productId'">{{ text }}</span>

                <span v-if="column.dataIndex == 'productId'">{{ product.name }}</span>

                <div v-if="column.dataIndex == 'action'">
                    <a-popconfirm title="Bạn có chắc chắn muốn xoá?" @confirm="deleteProductImage(record.id)">
                        <a-button type="primary" danger>Xoá</a-button>
                    </a-popconfirm>
                </div>

                <div v-if="column.dataIndex == 'publish'">
                    <PublishStatus type="active" v-if="record.publish == true" /><span v-if="record.publish == true">
                    </span>
                    <PublishStatus type="inactive" v-if="record.publish == false" /><span v-if="record.publish == false">
                    </span>
                </div>

                <div v-if="column.dataIndex == 'isBase'">
                    <PublishStatus type="active" v-if="record.publish == true" />
                    <PublishStatus type="inactive" v-if="record.publish == false" />
                </div>
            </template>
        </a-table>
    </a-drawer>

    <!-- modal create image -->
    <a-modal :visible="openModalImage" title="Thêm/sửa sản phẩm" @ok="handleOkImage" @cancel="handleCancelImage">
        <a-form :model="image" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="Đường dẫn ảnh" name="url"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-input v-model:value="image.url" />
            </a-form-item>

            <a-form-item label="Trạng thái" name="publish" :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-radio-group v-model:value="image.publish">
                    <a-radio :style="radioStyle" :value="true">Active</a-radio>
                    <a-radio :style="radioStyle" :value="false">InActive</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="Đặt làm ảnh chính" name="isBase" :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-radio-group v-model:value="image.isBase">
                    <a-radio :style="radioStyle" :value="true">Có</a-radio>
                    <a-radio :style="radioStyle" :value="false">Không</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
  
<style></style>
  