<script>
import {
    UserOutlined,
    TeamOutlined,
} from '@ant-design/icons-vue';
import { RouterView } from 'vue-router'

export default {
    data() {
        return {

        };
    },
    methods: {

    },
    components: {

    },
}
</script>

<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div style="padding: 10px; text-align: center;">
                <h2 style="width: 100%;  color: #fff;">KILLTECH ADMIN</h2>
                <hr>
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <user-outlined />
                            <span>Danh mục</span>
                        </span>
                    </template>
                    <a-menu-item key="3"> <router-link to="/category">Phân loại sản phẩm</router-link></a-menu-item>
                    <a-menu-item key="4"> <router-link to="/product">Sản phẩm</router-link></a-menu-item>
                    <a-menu-item key="5"> <router-link to="/tag">Tag sản phẩm</router-link></a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0" />
            <a-layout-content style="margin: 0 16px">
                <br>
                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <RouterView />
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                @Công ty cổ phần công nghệ Kill Tech
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<style scoped>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>
