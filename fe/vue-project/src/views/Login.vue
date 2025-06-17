<template>
<div class="container">
    <div class="login-container">
        <div class="title">
            <h1>Trang quản trị</h1>
        </div>

        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <div class="form-label" for="username">
                    Tên đăng nhập
                </div>
                <input
                    type="username"
                    id="username"
                    v-model="form.username"
                    class="form-input"
                    placeholder="Nhập tên đăng nhập"
                    @blur="validateUsername"
                >

                <div class="error-message" :class="{ show: errors.username }">
                    {{ errors.username }}
                </div>
            </div>

                <div class="form-group">
                    <label class="form-label" for="password">Mật khẩu</label>
                    <input 
                        type="password" 
                        id="password"
                        v-model="form.password"
                        class="form-input"
                        placeholder="Nhập mật khẩu"
                        @blur="validatePassword"
                    >
                    <div class="error-message" :class="{ show: errors.password }">
                        {{ errors.password }}
                    </div>
                </div>


            <button type="submit"
                    class="login-button"
                    :disabled="isLoading"
            >
                {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
        </form>
    </div>
</div>

</template>

<script setup>
import { reactive,ref } from 'vue';
import {login} from '../API';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';


const router = useRouter();
const form = reactive({
    username: '',
    password: '',
});

const errors = reactive({
    username: '',
    password: ''
});

const isLoading = ref(false);

const validateUsername= () => {
    if (!form.username) {
        errors.username = 'Tên đăng nhập là bắt buộc';
        return false;
    } else {
        errors.username = '';
        return true;
    }
}

const validatePassword = () => {
    if (!form.password) {
        errors.password = 'Mật khẩu là bắt buộc';
        return false;
    } else if(form.password.length < 6) {
        errors.password = 'Mật khẩu bắt buộc phải có 6 kí tự trở lên';
        return false;
    } else {
        errors.password = '';
        return true;
    }
}


const handleLogin = async () => {
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    const key = 'login';


    if (isUsernameValid && isPasswordValid) {
         isLoading.value = true;

        try {
            const res = await login(form);
            message.loading({content: 'Đang xử lý...',key});
            setTimeout(() => {
                    message.success({
                    content: res.message,
                    key,
                    duration: 1,
                    class: 'status-message'
                });
                isLoading.value = false;
            },2000);

            setTimeout(() => {
            router.push({path: '/'});
            },3000);
        } catch(err) {
            message.loading({content: 'Đang xử lý...',key});
            setTimeout(() => {
                    message.error({
                    content: err.response.data.message,
                    key,
                    duration: 3,
                    class: 'status-message'
                    
                });
                isLoading.value = false;
            },2000);

        }
    } else {
        return;
    }
}

</script>
<style scoped>

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;
}


.login-container {
    background: rgba(255,255,255,0.95) ;
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    padding: 40px;
    width: 100%;
    max-width: 420px;
}

.title {
    text-align: center;
    margin-bottom: 40px;
}

.title h1 {
    color: #333;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
}


.form-group {
    color: #666;
    font-size: 16px;
    margin-bottom: 25px;
}

.form-label {
    display: block;
    color: #333;
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 16px;
}

.form-input {
    width: 100%;
    padding: 16px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: #f8f9fa;
}


.form-input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102,126,234,0.25);
}

.error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3 ease;
}

.error-message.show {
    opacity: 1;
    transform: translateY(0);
}

.login-button {
    width: 100%;
    background: linear-gradient(135deg,#667eea,#764ba2);
    color: white;
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.login-button {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rbba(102,126,234,0.3);
}

.login-button:active{
    transform: translateY(0);
}

.login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

</style>
