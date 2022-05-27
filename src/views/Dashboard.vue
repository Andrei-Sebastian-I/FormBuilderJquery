<template>
    <div>
        <base-header type="gradient-primary" class="pb-6 pb-8 pt-5 pt-md-8">

        </base-header>

        <!--Charts-->
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <card>
                        <a :href="photoURL" target="_blank">
                            <img  :src="photoURL"
                                 class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 140px;">
                        </a>
                        <div class="pt-4 text-center">
                            <h5 class="h3 title">
                                <span class="d-block mb-1">{{displayName}}</span>
                                <small class="h4 font-weight-light text-muted">Web Developer</small>
                            </h5>
                            <div class="mt-3">
                                <router-link :to="{ name: 'profile' }" class=" btn btn-primary text-white btn-icon-only">
                                    <i class="fa fa-pencil-alt"></i>
                                </router-link>
                            </div>
                        </div>
                    </card>
                </div>

            </div>
            <!-- End charts-->

        </div>

    </div>
</template>
<script>

  import firebase from '../config/db.js';
  export default {
      props: {
          pEmail: '',
          pDisplayName: null,
          pPhotoURL: null
      },
    data() {
      return {
          email: this.pEmail,
          displayName: this.pDisplayName,
          photoURL: this.pPhotoURL
      };
    },
    methods: {
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
        }
    },
    mounted() {
      this.userData();
    }
  };
</script>
<style></style>
