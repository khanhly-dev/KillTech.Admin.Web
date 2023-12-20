<script>
import { PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons-vue';
import ProductApi from '../../services/items/ProductService'
import { message } from 'ant-design-vue';
import PublishStatus from '../../components/PublishStatus.vue'
import Bill from '../../services/items/BillService'

const columns = [
    {
        title: 'ID',
        dataIndex: 'productId',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
    },
    {
        title: 'Giảm giá',
        dataIndex: 'discount',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
    },
];

export default {
    data() {
        return {
            orderRes: {},
            orderList: [],
            keyword: '',
            currentPage: 1,
            columns,
            openModal: false,
            curentOrder: {}
        }

    },
    methods: {
        async getListOrder() {
            var param = {
                PageNumber: 1,
                PageSize: 10,
                Keyword: this.keyword
            }
            const res = await Bill.GetOrder(param);
            if (res != null) {
                this.orderRes = res.data
                this.orderList = res.data.items;
            }
        },
        showModal(order) {
            this.openModal = true
            this.curentOrder = order;
        },
        async handleOk() {
            this.openModal = false;
            if (this.curentOrder.status == 0) {
                message.info('Đơn đặt hàng này đã được hoàn thành!');
                return
            }
            var param = {
                orderId: this.curentOrder.id
            }
            try {
                var res = await Bill.CreateBill(param);
                await this.getListOrder();
                message.info(res.message);
            } catch (error) {
                messageApi.info('Hoàn tất đơn thất bại!');
            }
        },

        handleCancel() {
            this.openModal = false;
        },
    },
    async created() {
        await this.getListOrder();
    },
    components: {
        PublishStatus,
        InboxOutlined,
        UploadOutlined
    },
}
</script>

<template>
    <h2>Đơn đặt hàng</h2>
    <a-col style="width: 50%;">
        <a-input-search v-model:value="keyword" placeholder="Tìm kiếm" enter-button @search="getListOrder()" />
    </a-col>
    <br>
    <a-row :gutter="16">
        <a-col class="gutter-row" style="width: 20%;">
            <a style="color: black;" v-for="item in orderList" @click="showModal(item)">
                <div class="gutter-box shadow order-box">
                    <h3 style="color: red;">Click để xem chi tiết</h3>
                    <b>Tên khách hàng: </b><span>{{ item.name }}</span><br>
                    <b>SĐT: </b><span>{{ item.phone }}</span><br>
                    <b>Địa chỉ: </b><span>{{ item.address }}</span><br>

                    <b>Phương thức thanh toán: </b>
                    <span v-if="item.paymentMethod == 1">COD</span>
                    <span v-if="item.paymentMethod == 2">Chuyển khoản</span>
                    <br>

                    <b>Ghi chú: </b><span>{{ item.note }}</span><br>
                    <b>Tổng tiền: </b><span>{{ item.price }}</span><br>
                    <b>Giảm giá: </b><span>{{ item.discount }}</span><br>
                    <b>Thành tiền: </b><span>{{ item.totalPrice }}</span><br>

                    <b>Trạng thái: </b>
                    <span v-if="item.status == 2" style="color: rgb(219, 181, 12);">Đang chờ xử lý</span>
                    <span v-if="item.status == 0" style="color: rgb(17, 172, 12);">Đã hoàn thành</span>
                    <br>
                </div>
            </a>
        </a-col>
    </a-row>
    <br>
    <a-row>
        <a-pagination v-if="orderList != null && orderList != undefined && orderList.length > 0"
            v-model:current="currentPage" :total="orderRes.totalCount" show-less-items style="float: right;"
            @change="GetOrder()" />
    </a-row>

    <a-modal :visible="openModal" title="Chi tiết đơn hàng" @ok="handleOk" @cancel="handleCancel" style="width: 1000px;">
        <b>Tên khách hàng: </b><span>{{ curentOrder.name }}</span><br>
        <b>SĐT: </b><span>{{ curentOrder.phone }}</span><br>
        <b>Địa chỉ: </b><span>{{ curentOrder.address }}</span><br>
        <b>Phương thức thanh toán: </b><span>{{ curentOrder.paymentMethod }}</span><br>
        <b>Ghi chú: </b><span>{{ curentOrder.note }}</span><br>
        <b>Tổng tiền: </b><span>{{ curentOrder.price }}</span><br>
        <b>Giảm giá: </b><span>{{ curentOrder.discount }}</span><br>
        <b>Thành tiền: </b><span>{{ curentOrder.totalPrice }}</span><br>
        <b>Trạng thái: </b><span>{{ curentOrder.status }}</span><br>
        <a-table :columns="columns" :data-source="curentOrder.listProducts" bordered class="basic-table"
            :pagination="false">
        </a-table>

        <template #footer>
            <a-button key="back" @click="handleCancel">Trở lại</a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Hoàn tất đơn đặt hàng</a-button>
        </template>
    </a-modal>
</template>
  
<style>
.shadow {
    -moz-box-shadow: 0 0 3px #949090;
    -webkit-box-shadow: 0 0 3px #949090;
    box-shadow: 0 0 3px #949090;
}

.order-box {
    padding: 10px;
    font-size: 17px;
}

.order-box:hover {
    -moz-box-shadow: 0 0 10px #949090;
    -webkit-box-shadow: 0 0 3px #949090;
    box-shadow: 0 0 10px #949090;
    transition: 200ms;
}
</style>
  