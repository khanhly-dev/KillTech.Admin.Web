<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import TagApi from '../../services/items/TagService'
import ProductApi from '../../services/items/ProductService'
import { message } from 'ant-design-vue';
import PublishStatus from '../../components/PublishStatus.vue'
import { CloseOutlined } from '@ant-design/icons-vue';
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Tên tag',
        dataIndex: 'name',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];

const tagCategoryColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Tên danh mục thẻ',
        dataIndex: 'name',
    },
    {
        title: 'Tên danh mục sản phẩm',
        dataIndex: 'productCategoryName',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];

export default {
    data() {
        return {
            tagAdd: '',
            columns,
            tagCategoryColumns,
            tagList: {
                items: []
            },
            currentPage: 1,
            currentPageCategory: 1,
            openModal: false,
            tag: {},
            listProduct: [],
            productSelected: '',
            productNeedAddTag: [],
            selectedTag: {},
            isShowAddTag: false,
            tagOfProduct: [],
            listProductCategory: [],
            listTagCategorySelect: [],
            tagCategorySelected: 0,
            listTagCategory: [],
            tagSearch: '',
            openModal: false,
            tagCategorySearch: '',
            productCategorySelected: 0,
            tagCategoryAdd:''
        }

    },
    methods: {
        async getTag(PageNumber, PageSize) {
            var param = {
                PageNumber: PageNumber,
                PageSize: PageSize,
                Keyword: this.tagSearch
            }
            const data = await TagApi.GetTag(param);
            if (data != null) {
                this.tagList = data.data;
            }
        },

        getProduct() {
            ProductApi.GetProductHashMap().then(x => {
                this.listProduct = x.data
            });
        },

        createTag() {
            if (this.tagAdd == null || this.tagAdd == '') {
                message.error('Tên tag không được để trống');
                return;
            }
            var param = {
                Name: this.tagAdd,
                TagCategory: this.tagCategorySelected
            }
            TagApi.CreateTag(param).then(x => {
                this.getTag(this.currentPage, 10)
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
            })
        },

        createProductTag() {
            if (this.productNeedAddTag == null || this.productNeedAddTag.length == 0) {
                message.error('Vui lòng thêm sản phẩm để gắn tag');
                return;
            }
            var param = {
                ProductId: [...this.productNeedAddTag.map(x => {
                    return x.value
                })],
                tagId: this.selectedTag.id
            }
            TagApi.CreateProductTag(param).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.productNeedAddTag = [];
                this.isShowAddTag = false
            })
        },

        deleteTag(productId) {
            TagApi.DeleteTag(productId).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.getTag(this.currentPage, 10)
            });
        },

        deleteProductTag(productTagId) {
            TagApi.DeleteProductTag(productTagId).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.getProductByTag(this.selectedTag)
            })
        },

        filterOption(input, option) {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },

        selectProduct(value) {
            var existProduct = this.tagOfProduct.map(x => {
                return x.productId
            });

            var prod = this.listProduct.find(x => x.value == value)
            if (this.productNeedAddTag.includes(prod)) {
                message.warn('Sản phẩm này đã được thêm vào danh sách');
            }
            else if (existProduct.includes(value)) {
                message.warn('Sản phẩm này đã được gắn tag');
            }
            else {
                this.productNeedAddTag.push(prod)
            }
        },

        removeProductAddTag(item) {
            const index = this.productNeedAddTag.indexOf(item);
            if (index > -1) {
                this.productNeedAddTag.splice(index, 1);
            }
        },

        getProductByTag(tag) {
            var param = {
                tagId: tag.id
            }
            TagApi.GetProductByTag(param).then(x => {
                this.tagOfProduct = x.data
            });
        },

        SelectTag(item) {
            this.isShowAddTag = true;
            this.selectedTag = item;
            this.getProductByTag(item)
        },

        async getTagCategory(PageNumber, PageSize) {
            var param = {
                PageNumber: PageNumber,
                PageSize: PageSize,
                Keyword: this.tagCategorySearch
            }
            const data = await TagApi.GetTagCategory(param);
            if (data != null) {
                this.listTagCategory = data.data;
            }
        },

        async getTagCategorySelect() {
            const data = await TagApi.GetTagCategorySelect();
            if (data != null) {
                this.listTagCategorySelect = data.data;
            }
        },

        createTagCategory() {
            var param = {
                Name: this.tagCategoryAdd,
                ProductCategory: this.productCategorySelected
            }
            TagApi.CreateTagCategory(param).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.getTagCategory(this.currentPageCategory, 10)
            })
        },

        deleteTagCategory(id) {
            TagApi.DeleteTagCategory(id).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.getTagCategory(this.currentPageCategory, 10)
            })
        },

        getListProductCategory() {
            ProductApi.GetListParent().then(data => {
                this.listProductCategory = data.data
            });
        },

        showModal() {
            this.openModal = true;
            this.getTagCategory(this.currentPageCategory, 10)
            thi
        },

        handleOk() {
            this.openModal = false;
            this.getTagCategorySelect()
        },

        handleCancel() {
            this.openModal = false;
            this.getTagCategorySelect()
        },
    },
    async created() {
        this.getProduct();
        await this.getTag(this.currentPage, 10);
        await this.getTagCategory(this.currentPageCategory, 10)
        this.getListProductCategory();
        await this.getTagCategorySelect();
    },
    components: {
        PublishStatus,
        CloseOutlined
    },
}
</script>

