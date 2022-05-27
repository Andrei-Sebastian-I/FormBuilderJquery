<template>
    <div>
        <base-header type="gradient-primary" class="pb-10 pb-8 pt-5 pt-md-8">
            <!-- Card stats -->

        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header border-0 bg-transparent">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h3 class="mb-0" >
                                        Files
                                    </h3>
                                </div>
                                <div class="col text-right">
                                    <button class=" btn btn-primary text-white btn-icon-only rounded-circle mt-1"
                                            data-toggle="modal" data-target="#fileUpload">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-flush">
                                <thead class="thead-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Upload Date</th>
                                    <th class="text-center">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="!allFiles">
                                        <td align="center" colspan="100%">No row found</td>
                                    </tr>
                                    <tr v-for="(file, key, index) of allFiles" :key="file['.key']">
                                        <td>{{ file.imageName }}</td>
                                        <td>{{ file.date }}</td>
                                        <td class="text-center">
                                            <a :href="file.downloadURL" target="__blank"
                                               class=" btn btn-sm btn-info btn-icon-only rounded-circle mt-1" download>
                                                <i class="fa fa-eye"></i>
                                            </a>
                                            <button @click="alertConfirm(file.imageName,key)" type="button"
                                                    class=" btn btn-sm btn-danger btn-icon-only rounded-circle mt-1">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Start New data record Modal -->
        <div class="modal fade" id="fileUpload" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">New File Upload</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form v-on:submit.prevent id="formRender">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="files" name="file" ref="uploadInput"
                                       :multiple="false" @change="detectFiles($event)">
                                <label class="custom-file-label" for="files">Select file</label>
                            </div>
                             <div v-if="uploading && !uploadEnd" class="progress-wrapper">
                                 <div class="progress-info">
                                     <div class="progress-label">
                                         <span>Uploading</span>
                                     </div>
                                     <div class="progress-percentage">
                                         <span> {{progressUpload}}%</span>
                                     </div>
                                 </div>
                                 <div class="progress">
                                     <div class="progress-bar bg-success" role="progressbar"
                                          :aria-valuenow="progressUpload" :style="{'width': `${progressUpload}%`}"></div>
                                 </div>
                             </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End New data record Modal -->
    </div>


</template>
<script>
    window.$ = window.jQuery = require('jquery');
    var {db} = require('../config/db.js');
    import firebase from '../config/db.js';
    import {firestorage} from '../config/db.js';
    require('bootstrap/dist/js/bootstrap.js');


    var formBuilder;
    import swal from 'sweetalert2'

    export default {
        data() {
            return {
                progressUpload: 0,
                fileName: '',
                uploadTask: '',
                uploading: false,
                uploadEnd: false,
                downloadURL: '',
                currentDate: '',
                imgFileName: '',
                allFiles: []
            }
        },
        mounted: function () {
            this.getUserFiles();
        },
        methods: {
            getUserFiles: function () {
                var that = this;
                db.ref('UserImages').on('value', (snap) => {
                    that.allFiles = snap.val();
                });
            },
            selectFile() {
                this.$refs.uploadInput.click()
            },
            detectFiles(e) {
                console.log(1);
                let fileList = e.target.files || e.dataTransfer.files
                Array.from(Array(fileList.length).keys()).map(x => {
                    this.upload(fileList[x])
                })
            },
            upload(file) {
                this.fileName = file.name
                this.uploading = true
                this.uploadTask = firestorage.ref('images/' + file.name).put(file)

                this.currentDate = (new Date().getDay()) + '/' + (new Date().getMonth()) + '/' + (new Date().getFullYear());
                this.imgFileName = file.name
            },
            downloadFile(filename, key) {
                firestorage.ref('images/').child(filename).getDownloadURL().then(function (url) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.responseType = "blob";
                    xhr.onload = function () {
                        var urlCreator = window.URL || window.webkitURL;
                        var imageUrl = urlCreator.createObjectURL(this.response);
                        var tag = document.createElement('a');
                        tag.href = imageUrl;
                        tag.download = filename;
                        document.body.appendChild(tag);
                        tag.click();
                        document.body.removeChild(tag);
                    }
                    xhr.send();

                }).catch(function (error) {
                    // Handle any errors
                });
            },
            alertConfirm(filename, key) {
                filename = filename
                key = key
                var that = this;
                swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    type: "warning",
                    icon: "warning",
                    showCancelButton: !0,
                    confirmButtonColor: "#0CC27E",
                    cancelButtonColor: "#FF586B",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel!",
                    confirmButtonClass: "btn btn-success mr-5",
                    cancelButtonClass: "btn btn-danger",
                    buttonsStyling: !1
                }).then(function (result) {

                    if (result.value) {
                        firestorage
                            .ref('images/' + filename)
                            .delete()
                            .then(() => {

                            })
                            .catch((error) => {
                                console.error(`file delete error occured: ${error}`)
                            })

                        db.ref('UserImages').child(key).remove();
                        that.getUserFiles();

                        swal.fire({
                            title: "Success!",
                            text: "Your file has been deleted.",
                            type: "success",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }, function (t) {
                    "cancel" === t && swal("Cancelled", "Your file is safe :)", "error")
                });
                this.uploading = false;
                this.uploadEnd = false;
                this.downloadURL = '';
            }
        },
        watch: {
            uploadTask: function () {
                this.uploadTask.on('state_changed', sp => {
                        this.uploadEnd = false
                        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
                    },
                    null,
                    () => {
                        this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                            this.uploadEnd = true
                            this.downloadURL = downloadURL
                            this.$emit('downloadURL', downloadURL)
                            db.ref('UserImages').push({
                                'imageName': this.imgFileName,
                                'date': this.currentDate,
                                'downloadURL': downloadURL
                            })

                            $('#fileUpload').modal('hide');
                            this.getUserFiles();

                            swal({
                                title: "Success!",
                                text: "Your file has been saved",
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })
                    })
            }
        }
    };
</script>
<style></style>
