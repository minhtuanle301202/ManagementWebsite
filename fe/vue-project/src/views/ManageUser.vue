<template>
    <div class="manage-user">
        <a-space :size="20" direction="vertical">
            <a-typography-title :level="3">
                Trang quản lý người dùng
            </a-typography-title>

            <a-table
                :columns="columns"
                :data-source="dataSource"
                :loading="loading"
                :pagination="{pageSize: 4}"
                row-key="id"
            >
                <template 
                    #customFilterDropdown = "{ setSelectedKeys, selectedKeys, confirm, clearFilters, column}"
                >
                    <div style="padding: 8px">
                        <a-input 
                            ref="searchInput"
                            :placeholder="`Tìm kiếm`"   
                            :value="selectedKeys[0]"
                            style="
                                width: 188px;
                                margin-bottom:  8px;
                                display: block;
                            "
                        @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                        @pressEnter="handleSearch(selectedKeys,confirm, column.dataIndex)"
                        ></a-input>

                        <a-button
                            type="primary"
                            size="small"
                            style="
                                width: 90px;
                                margin-right: 8px;
                            "
                            @click="handleSearch(selectedKeys,confirm, column.dataIndex)"
                        >
                            <template #icon><search-outlined></search-outlined></template>
                            Search
                        </a-button>

                        <a-button
                            size="small"
                            style="
                                width: 90px;
                            "
                            @click="handleReset(clearFilters)"
                        >
                            Reset
                        </a-button>
                    </div>
                </template>

                <template #customFilterIcon="{ filtered }">
                    <search-outlined :style="{ color: filtered ? '#108ee9' : undefined}"></search-outlined>
                </template>

                

                <template #bodyCell="{ text,column,record }">
                    <template v-if="state.searchText && state.searchedColumn === column.dataIndex">
                        <template
                            v-for="(fragment, i) in text
                            .toString()
                            .split(new RegExp(`(?<=${state.searchText})|(?=${state.searchText})`, 'i'))"
                        >
                            <mark
                                v-if="fragment.toLowerCase() === state.searchText.toLowerCase()"
                                :key="i"
                                class="highlight"
                            >
                            {{ fragment }}
                            </mark>
                        <template v-else> {{ fragment }}</template>
                        </template>
                    </template>
                    <template v-else-if="column.key==='edit'">
                        <a @click="goToEditPage(record)">Chỉnh sửa</a>
                    </template>
                    <template v-else-if="column.key==='detail'">
                        <a @click="showDetail(record)">Xem thêm</a>
                    </template>
                </template>
        </a-table>
        </a-space>
    </div>


    <a-modal
        v-model:open="showModal"
        title="Chi tiết thông tin"
        :footer="null"
        @cancel="handleClose">
            <p><b>Số CCCD:</b> {{ selectedRecord?.cardId }}</p>
            <p><b>Họ và tên:</b> {{ selectedRecord?.fullName }}</p>
            <p><b>Ngày sinh:</b> {{ dayjs(selectedRecord?.dateOfBirth).format('DD/MM/YYYY') }}</p>
            <p><b>Giới tính:</b> {{ selectedRecord?.gender }}</p>
            <p><b>Quê quán:</b> {{ selectedRecord?.placeOfOrigin }}</p>
            <p><b>Nơi thường trú:</b> {{ selectedRecord?.placeOfResidence }}</p>
            <p><b>Email:</b> {{ selectedRecord?.email }}</p>
            <p><b>Số điện thoại:</b> {{ selectedRecord?.phone }}</p>
</a-modal>

</template>

<script setup>
import {ref,onMounted,computed,reactive} from 'vue';
import { getAllUsers } from '@/API';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { SearchOutlined } from '@ant-design/icons-vue';


const router = useRouter();
const state = reactive({
    searchText: '',
    searchedColumn: '',
  });
const searchInput = ref();


const columns = [
    {
        title: 'Số CCCD',
        dataIndex: 'cardId',
        key:'cardId',
        width: 150,
        customFilterDropdown: true,
        onFilter: (value,record) => record.cardId.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visable => {
            if (visable) {
                setTimeout(() => {
                    searchInput.value.focus();
                },100)
            }
        }
    },
    {
        title: 'Họ và tên',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 230,
        customFilterDropdown: true,
        onFilter: (value,record) => record.fullName.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visable => {
            if (visable) {
                setTimeout(() => {
                    searchInput.value.focus();
                },100)
            }
        }
    },
  
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 330
    },
    {
        title: 'Số điện thọai',
        dataIndex: 'phone',
        key:'phone',
        width:180
    },
    {
        title: 'Chi tiết thông tin',
        key:'detail',
        width: 200
    },
    {
        title: 'Chỉnh sửa',
        key: 'edit',
        width:140
    },
];

const selectedRecord = ref(null);
const showModal = ref(false);

const showDetail = (record) => {
    selectedRecord.value = record;
    showModal.value = true;
};

const handleClose = () => {
    showModal.value = false;
};



const loading = ref(false);
const dataSource = ref([]);



onMounted(async () => {
    loading.value = true;
    try {
        const data = await getAllUsers();
        dataSource.value = data;
    } catch (err) {
        console.log(err);
    } finally {
        loading.value = false;
    }
})

const handleSearch = (selectedKeys,confirm,dataIndex) => {
    confirm();
    state.searchText = selectedKeys[0];
    state.searchedColumn = dataIndex;
}

const handleReset = clearFilters => {
    clearFilters({
        confirm: true
    });
    state.searchText = '';
}


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
.ant-modal-header .ant-modal-title {
    font-size: 18px;
}

.ant-modal-body p {
    font-size: 15px;
}

.manage-user .ant-table-thead .ant-table-cell {
    font-size: 16px;
    font-weight: 600 !important;
}

.manage-user .ant-table-thead .ant-table-column-title {
    font-size: 16px;
    font-weight: 600 !important;
}

.manage-user .ant-table-row .ant-table-cell {
    font-size: 14.5px;
}

.manage-user {
    margin-left: 20px;
}
</style>

