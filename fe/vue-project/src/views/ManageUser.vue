<template>
    <div class="manage-user">
        <a-space :size="20" direction="vertical">
            <a-typography-title :level="4">
                Trang quản lý người dùng
            </a-typography-title>

            <a-table
                :columns="columns"
                :data-source="pagedData"
                :loading="loading"
                :pagination="false"
                :scroll="{ x: 1800 }"
                row-key="id"
            >
                <template #bodyCell="{ column,record }">
                    <template v-if="column.key==='edit'">
                        <a @click="goToEditPage(record)">Chỉnh sửa</a>
                    </template>
                </template>
        </a-table>
        </a-space>
    </div>

    <a-pagination
        :current="currentPage"
        :pageSize="pageSize"
        :total="total"
        @change="onChangePage"
        class="pagination"
    ></a-pagination>
</template>

<script setup>
import {ref,onMounted,computed} from 'vue';
import { getAllUsers } from '@/API';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const router = useRouter();

const columns = [
    {
        title: 'Số CCCD',
        dataIndex: 'cardId',
        key:'cardId',
        width: 130
    },
    {
        title: 'Họ và tên',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 170
    },
    {
        title: 'Ngày sinh',
        dataIndex:'dateOfBirth',
        key:'dateOfBirth',
        customRender: ({text}) => {
            return dayjs(text).format('DD/MM/YYYY');
        },
        width: 110
    },
    {
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
        width: 110
    },
    {
        title: 'Quê quán',
        dataIndex: 'placeOfOrigin',
        key: 'placeOfOrigin',
        width: 400 
    },
    {
        title: 'Nơi thường trú',
        dataIndex: 'placeOfResidence',
        key: 'placeOfResidence',
        width: 400 
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 250
    },
    {
        title: 'Số điện thọai',
        dataIndex: 'phone',
        key:'phone',
        width:180
    },
    {
        title: 'Chỉnh sửa',
        key: 'edit',
        width:120
    }
];

const currentPage = ref(1);
const total=ref();
const pageSize = ref(5);

const loading = ref(false);
const dataSource = ref([]);

const onChangePage = (page) => {
    currentPage.value = page;
}

const pagedData = computed(() => {
    const start = (currentPage.value-1) * pageSize.value;
    return dataSource.value.slice(start,start+pageSize.value);
})

onMounted(async () => {
    loading.value = true;
    try {
        const data = await getAllUsers();
        dataSource.value = data;
        total.value = data.length;
    } catch (err) {
        console.log(err);
    } finally {
        loading.value = false;
    }
})


const goToEditPage = (record) => {
    const cardId = record.cardId;
    router.push({ path:`/edit-user/${cardId}`})
}
</script>

<style>
.ant-table-cell {
    border-left:1px solid #e9e9e9;
    border-top: 1px solid #e9e9e9;
}
</style>

<style scoped>
.pagination {
    margin-top: 25px;
    margin-left:5px;

}

</style>