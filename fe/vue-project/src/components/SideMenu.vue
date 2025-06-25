<template>
    <div class="side-menu">
        <a-menu 
            class="side-menu-vertical"
            mode="vertical"
            :selectedKeys="[selectedKey]"
            @click="handleClick"
        >
            <a-menu-item key="/manage-user">
                <template #icon><AppstoreAddOutlined /></template>
                Quản lý người dùng
            </a-menu-item>

            <a-menu-item key="/create-user">
                <template #icon><UserOutlined /></template>
                Tạo người dùng mới
            </a-menu-item>

            <a-menu-item key="/locations">
                <template #icon> <EnvironmentOutlined />
                </template>
                Trạng thái giám sát
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script setup lang="ts">
import { AppstoreAddOutlined, ShopOutlined,ShoppingCartOutlined, UserOutlined,EnvironmentOutlined } from '@ant-design/icons-vue';
import { useRouter,useRoute } from 'vue-router';
import { ref,watch } from 'vue';

const router = useRouter();
const route = useRoute();

const selectedKey = ref(route.path);
const handleClick =({key}) => {
    router.push(key);
    selectedKey.value = key;
}

watch(() => route.path,(newPath,oldPath) => {
    selectedKey.value = newPath
})


</script>

<style>
.side-menu {
    position: relative;
    z-index: 1;
}

.side-menu-vertical {
    height: 100%;
}

.side-menu .ant-menu {
    border-right: 2px solid rgba(5, 5, 5, 0.06) !important ;
}

.side-menu .ant-menu .ant-menu-item .ant-menu-title-content {
    font-size: 15px;
}

.side-menu .ant-menu .ant-menu-item .ant-menu-item-icon {
    font-size: 17px;
}
</style>