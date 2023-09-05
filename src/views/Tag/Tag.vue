<script>
import { PlusOutlined } from '@ant-design/icons-vue';
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
        title: 'Tên sản phẩm',
        dataIndex: 'name',
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
            tagList: {
                items: []
            },
            currentPage: 1,
            openModal: false,
            tag: {},
            listProduct: [],
            productSelected: '',
            productNeedAddTag: [],
            selectedTag: {},
            isShowAddTag: false,
            tagOfProduct: []
        }

    },
    methods: {
        async getTag(PageNumber, PageSize) {
            var param = {
                PageNumber: PageNumber,
                PageSize: PageSize,
            }
            const data = await ProductApi.GetTag(param);
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
                Name: this.tagAdd
            }
            ProductApi.CreateTag(param).then(x => {
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
            ProductApi.CreateProductTag(param).then(x => {
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
            ProductApi.DeleteTag(productId).then(x => {
                if (x.statusCode == 0) {
                    message.success(x.message);
                }
                else {
                    message.error(x.message);
                }
                this.getTag(this.currentPage, 10)
            });
        },

        filterOption(input, option) {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },

        selectProduct(value) {
            debugger
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

        getTagByProduct(tag) {
            var param = {
                tagId: tag.id
            }
            ProductApi.GetProductByTag(param).then(x => {
                this.tagOfProduct = x.data
            });
        },

        SelectTag(item) {
            this.isShowAddTag = true;
            this.selectedTag = item;
            this.getTagByProduct(item)
        }
    },
    async created() {
        this.getProduct();
        await this.getTag(this.currentPage, 10);
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
                <a-row>
                    <a-col style="width: 50%;">
                        <a-input v-model:value="tagAdd" placeholder="Nhập tag cần thêm" />
                    </a-col>
                    <a-col style="width: 50%;">
                        <a-button type="primary" @click="createTag()">
                            <plus-outlined />Thêm
                        </a-button>
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
                        <a-pagination v-if="productList != null && productList != undefined && productList.items.length > 0"
                            v-model:current="currentPage" :total="productList.totalCount" show-less-items
                            style="float: right;" @change="GetProduct(currentPage, 10)" />
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

                <a-button v-for="item in tagOfProduct" disabled>{{ item.productName }}
                </a-button><br><br>
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
</template>
  
<style></style>
  