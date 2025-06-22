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
        width: 130,
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
        width: 170,
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
</style>

<style scoped>
.pagination {
    margin-top: 25px;
    margin-left:5px;

}

</style>