<template>
    <h2>Quản lý tag</h2>
    <a-row :gutter="16">
        <a-col class="gutter-row" :span="12">
            <div class="gutter-box">
                <a-row gutter="5">
                    <a-col :span="6">
                        <a-select v-model:value="tagCategorySelected" show-search style="width: 80%"
                            :options="listTagCategorySelect" :filter-option="filterOption" @focus="handleFocus"
                            @blur="handleBlur" @change="handleChange"></a-select>
                    </a-col>
                    <a-col :span="9">
                        <a-input v-model:value="tagAdd" placeholder="Nhập tag cần thêm" />
                    </a-col>
                    <a-col :span="3">
                        <a-button type="primary" @click="createTag()">
                            <plus-outlined />Thêm thẻ
                        </a-button>
                    </a-col>
                    <a-col :span="6">
                        <a-button type="primary" @click="showModal()">
                            <plus-outlined />Thêm danh mục thẻ
                        </a-button>
                    </a-col>
                </a-row>
                <br>
                <a-row>
                    <a-col :span="24">
                        <a-input-search v-model:value="tagSearch" placeholder="Tìm kiếm tag" enter-button
                            @search="getTag(currentPage, 10)" />
                    </a-col>
                </a-row>
                <br>
                <a-row>
                    <a-col style="width: 100%;">
                        <a-table :columns="columns" :data-source="tagList.items" bordered class="basic-table"
                            :pagination="false">
                            <template #bodyCell="{ column, text, record }">
                                <span>{{ text }}</span>
                                <div v-if="column.dataIndex == 'action'">
                                    <a-popconfirm title="Bạn có chắc chắn muốn xoá?" @confirm="deleteTag(record.id)">
                                        <a-button type="primary" danger>Xoá</a-button>
                                    </a-popconfirm>
                                    <a-button type="primary" @click="SelectTag(record)">Gắn tag</a-button>
                                </div>
                            </template>
                        </a-table>
                        <br>
                        <a-pagination v-if="tagList != null && tagList != undefined && tagList.items.length > 0"
                            v-model:current="currentPage" :total="tagList.totalCount" show-less-items style="float: right;"
                            @change="getTag(currentPage, 10)" />
                    </a-col>
                </a-row>
            </div>
        </a-col>
        <a-col class="gutter-row" :span="12" v-if="isShowAddTag">
            <div class="gutter-box">
                <h2>Gắn tag
                    <a-tag color="#108ee9" style="height: 30px; font-size: 20px; padding: 5px; border-radius: 8px;">
                        <b>{{ selectedTag.name }}</b>
                    </a-tag>cho sản phẩm
                </h2>
                <h3>- sản phẩm đã gắn thẻ
                    <a-tag color="#108ee9" style="height: 30px; font-size: 20px; padding: 5px; border-radius: 8px;">
                        <b>{{ selectedTag.name }}</b>
                    </a-tag>
                </h3>

                <a-button v-for="item in tagOfProduct">{{ item.productName }}
                    <a-popconfirm title="Bạn có chắc chắn muốn xoá?" @confirm="deleteProductTag(item.productTagId)">
                        <CloseOutlined />
                    </a-popconfirm>
                </a-button>
                <br><br>
                <a-select v-model:value="productSelected" show-search :options="listProduct" style="width: 100%;"
                    :filter-option="filterOption" @change="selectProduct">
                </a-select>
                <br><br>
                <a-button v-for="item in productNeedAddTag">{{ item.label }}
                    <CloseOutlined @click="removeProductAddTag(item)" />
                </a-button>
                <br><br>
                <a-button type="primary" @click="createProductTag">Gắn thẻ</a-button>
            </div>
        </a-col>
    </a-row>

    <a-modal :visible="openModal" title="Thêm/xoá danh mục thẻ" @ok="handleOk" @cancel="handleCancel" :width="1300">
        <a-row gutter="5">
            <a-col :span="6">
                <a-select v-model:value="productCategorySelected" show-search style="width: 80%" :options="listProductCategory"
                    :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur" @change="handleChange"></a-select>
            </a-col>
            <a-col :span="9">
                <a-input v-model:value="tagCategoryAdd" placeholder="Nhập tên danh mục tag cần thêm" />
            </a-col>
            <a-col :span="3">
                <a-button type="primary" @click="createTagCategory()">
                    <plus-outlined />Thêm danh mục thẻ
                </a-button>
            </a-col>
        </a-row>
        <br>

        <a-table :columns="tagCategoryColumns" :data-source="listTagCategory.items" bordered class="basic-table"
            :pagination="false">
            <template #bodyCell="{ column, text, record }">
                <span>{{ text }}</span>
                <div v-if="column.dataIndex == 'action'">
                    <a-popconfirm title="Bạn có chắc chắn muốn xoá?" @confirm="deleteTagCategory(record.id)">
                        <a-button type="primary" danger>Xoá</a-button>
                    </a-popconfirm>
                </div>
            </template>
        </a-table>
        <br>
        <a-pagination v-if="listTagCategory != null && listTagCategory != undefined && listTagCategory.items.length > 0"
            v-model:current="currentPageCategory" :total="listTagCategory.totalCount" show-less-items style="float: right;"
            @change="getTagCategory(currentPageCategory, 10)" />
        <br>
    </a-modal>
</template>
  
<style></style>
  