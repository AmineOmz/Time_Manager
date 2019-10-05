<template>
    <div>
        <p> <b>&nbsp;&nbsp;&nbsp;{{ today }}</b></p>
        <center><b-jumbotron header="Pointez" lead="Pensez à pointer à votre arrivée, et dès votre départ." class="center" border-variant="dark"><br>
            <b-button variant="primary" v-on:click="patchClock">Pointer</b-button><br/><br/>
            <div v-if="statusClock">
                <br/>
                <p>Vous êtes actuellement: Au travail</p>
                <b><span>Dernière Arrivée: <br/><b>{{ timeClock }}</b></span></b>
            </div>
            <div v-if="!statusClock">
                <br/>
                <p>Vous êtes actuellement: En dehors</p>
                <b><span>Dernier Départ:<br/><b>{{ timeClock }}</b></span></b>
            </div>
           
        </b-jumbotron></center><br><br>
        <b-card bg-variant="light" text-variant="dark" border-variant="dark" title="Récapitulatif horaire d'aujourd'hui">
            <b-card-text>
                Arrivé(e): <date-picker format="YYYY-MM-DD HH:mm:ss" valueType="format" v-model="setArrival" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
            </b-card-text>
            <b-card-text>
                Parti(e): <date-picker format="YYYY-MM-DD HH:mm:ss" valueType="format" v-model="setDeparture" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
            </b-card-text>
            <center><b-button href="#" variant="primary" v-on:click="setWorkingTime">Mettez à jour vos horaires</b-button></center>
        </b-card>
    </div>
</template>

<script>

import moment, { duration } from 'moment';
import { setInterval, clearInterval } from 'timers';
import axios from 'axios';
import Swal from 'sweetalert2';
import datetime from 'vuejs-datetimepicker';
import jwt_decode from 'jwt-decode';
import DatePicker from 'vue2-datepicker'

export default {
    name: 'TimeManager',
    components: {
        datetime,
        DatePicker
    },
    data() {
        return {
            shortcuts: [
                {
                    text: 'OK',
                    onClick: () => {
                        this.setArrival = [new Date()],
                        this.departure = [new Date()]
                    }
                }
            ],
            timeOptions: {
                start: '',
                step: '',
                end: ''
            },
            lang: {
                days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            today: moment().format('LLLL'),
            interval: null,
            chrono: null,
            arrival: null,
            departure: null,
            statusClock: false,
            timeClock: null,
            finalChrono: null,
            setDeparture: null,
            setArrival: null
        }
    },
    mounted() {
        this.getClock()
        .then((data) => {
            this.statusClock = data.status
            this.timeClock = moment.utc(data.time).format('YYYY-MM-DD HH:mm:ss')
        })
    }
    ,
    methods:{
        getClock(){
            return new Promise((resolve) => {
                var token = localStorage.getItem('token')
                var query = "https://timepool.me:3001/api/clocks/user/" + jwt_decode(token).id;
                var self = this;
                axios.get(query, {
                    headers: {Authorization: 'Bearer ' + token}
                })
                .then(function(result) {
                    resolve(result.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            }); 
        },
        patchClock(){
            var token = localStorage.getItem('token');
            var self = this;
            var oldStatus = self.statusClock;
            self.statusClock = !self.statusClock;
            var timeWhenClicked = moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            console.log(timeWhenClicked);
            var clockObject = {status: self.statusClock, time: timeWhenClicked};
            axios.patch('https://timepool.me:3001/api/clocks/user/' + jwt_decode(token).id, clockObject, {
                    headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
            })
            .then(function() {  
                if(oldStatus) {
                    var timeWorked = moment.utc(timeWhenClicked).diff(moment.utc(self.timeClock));
                    var hours = parseInt(moment.duration(timeWorked).asHours());
                    var minutes = parseInt(moment.duration(timeWorked).asMinutes())%60;
                    Swal.fire(`Vous avez travaillé ${hours} H et ${minutes} m`);
                }
                self.getClock()
                .then(data => {
                    self.timeClock = moment.utc(data.time).format('YYYY-MM-DD HH:mm:ss')
                })
            })  
            .catch((error) => {
                console.log(error);
            });      
        },
        setWorkingTime() {
            if (this.chrono == null && (this.setDeparture == null || this.setArrival == null)) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Erreur: rien à mettre à jour!',
                    footer: 'Merci de réessayez'
                })
                return;
            }

            if (this.chrono != null && (this.setDeparture == null || this.setArrival == null)) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Erreur: Vous ne pouvez pas mettre à jour, le chronomètre tourne toujours',
                    footer: 'Merci de le mettre à jour après avoir fini votre travail'
                })
                return;
            }

            if (this.statusClock == false && this.setArrival != null && this.setDeparture != null) {

                this.clocks = {
                    status: true,
                    time: this.setArrival
                }

                // SET L ARRIVEE
                axios.patch('https://timepool.me:3001/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id, this.clocks, {
                    headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {

                    this.clocks = {
                        status: false,
                        time: this.setDeparture
                    }

                    // SET LE DEPART
                    axios.patch('https://timepool.me:3001/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id, this.clocks, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then((response) => {
                        return;
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                })
                .catch((error) => {
                    console.log(error);
                });
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Erreur: rien à mettre à jour',
                    footer: 'Merci de réessayez'
                })
            }
    }
}
}
</script>
