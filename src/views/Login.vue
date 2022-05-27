<template>
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-body px-lg-5 py-lg-5">
                        <div class="text-center text-muted mb-4">
                            <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
                        </div>
                        <form role="form">
                            <div class="form-group mb-3" v-bind:class="{ 'd-none': hasError }">
                                <small class="text-danger">{{errorMsg}}</small>
                            </div>
                            <base-input class="input-group-alternative mb-3"
                                        placeholder="Email"
                                        addon-left-icon="ni ni-email-83"
                                        v-model="email">
                            </base-input>

                            <base-input class="input-group-alternative"
                                        placeholder="Password"
                                        type="password"
                                        addon-left-icon="ni ni-lock-circle-open"
                                        v-model="password">
                            </base-input>
                            <div class="text-center">
                                <base-button type="primary" class="my-4" @click="login">Sign in</base-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
    import firebase from '../config/db.js';

    window.$ = window.jQuery = require('jquery');
    export default {
        name: 'login',
        data() {
            return {
                email: '',
                password: '',
                hasError: true,
                errorMsg: ''
            }
        }, methods: {
            login: function () {
                firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
                    (user) => {
                        this.$router.replace('dashboard')
                    },
                    (err) => {
                        this.hasError = false
                        this.errorMsg = err;
                    }
                );
            }
        }
    }
</script>
<style>
</style>
