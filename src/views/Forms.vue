<template>
    <div>
        <base-header type="gradient-primary" class="pb-6 pb-8 pt-5 pt-md-8">
            <!-- Card stats -->

        </base-header>

        <div class="container-fluid pt-4">
            <div class="row">
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card card-profile shadow">
                        <div class="card-body pt-0 pt-md-4">
                            <div class="row align-items-center h-100">
                                <div class="col-6">
                                    <h4 class=" text-uppercase text-muted  font-weight-bold mt-3">Add New</h4>
                                </div>
                                <div class="col-6 align-middle d-flex justify-content-end">
                                    <router-link :to="{ name: 'form create' }" class=" btn btn-sm btn-primary text-white btn-icon-only rounded-circle mt-1">
                                        <i class="fa fa-plus"></i>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-for="(item, key, index) of list" :key="item['.key']" class="col-xl-4 col-md-6 mb-4">
                    <div class="card card-profile shadow">
                        <!-- Card body -->
                        <div class="card-body pt-0 pt-md-4">
                            <div class="row align-items-center h-100">
                                <div class="col-6">
                                    <h4 class=" text-uppercase text-muted  font-weight-bold mt-3">{{item.name}}</h4>
                                </div>
                                <div class="col-6 align-middle d-flex justify-content-end">
                                    <router-link
                                                 :to="{ name: 'form data', params: { id: key } }"
                                                 class=" btn btn-sm btn-success btn-icon-only rounded-circle mt-1">
                                        <i class="fa fa-eye"></i>
                                    </router-link>
                                    <router-link
                                                 :to="{ name: 'form update', params: { id: key } }"
                                                 class=" btn btn-sm btn-primary btn-icon-only rounded-circle mt-1">
                                        <i class="fa fa-pencil-alt"></i>
                                    </router-link>
                                    <button @click="deleteForm(key)" type="button"
                                            class=" btn btn-sm btn-danger btn-icon-only rounded-circle mt-1">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    window.$ = window.jQuery = require('jquery');
    import firebase from '../config/db.js';

    const {db} = require('../config/db.js');

    import swal from 'sweetalert2'

    export default {
        name: 'forms',
        firebase : function (){
            var tableList = db.ref('tables');
                var data = [];
                var that = this;
                $.when(tableList.on('value', function (snapshot) {
                data = snapshot.val();
                })).then(function () {
                that.list = data;
                });
        },
        data() {
            return {
                list: [],
                publicPath: process.env.BASE_URL,
            }
        },
        mounted: function () {
            this.getFormList();
        },
        updated: function () {
            this.getFormList();
        },
        methods: {
            getFormList: function () {
                var tableList = db.ref('tables');
                var data = [];
                var that = this;
                $.when(tableList.on('value', function (snapshot) {
                data = snapshot.val();
                })).then(function () {
                that.list = data;
                });
            },
            deleteForm: function (data_key) {
                var that = this;

                swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    type: "warning",
                    showCancelButton: !0,
                    icon: 'warning',
                    confirmButtonColor: "#0CC27E",
                    cancelButtonColor: "#FF586B",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel!",
                    confirmButtonClass: "btn btn-success mr-5",
                    cancelButtonClass: "btn btn-danger",
                    buttonsStyling: !1
                }).then((result) => {
                    if (result.value) {

                        db.ref('/tables/' + data_key).remove();
                        db.ref('/data/' + data_key).remove();
                        swal.fire({
                            text: "Form deleted successfully...",
                            type: "success",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
        }

    };
</script>

