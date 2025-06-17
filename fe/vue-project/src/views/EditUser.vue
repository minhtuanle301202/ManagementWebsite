<template>
    <div class="edit-user">
        <a-space :size="20" style="margin-left: 200px;" direction="vertical">
        <a-typography-title :level="4" style="margin-left: 100px ;">Chỉnh sửa người dùng</a-typography-title>
        <a-form
            ref="formInforRef"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span:18  }"
            layout="horizontal"
            style="width: 700px"
            :rules="rulesFormInfor"
            :model="formInfor"
        >
        <a-form-item label="Số CCCD" name="cardId">
                <a-input v-model:value="formInfor.cardId" readonly></a-input>
            </a-form-item>

            <a-form-item label="Họ và tên" name="fullName">
                <a-input v-model:value="formInfor.fullName" readonly></a-input>
            </a-form-item>

            <a-form-item label="Ngày sinh" name="dateOfBirth" >
                <a-date-picker 
                v-model:value="formInfor.dateOfBirth"
                placeholder="Chọn ngày sinh"
                 type="date"
                 style="width: 100%"
                ></a-date-picker>
            </a-form-item>

            <a-form-item label="Giới tính" name="gender"> 
                <a-select 
                    v-model:value="formInfor.gender"
                    placeholder="Chọn giới tính">
                    <a-select-option value="Nam"></a-select-option>
                    <a-select-option value="Nữ"></a-select-option>                
                </a-select>
            </a-form-item>

            <a-form-item label="Quê quán" required>
                <div class="inline">
                    <a-form-item
                        name="province1"
                        :rules="[{ required: true, message: 'Chọn Tỉnh/Thành' }]"
                        style="width: 164px;"
                    
                    >
                    <a-select
                        v-model:value="formInfor.province1"
                        placeholder="Tỉnh/Thành"
                        :options="provinces"
                        @change="onProvinceChange('1', $event)"
                    />
                    </a-form-item>

                    <a-form-item
                        name="district1"
                        :rules="[{ required: true, message: 'Chọn Quận/Huyện' }]"
                        style="width: 164px;"
                    >
                    <a-select
                        v-model:value="formInfor.district1"
                        placeholder="Quận/Huyện"
                        :options="districts"
                        :disabled="!formInfor.province1"
                        @change="onDistrictChange('1', $event)"
                    />
                    </a-form-item>

                    <a-form-item
                    name="ward1"
                    :rules="[{ required: true, message: 'Chọn Phường/Xã' }]"
                    style="width: 164px;"
                    >
                    <a-select
                        v-model:value="formInfor.ward1"
                        placeholder="Phường/Xã"
                        :options="wards"
                        :disabled="!formInfor.district1"
                    />
                    </a-form-item>
                </div>
            </a-form-item>

            <a-form-item label="Nơi thường trú"  required >
                <div class="inline">
                    <a-form-item
                        name="province2"
                        :rules="[{ required: true, message: 'Chọn Tỉnh/Thành' }]"
                        style="width: 164px;"
                    
                    >
                    <a-select
                        v-model:value="formInfor.province2"
                        placeholder="Tỉnh/Thành"
                        :options="provinces"
                        @change="onProvinceChange('2', $event)"
                    />
                    </a-form-item>

                    <a-form-item
                        name="district2"
                        :rules="[{ required: true, message: 'Chọn Quận/Huyện' }]"
                        style="width: 164px;"
                    >
                    <a-select
                        v-model:value="formInfor.district2"
                        placeholder="Quận/Huyện"
                        :options="districts2"
                        :disabled="!formInfor.province2"
                        @change="onDistrictChange('2', $event)"
                    />
                    </a-form-item>

                    <a-form-item
                    name="ward2"
                    :rules="[{ required: true, message: 'Chọn Phường/Xã' }]"
                    style="width: 164px;"
                    >
                    <a-select
                        v-model:value="formInfor.ward2"
                        placeholder="Phường/Xã"
                        :options="wards2"
                        :disabled="!formInfor.district2"
                    />
                    </a-form-item>
                </div>
    </a-form-item>

            <a-form-item label="Số điện thoại" name="phone">
                <a-input v-model:value="formInfor.phone" readonly>
                </a-input>
            </a-form-item>

            <a-form-item label="Email" name="email">
                <a-input v-model:value="formInfor.email" readonly>
                </a-input>
            </a-form-item>

            <a-form-item label="Vùng quản lý" name="points" required>
                <a-input type="hidden"/>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <a-button type="primary" @click="openMap">Chọn vùng trên bản đồ</a-button>
                    <span :style="{ color: 'green' }" v-show="formInfor.points.length === 5">
                        ✓ Đã chọn vùng
                    </span>
                </div>
             </a-form-item>

             <a-form-item :wrapper-col="{ offset: 6, span:16 }">
                <a-button type="primary" @click="onSubmitFormInfor">Hoàn thành</a-button>
             </a-form-item>
        </a-form>
    </a-space>
    </div>
