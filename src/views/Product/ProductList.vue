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
export default {
    data() {
        return {
            keyword: '',
            columns,
            productList: {
                items: []
            },
            currentPage: 1,
            openModal: false,
            productProduct: {},
            parentProductOptions: []
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
                this.parentProductOptions = [
                    { value: 0, label: 'Không có' },
                    ...data.data
                ]
            }
        },

        showModal(type, record) {
            this.openModal = true;
            if (type == 'create') {
                this.productProduct = {}
            }
            if (type == 'update') {
                this.productProduct = { ...record }
            }

        },

        createProduct() {
            var param = {
                ProductProduct: { ...this.productProduct }
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
                ProductProduct: { ...this.productProduct }
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
            console.log(productId)
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
            if (this.productProduct.id == null) {
                this.createProduct()
            }
            //update
            else {
                this.updateProduct();
            }
        },

        handleCancel() {
            this.openModal = false;
        },

        filterOption(input, option) {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
                        <a-button type="default" >Thêm ảnh</a-button>
                    </div>

                    <div v-if="column.dataIndex == 'publish'">
                        <PublishStatus type="active" v-if="record.publish == true"/><span v-if="record.publish == true"> Active</span>
                        <PublishStatus type="inactive" v-if="record.publish == false"/><span v-if="record.publish == false"> Inactive</span>
                    </div>
                </template>
            </a-table>
            <br>
            <a-pagination v-if="productList != null && productList != undefined && productList.items.length > 0"
                v-model:current="currentPage" :total="productList.totalCount" show-less-items style="float: right;"
                @change="GetProduct(currentPage, 10)" />
        </a-col>
    </a-row>

    <!-- modal  -->
    <a-modal :visible="openModal" title="Basic Modal" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="productProduct" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="Tên danh mục" name="name"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-input v-model:value="productProduct.name" />
            </a-form-item>

            <a-form-item label="Tên danh mục" name="name"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-radio-group v-model:value="productProduct.publish">
                    <a-radio :style="radioStyle" :value="true">Active</a-radio>
                    <a-radio :style="radioStyle" :value="false">InActive</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="Danh mục cha" name="paretnId"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-select v-model:value="productProduct.paretnId" show-search :options="parentProductOptions"
                    :filter-option="filterOption" @change="parentCategroyChange">
                </a-select>
            </a-form-item>

            <a-form-item label="Icon hiển thị" name="paretnId">
                <a-input v-model:value="productProduct.keyIcon" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
  
<style></style>
  