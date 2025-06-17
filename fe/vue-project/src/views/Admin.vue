<template>
    <div class="container">
        <app-header></app-header>
        <div class="side-menu-and-page-content">
            <side-menu></side-menu>
            <page-content></page-content>    
        </div>
        <app-footer></app-footer>
    </div>
</template>
<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import SideMenu from '@/components/SideMenu.vue';
import PageContent from '@/components/PageContent.vue';
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
    }

    .side-menu-and-page-content {
        display: flex;
        flex:1;
    }
</style>

