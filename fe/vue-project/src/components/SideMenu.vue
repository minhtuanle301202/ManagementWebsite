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

<style setup>
.side-menu {
    position: relative;
    z-index: 1;
}

.side-menu-vertical {
    height: 100%;
}
</style>