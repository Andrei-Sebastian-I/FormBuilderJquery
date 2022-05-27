<template>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <form class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <div class="form-group mb-0">
                <base-input placeholder="Search"
                            class="input-group-alternative"
                            alternative=""
                            addon-right-icon="fas fa-search">
                </base-input>
            </div>
        </form>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                <span class="avatar avatar-sm rounded-circle">
                  <img alt="Image placeholder" :src="photoURL">
                </span>
                        <div class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">{{displayName}}</span>
                        </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Welcome!</h6>
                        </div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>My profile</span>
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <button @click="logout" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Logout</span>
                        </button>
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
    import firebase from '../config/db.js';
    import { bus } from '../main'

    export default {
        props: {
            pEmail: {
                type: String
            } ,
            pDisplayName: {
                type: String
            } ,
            pPhotoURL: null
        },
        data() {
            return {
                activeNotifications: false,
                showMenu: false,
                searchQuery: '',
                email: this.pEmail,
                displayName: this.pDisplayName,
                photoURL: this.pPhotoURL
            };
        },
        mounted: function () {
            this.userData()
        }, created: function () {
            this.userData();
        },
        updated:function (){
            this.userData()
        },
        methods: {
            toggleSidebar() {
                this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
            },
            hideSidebar() {
                this.$sidebar.displaySidebar(false);
            },
            toggleMenu() {
                this.showMenu = !this.showMenu;
            },
            userData: function () {
                var user = firebase.auth().currentUser;
                var name, email, photoUrl, uid;

                if (user != null) {
                    name = user.displayName;
                    email = user.email;
                    photoUrl = user.photoURL;
                }
                if (this.email == null) {
                    this.email = email;
                    this.displayName = name;
                    this.photoURL = photoUrl;
                }
            } ,
            logout: function () {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('login')
                })
            },
        }
    };
</script>
