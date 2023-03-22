<template functional>
      <a-menu-item :key="props.item.path" v-if="!props.item.children && props.item.meta.type">
        <span>{{props.item.name}}</span>
      </a-menu-item>
      <a-sub-menu :key="props.item.path" v-else-if="props.item.meta.type">
            <span slot="title">
                <span>{{ props.item.name }}</span>
            </span>
            <menuTwo v-for="elm in props.item.children" :item="elm" :key="elm.key" />
      </a-sub-menu>
</template>
<script>
export default {
    name: 'menuTwo',
    props: {
        item: {}
    }
}
</script>