<template>
    <div class="p-4 bg-white rounded-lg shadow animate-fade-in-down">
        <div class="flex justify-between pb-3 border-b-2">
            <div class="flex items-center">
                <span class="mr-3 whitespace-nowrap">Per page</span>
                <select
                    @change="getProducts(null)"
                    v-model="perPage"
                    class="relative block w-24 px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div>
                <input
                    v-model="search"
                    @change="getProducts(null)"
                    placeholder="Type to search products"
                    class="relative block w-48 px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                >
            </div>
        </div>
        <table class="w-full table-auto">
            <thead>
            <tr>
                <TableHeaderCell @click="sortProduct" :sort-field="sortField" :sort-direction="sortDirection"
                                 field="id" class="p-2 text-left border-b-2">#
                </TableHeaderCell>
                <TableHeaderCell @click="sortProduct" :sort-field="sortField" :sort-direction="sortDirection"
                                 field="" class="p-2 text-left border-b-2">Image
                </TableHeaderCell>
                <TableHeaderCell @click="sortProduct" :sort-field="sortField" :sort-direction="sortDirection"
                                 field="title" class="p-2 text-left border-b-2">Title
                </TableHeaderCell>
                <TableHeaderCell @click="sortProduct" :sort-field="sortField" :sort-direction="sortDirection"
                                 field="price" class="p-2 text-left border-b-2">Price
                </TableHeaderCell>
                <TableHeaderCell @click="sortProduct" :sort-field="sortField" :sort-direction="sortDirection"
                                 field="updated_at" class="p-2 text-left border-b-2">Last updated at
                </TableHeaderCell>
                <TableHeaderCell field="action" class="p-2 text-left border-b-2">
                    Actions
                </TableHeaderCell>
            </tr>
            </thead>

            <tbody v-if="products.loading || !products.data.length">
            <tr>
                <td colspan="6">
                    <Spinner v-if="products.loading"/>
                    <p v-else class="py-8 text-center text-gray-700">
                        There are no products
                    </p>
                </td>
            </tr>
            </tbody>

            <tbody v-else>
            <tr v-for="(product, index) of products.data" class="animate-fade-in-down" :style="{'animation-delay': `${0.06*index}s`}">
                <td class="p-2 border-b-2">{{ product.id }}</td>
                <td class="p-2 border-b-2">
                    <img class="w-16" :src="product.image_url" :alt="product.title">
                </td>
                <td class="p-2 border-b-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {{ product.title }}
                </td>
                <td class="p-2 border-b-2">{{ product.price }}</td>
                <td class="p-2 border-b-2">{{ product.updated_at }}</td>
                <td class="p-2 border-b-2">
                    <div class="flex items-center justify-start">
                        <button
                            @click="editProduct(product)"
                            type="button"
                            class="flex items-center justify-between px-4 py-2 mb-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            <pencil-icon class="w-4 mr-1"/>
                            Edit
                        </button>
                        <button
                            @click="deleteProduct(product)"
                            type="button"
                            class="flex items-center justify-between px-4 py-2 mb-2 text-sm font-medium text-white bg-red-700 rounded-md focus:outline-none hover:bg-red-800 focus:ring-4 focus:ring-red-300 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                            <trash-icon class="w-4 mr-1"/>
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-1">
            <span class="items-center justify-between mt-5">
                Showing from {{ products.from }} to {{ products.to }}
            </span>
            <nav
                v-if="products.total > products.limit"
                class="relative z-0 inline-flex items-center justify-center -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
            >
                <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
                <a
                    v-for="(link, i) of products.links"
                    :key="i"
                    :disabled="!link.url"
                    href="#"
                    @click.prevent="getForPage($event, link)"
                    aria-current="page"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-medium border whitespace-nowrap"
                    :class="[
                    link.active
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    i === 0 ? 'rounded-l-md' : '',
                    i === products.links.length - 1 ? 'rounded-r-md' : '',
                    !link.url ? ' bg-gray-100 text-gray-700': ''
                ]"
                    v-html="link.label"
                >
                </a>
            </nav>
        </div>
        <!-- /Pagination -->
    </div>
</template>

<script setup>
import Spinner from '../../components/core/Spinner.vue'
import {ref, computed, onMounted} from 'vue'
import {PRODUCTS_PER_PAGE} from '../../constants.js'
import TableHeaderCell from "../../components/core/Table/TableHeaderCell.vue";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import {EllipsisVerticalIcon, PencilIcon, TrashIcon} from '@heroicons/vue/24/outline'
import store from '../../store'

const perPage = ref(PRODUCTS_PER_PAGE)
const search = ref('')
const products = computed(() => store.state.products)
const sortField = ref('updated_at')
const sortDirection = ref('desc')
const emit = defineEmits(['clickEdit'])

onMounted(() => {
    getProducts()
})

function getProducts(url = null) {
    store
        .dispatch('getProducts', {
            url,
            search: search.value,
            perPage: perPage.value,
            sort_field: sortField.value,
            sort_direction: sortDirection.value,
        })
}

function getForPage(ev, link) {
    if (!link.url || link.active) {
        return
    }
    getProducts(link.url)
}

function sortProduct(field) {
    if (sortField.value === field) {
        if (sortDirection.value === 'asc') {
            sortDirection.value = 'desc'
        } else {
            sortDirection.value = 'asc'
        }
    } else {
        sortField.value = field
        sortDirection.value = 'asc'
    }
    getProducts()
}

function editProduct(product) {
    emit('clickEdit' ,product)
}

function deleteProduct(product) {
    if(confirm('Are you sure to delete this product?')) {
        store
            .dispatch('deleteProduct', product.id)
            .then(() => {
                getProducts()
            })
    }
}

</script>
