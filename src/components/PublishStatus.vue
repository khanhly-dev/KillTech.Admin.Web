<script>
export default {
    props: ['type']
}
</script>

<template>
    <img src="src/assets/icon/yes.png" alt="" style="width: 15px;" v-if="type == 'active'">
    <img src="src/assets/icon/multiply.png" alt="" style="width: 15px;" v-if="type == 'inactive'">
</template>

<style scoped></style>
