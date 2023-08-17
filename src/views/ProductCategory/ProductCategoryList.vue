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
        title: 'Tên danh mục',
        dataIndex: 'name',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'publish',
    },
    {
        title: 'Tên danh mục cha',
        dataIndex: 'parentName',
    },
    {
        title: 'Icon hiển thị',
        dataIndex: 'keyIcon',
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
            categoryList: {
                items: []
            },
            currentPage: 1,
            openModal: false,
            productCategory: {},
            parentCategoryOptions: []
        }

    },
    methods: {
        async GetCategory(PageNumber, PageSize) {
            var param = {
                PageNumber: PageNumber,
                PageSize: PageSize,
                Keyword: this.keyword
            }
            const data = await ProductApi.GetCategoryPaging(param);
            if (data != null) {
                this.categoryList = data.data;
            }
        },

        async getListCategory() {
            const data = await ProductApi.GetListParent();
            if (data != null) {
                this.parentCategoryOptions = [
                    { value: 0, label: 'Không có' },
                    ...data.data
                ]
            }
        },

        showModal(type, record) {
            this.openModal = true;
            if (type == 'create') {
                this.productCategory = {}
            }
            if (type == 'update') {
                this.productCategory = { ...record }
            }

        },

        createCategory() {
            var param = {
                ProductCategory: { ...this.productCategory }
            }
            ProductApi.CreateCategory(param).then(x => {
                this.GetCategory(this.currentPage, 10)
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
            })
        },

        updateCategory() {
            var param = {
                ProductCategory: { ...this.productCategory }
            }
            ProductApi.UpdateCategory(param).then(x => {
                this.GetCategory(this.currentPage, 10)
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
            })
        },

        deleteCategory(categoryId) {
            console.log(categoryId)
            ProductApi.DeleteCategory(categoryId).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.GetCategory(this.currentPage, 10)
            });

        },

        handleOk() {
            this.openModal = false;
            //create
            if (this.productCategory.id == null) {
                this.createCategory()
            }
            //update
            else {
                this.updateCategory();
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
        await this.GetCategory(this.currentPage, 10);
        await this.getListCategory();
    },
    components: {
        PublishStatus,
    },
}
</script>

<template>
    <h2>Danh sách loại sản phẩm</h2>
    <a-row>
        <a-col style="width: 50%;">
            <a-input-search v-model:value="keyword" placeholder="Tìm kiếm" enter-button @search="GetCategory(1, 10)" />
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
            <a-table :columns="columns" :data-source="categoryList.items" bordered class="basic-table" :pagination="false">
                <template #bodyCell="{ column, text, record }">
                    <span v-if="column.dataIndex != 'publish'">{{ text }}</span>
                    <div v-if="column.dataIndex == 'action'">
                        <a-button type="primary" @click="showModal('update', record)">Cập nhật</a-button>
                        <a-popconfirm title="Bạn có chắc chắn muốn xoá?" @confirm="deleteCategory(record.id)">
                            <a-button type="primary" danger>Xoá</a-button>
                        </a-popconfirm>
                    </div>

                    <div v-if="column.dataIndex == 'publish'">
                        <PublishStatus type="active" v-if="record.publish == true"/><span v-if="record.publish == true"> Active</span>
                        <PublishStatus type="inactive" v-if="record.publish == false"/><span v-if="record.publish == false"> Inactive</span>
                    </div>
                </template>
            </a-table>
            <br>
            <a-pagination v-if="categoryList != null && categoryList != undefined && categoryList.items.length > 0"
                v-model:current="currentPage" :total="categoryList.totalCount" show-less-items style="float: right;"
                @change="GetCategory(currentPage, 10)" />
        </a-col>
    </a-row>

    <!-- modal  -->
    <a-modal :visible="openModal" title="Basic Modal" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="productCategory" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="Tên danh mục" name="name"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-input v-model:value="productCategory.name" />
            </a-form-item>

            <a-form-item label="Tên danh mục" name="name"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-radio-group v-model:value="productCategory.publish">
                    <a-radio :style="radioStyle" :value="true">Active</a-radio>
                    <a-radio :style="radioStyle" :value="false">InActive</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="Danh mục cha" name="paretnId"
                :rules="[{ required: true, message: 'Giá trị này là bắt buộc!' }]">
                <a-select v-model:value="productCategory.paretnId" show-search :options="parentCategoryOptions"
                    :filter-option="filterOption" @change="parentCategroyChange">
                </a-select>
            </a-form-item>

            <a-form-item label="Icon hiển thị" name="paretnId">
                <a-input v-model:value="productCategory.keyIcon" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
  
<style></style>
  