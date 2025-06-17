<template>
    <div class="locations">
        <a-space :size="20" direction="vertical">
            <a-typography-title :level="4">Bảng trạng thái giám sát</a-typography-title>
            <a-table
                :columns="columns"
                table-layout="fixed"
                :data-source="tableData"
                :pagination="{pageSize: 4}"
                :scroll="{ x: 'max-content' }"
                row-key="_id"
                :loading="loading"
                :customRow="(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' }
                    })" 
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

                <template #bodyCell="{ text, column }">
                    <span v-if="state.searchText && state.searchedColumn === column.dataIndex">
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
                    </span>
                </template>
            </a-table>
        </a-space>
    </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import { getAllMonitoringStatus } from '@/API';
import { useRouter } from 'vue-router';
import { SearchOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs'

const router = useRouter();
const state = reactive({
    searchText: '',
    searchedColumn: '',
  });
const loading = ref(false);
const tableData = ref([]);
const searchInput = ref();

const columns = [
    {
        title:'Số CCCD',
        dataIndex:'cardId',
        key: 'cardId',
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
    }   ,
    {
        title:'Họ và tên',
        dataIndex: 'fullName',
        key:'fullName',
        width: 200,
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
        title:'Vị trí',
        dataIndex: 'location',
        key:'location',
        width: 340

    },
    {
        title: 'Thời gian cập nhật vị trí gần nhất',
        dataIndex: 'lastUpdateLocationTime',
        key: 'lastUpdateLocationTime',
        width: 300,
        align: 'center',
        customRender: ({ text }) => {
            return text ? dayjs(text).format('HH:mm:ss DD/MM/YYYY') : ''
        }
    },
    {
        title: 'Thời gian xác thực khuôn mặt gần nhất',
        dataIndex: 'lastFaceVerifyTime',
        key: 'lastFaceVerifyTime',
        with: 300,
        align: 'center',
        customRender: ({ text }) => {
            return text ? dayjs(text).format('HH:mm:ss DD/MM/YYYY') : ''
        }
    }

];



onMounted(async () => {
    loading.value = true;
    try {
        const res = await getAllMonitoringStatus();
        tableData.value = res.map((item) => ({
            _id: item._id,
            cardId: item.user.cardId,
            fullName: item.user.fullName,
            location: `[${item.coordinates[0]}  ${item.coordinates[1]}]`,
            lastUpdateLocationTime: new Date(item.lastUpdateLocationTime).toLocaleString(),
            lastFaceVerifyTime: new Date(item.lastFaceVerifyTime).toLocaleString()
        }))
    } catch(err) {
        console.log(err);
    } finally {
        loading.value = false;
    }
});

const parseLocation = (locationStr) => {
    const cleaned = locationStr.replace('[', '').replace(']', '').trim();

    const parts = cleaned.split(/\s+/);

    if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        return { lat, lng }
    }
}

const handleRowClick =(record) => {
    const {lat,lng} = parseLocation(record.location)
    router.push({
        path: `/map/${record.cardId}`,
        query:{
            lat: lat,
            lng: lng
        } });  
}

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

</script>

<style>
.ant-table-cell {
  border-right: 1px solid #e4e4e4; 
  border-bottom: 1px solid #ededed !important;
}

.ant-table-thead > tr > th {
    font-size: 15px;
    font-weight: bold;
}

.ant-table-column-title {
    font-size: 14px;
    font-weight: bold;
}

.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}

</style>