</template>

<script setup>
import { ref,reactive,onMounted,watch,computed} from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { getProvinces,getDistricts,getWards,getUserByCardId,updateUser } from '@/API';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';


const route = useRoute();
const router = useRouter();

const formInforRef = ref();
const formInfor = reactive({
    cardId: null,
    fullName: null,
    dateOfBirth: null,
    gender: null,
    ward1:null,
    district1:null,
    province1:null,
    ward2:null,
    district2:null,
    province2:null,
    phone:null,
    email:null,
    points: []
});

const validatePoints =  (_,value) => {
    if (formInfor.points.length < 5) {
        return Promise.reject('Vui lòng chọn vùng quản lý');
    } 

    return Promise.resolve();
}

const rulesFormInfor = {
    cardId: [
        { required: true, message: 'Vui lòng nhập Số CCCD',trigger: 'blur' },
        { len: 12, message: 'Số CCCD phải chứa 12 chữ số' , trigger: 'blur'},
        { pattern: /^[0-9]+$/, message: 'Số CCCD chỉ được chứa các chữ số',trigger:'blur' }
    ],
    fullName: [
        { required: true, message: 'Vui lòng nhập Họ và tên',trigger:'blur'}
    ],
    dateOfBirth: [
        {required: true,message: 'Vui lòng chọn ngày sinh', trigger:'change', type: 'object'}
    ],
    gender: [
        { required: true, messsage:'Vui lòng chọn giới tính', trigger: 'change'}
    ],
    phone: [
        {required: true, message: 'Vui lòng nhập Số điện thại', trigger: 'blur'},
        { len: 10, message: 'Số điện thoại phải chứa 10 chữ số' , trigger: 'blur'},
        { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa các chữ số',trigger:'blur' }
    ],
    email: [
        { required: true, message: 'Vui lòng nhập email', trigger: 'blur'},
        { type: 'email', message: 'Email không đúng định dạng', trigger: 'blur'}
    ],
    points: [
        { required: true, validator: validatePoints, trigger:'blur'}
    ]
};


const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const districts2 = ref([]);
const wards2 = ref([]);


onMounted(async () => {
    const data = await getProvinces();
    provinces.value = data.map(p=> ({label: p.name, value: p.code}));

    if (router.options.history.state.from === 'edit-user-map') {
        if (localStorage.getItem('formInfor')) {
            Object.assign(formInfor, JSON.parse(localStorage.getItem('formInfor')));
            console.log(formInfor.points);
            if (formInfor.dateOfBirth) {
                formInfor.dateOfBirth = dayjs(formInfor.dateOfBirth);
            }
            if (formInfor.province1) {
                getDistrictOPtions('1',formInfor.province1);
            } 

            if (formInfor.district1) {
                getWardOptions('1',formInfor.district1);
            }

            if (formInfor.province2) {
                getDistrictOPtions('2',formInfor.province2);
            } 

            if (formInfor.district2) {
                getWardOptions('2',formInfor.district2);
            }
        }
    } else {
        const user = await getUserByCardId(route.params.cardId);
        const { cardId, fullName, dateOfBirth,gender, email, phone, points } = user;
        Object.assign(formInfor,{ cardId, fullName, dateOfBirth,gender, email, phone, points });
        if (formInfor.dateOfBirth) {
            formInfor.dateOfBirth = dayjs(formInfor.dateOfBirth);
        }
        const partsOrigin = user.placeOfOrigin.split(',').map(part => part.trim());    
        const [wardOrigin,districtOrigin,provinceOrigin] = partsOrigin;
        const partsResidence = user.placeOfResidence.split(',').map(part => part.trim());
        const [wardResidence,districtResidence,provinceResidence] = partsResidence;

        for (const p of provinces.value) {
            if (p.label === provinceOrigin) {
                formInfor.province1 = p.value;
                await getDistrictOPtions('1',p.value);
                break;
            }
        }
        for (const d of districts.value) {
            if (d.label == districtOrigin) {
                formInfor.district1 = d.value;
                await getWardOptions('1',d.value);
                break;
            }
        }

        for (const w of wards.value) {
            if (w.label === wardOrigin) {
                formInfor.ward1 = w.value;
                break;
            }
        }

        for (const p of provinces.value) {
            if (p.label === provinceResidence) {
                formInfor.province2 = p.value;
                await getDistrictOPtions('2',p.value);
                break;
            }
        }
        for (const d of districts2.value) {
            if (d.label == districtResidence) {
                formInfor.district2 = d.value;
                await getWardOptions('2',d.value);
                break;
            }
        }

        for (const w of wards2.value) {
            if (w.label === wardResidence) {
                formInfor.ward2 = w.value;
                break;
            }
        }
    }
})

const getDistrictOPtions = async (type,provinceCode) => {
    if (type === '1') {
        try {
            const data = await getDistricts(provinceCode);
            districts.value = data.districts.map(d=> ({label: d.name, value: d.code}));
        } catch(err) {
            console.log(err);
        }
    } else {
        try {
            const data = await getDistricts(provinceCode);
            districts2.value = data.districts.map(d=> ({label: d.name, value: d.code}));
        } catch(err) {
            console.log(err);
        }
    }
} 


const getWardOptions = async (type,districtCode) => {
    if (type === '1') {
        try {
            const data = await getWards(districtCode);
            wards.value = data.wards.map(w => ({label: w.name, value: w.code}));
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const data = await getWards(districtCode);
            wards2.value = data.wards.map(w => ({label: w.name, value: w.code}));
        } catch (err) {
            console.log(err);
        }
    }
 }


 const onProvinceChange = async (type,provinceCode) => {
    
    if (type === '1') {
        formInfor.district1 = null;
        formInfor.ward1 = null;
    } else {
        formInfor.district2 = null;
        formInfor.ward2 = null;
    }
    getDistrictOPtions(type,provinceCode);
}

const onDistrictChange = async (type,districtCode) => {
    if (type === '1') {
        formInfor.ward1 = null;
    } else {
        formInfor.ward2 = null;
    }
    getWardOptions(type,districtCode);
}

const openMap = () => {
    localStorage.setItem('formInfor',JSON.stringify(formInfor));
    router.push({
        path: '/create-polygon',
        query: {
            cardId: formInfor.cardId
        }
    })
}

const getLocationName = (provinceCode,districtCode,wardCode,type) => {
    let provinceName;
    let districtName;
    let wardName;

    let districtsArr;
    let wardsArr;

    if (type === 1) {
        districtsArr = districts.value;
        wardsArr = wards.value;
    } else {
        districtsArr = districts2.value;
        wardsArr = wards2.value;
    }
    for (const p of provinces.value) {
        if (p.value === provinceCode) {
            provinceName = p.label;
            break;
        } 
    } 
    for (const d of districtsArr) {
        if (d.value === districtCode) {
            districtName = d.label;
            break;
        }
    }

    for (const w of wardsArr) {
        if (w.value === wardCode) {
            wardName = w.label;
            break;
        }
    }

    return `${wardName}, ${districtName}, ${provinceName}`;
}

const onSubmitFormInfor = () => {
    formInforRef.value.validate().then( async () => {
        
        const placeOfOrigin = getLocationName(formInfor.province1,formInfor.district1,formInfor.ward1,1);
        const placeOfResidence = getLocationName(formInfor.province2,formInfor.district2,formInfor.ward2,2);
        const user = {
            cardId: formInfor.cardId,
            fullName: formInfor.fullName,
            dateOfBirth: formInfor.dateOfBirth,
            gender: formInfor.gender,
            placeOfOrigin,
            placeOfResidence,
            points: formInfor.points,
            email: formInfor.email,
            phone: formInfor.phone
        }
        console.log(user.gender);
        const key = 'edit';
        try {
            const res = await updateUser(formInfor.cardId,user);
            message.loading({content: 'Đang xử lý...',key});
            setTimeout(() => {
                    message.success({
                    content: res.message,
                    key,
                    duration: 2,
                    class: 'status-message'
                });
            },2000);

            setTimeout(() => {
                localStorage.removeItem('formInfor');
                formInforRef.value.resetFields();
                router.push({path:'/manage-user'});
                        },4000);
        } catch (err) {
            message.loading({content: 'Đang xử lý...',key});
                setTimeout(() => {
                    message.error({
                    content: err.response.data.message,
                    key,
                    duration: 3,
                    class: 'status-message'
                })
            },2000);
        }
    })
}

</script>

<style scoped>

.inline {
    display: flex;
    gap:16px;
}

.ant-input-affix-wrapper {
    padding: 6px 12px !important;
    font-size: 14px;
}

</style>