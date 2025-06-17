<template>
    <div class="app-header">
        <a-image
            :width="60"
            src="https://icolor.vn/wp-content/uploads/2024/07/Logo-cong-an-png-.jpg"
        >
        </a-image>
        <a-typography-title >Trang quản lý</a-typography-title>
        <a-space>
            <a-badge :count="numberOfNotifications">
                <BellOutlined 
                    :style="{ fontSize: '24px' } "
                    @click="showDrawer"
                    ></BellOutlined>
            </a-badge>
            <a-tooltip placement="bottom" title="Đăng xuất">
                <LogoutOutlined
                        :style="{ fontSize: '24px' } "
                        @click="handleLogout"
                        />
            </a-tooltip>
        </a-space>
        <a-drawer
            title="Thông báo"
            placement="right"
            :open="openDrawer"
            @close="onClose"
            maskClosable
        >
            <a-list :data-source="notifications" #renderItem="{item}">
                <a-list-item class="list-item">
                    <p>{{ item.message }}</p> 
                    <p>Cập nhật vào lúc: {{ dayjs(item.createdAt).format('DD/MM/YYYY HH:mm') }}</p>
                </a-list-item>  
            </a-list>
        </a-drawer>
    </div>
</template>
<script setup>
import { BellOutlined,MailOutlined,LogoutOutlined } from '@ant-design/icons-vue';
import {ref,onMounted} from 'vue';
import {getAllNotifications,logout } from '@/API';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const router = useRouter();
const notifications = ref([]);
const openDrawer = ref(false);
const numberOfNotifications = ref(0);
const showDrawer = () => {
    numberOfNotifications.value = 0;
    localStorage.setItem("currentTotal",numberOfNotifications.value); 
    openDrawer.value = true;
}

const onClose = () => {
    openDrawer.value = false;
}

const handleLogout = async () => {
    try {
        const res = await logout();
        router.push({path: '/login'});
    } catch(err) {
        console.log(err);
    }
}
 
onMounted(async () => {
    const data = await getAllNotifications();
    const notificationsData = data.notifications;
    if (!localStorage.getItem("currentTotal")) {
        numberOfNotifications.value = notificationsData.length;
        localStorage.setItem("currentTotal",numberOfNotifications.value);
        localStorage.setItem("oldTotal",numberOfNotifications.value); 
    } else {
        const oldTotal = localStorage.getItem("oldTotal");
        numberOfNotifications.value = notificationsData.length - oldTotal;
        localStorage.setItem("oldTotal",notificationsData.length); 
    }
    notifications.value = data.notifications;
})

</script>

<style>
.ant-space-item .anticon-logout {
    margin-left: 20px;
    margin-right: 10px;
    
}
</style>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px 4px 12px;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.list-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-bottom:1px solid #d5d5d5 ;
    padding: 12px 12px;
}
</style>