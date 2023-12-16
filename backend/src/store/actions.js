import axiosClient from "../axios.js";

export function getUser({commit}) {
    return axiosClient.get('/user')
        .then(({data}) => {
            commit('setUser', data)
            return data
        })
}

export function login({commit}, data) {
    return axiosClient.post('/login', data)
        .then(({data}) => {
            commit('setUser', data.user)
            commit('setToken', data.token)
            return data;
        })
}

export function logout({commit}) {
    return axiosClient.post('/logout')
        .then((response) => {
            commit('setToken', null)
            return response;
        })
}

export function getOrder({commit}, id) {
    return axiosClient.get(`/orders/${id}`)
}
export function getProduct({commit}, id) {
    return axiosClient.get(`/products/${id}`)
}
export function getOrderStatuses() {
    return axiosClient.get(`/get-order-statuses`)
}

export function getProducts({commit}, {url = null, search = '', perPage = 10, sort_field, sort_direction} = {}) {
    commit('setProducts', [true])
    url = url || '/products'
    return axiosClient.get(url, {
        params: {search, per_page: perPage, sort_field, sort_direction}
    })
        .then((response) => {
            commit('setProducts', [false, response.data])
        })
        .catch(() => {
            commit('setProducts', [false])
        })
}

export function createProduct({commit}, product) {
    if(product.image instanceof File) {
        const form = new FormData()
        form.append('title', product.title)
        form.append('image', product.image)
        form.append('description', product.description)
        form.append('price', product.price)

        product = form
    }

    return axiosClient.post('/products', product)
}

export function updateProduct({commit}, product) {
    const id = product.id

    if(product.image instanceof File) {
        const form = new FormData()
        form.append('title', product.title)
        form.append('image', product.image)
        form.append('description', product.description)
        form.append('price', product.price)
        form.append('_method', 'PUT')

        product = form
    } else {
        product._method = 'PUT'
    }

    return axiosClient.post(`/products/${id}}`, product)
}

export function deleteProduct({commit}, id) {
    return axiosClient.delete(`/products/${id}}`)
}

export function getOrders({commit}, {url = null, search = '', perPage = 10, sort_field, sort_direction} = {}) {
    commit('setOrders', [true])
    url = url || '/orders'
    return axiosClient.get(url, {
        params: {search, per_page: perPage, sort_field, sort_direction}
    })
        .then((response) => {
            commit('setOrders', [false, response.data])
        })
        .catch(() => {
            commit('setOrders', [false])
        })
}



export function getUsers({commit}, {url = null, search = '', perPage = 10, sort_field, sort_direction} = {}) {
    commit('setUsers', [true])
    url = url || '/users'
    return axiosClient.get(url, {
        params: {search, per_page: perPage, sort_field, sort_direction}
    })
        .then((response) => {
            commit('setUsers', [false, response.data])
        })
        .catch(() => {
            commit('setUsers', [false])
        })
}

export function createUser({commit}, user) {
    return axiosClient.post('/users', user)
}

export function updateUser({commit}, user) {
    const id = user.id
    return axiosClient.put(`/users/${id}}`, user)
}

export function deleteUser({commit}, id) {
    return axiosClient.delete(`/users/${id}}`)
}
